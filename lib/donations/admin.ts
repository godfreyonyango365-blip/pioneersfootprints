import "server-only";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { donationConfig } from "./config";

function adminEnvironment() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim().replace(/^["']|["']$/g, "");
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim().replace(/^["']|["']$/g, "");
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  const useApplicationDefault = process.env.FIREBASE_USE_APPLICATION_DEFAULT_CREDENTIALS === "true";

  if (!projectId || !/^[a-z0-9][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)) {
    throw new HttpError(503, "Donation storage is not configured correctly.");
  }

  if (!privateKey && !useApplicationDefault) {
    throw new HttpError(503, "Donation storage is not configured correctly.");
  }

  if (privateKey) {
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.iam\.gserviceaccount\.com$/.test(clientEmail) ||
        !privateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
        !privateKey.endsWith("-----END PRIVATE KEY-----")) {
      throw new HttpError(503, "Donation storage is not configured correctly.");
    }
  }

  return { projectId, clientEmail, privateKey };
}

function adminApp() {
  const existing = getApps().find(a => a.name === "donations");
  if (existing) return existing;

  const environment = adminEnvironment();
  return initializeApp({
    credential: environment.privateKey ? cert({
      projectId: environment.projectId,
      clientEmail: environment.clientEmail,
      privateKey: environment.privateKey,
    }) : applicationDefault(),
    projectId: environment.projectId,
  }, "donations");
}
export const donationDb = () => getFirestore(adminApp());
export async function withDonationDatabaseTimeout<T>(operation: Promise<T>, timeoutMs = 8_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new HttpError(503, "Donation storage is temporarily unavailable.")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
export async function requireDonationAdmin(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) throw new HttpError(401, "Sign in to continue.");
  let claims;
  try { claims = await getAuth(adminApp()).verifyIdToken(token, true); }
  catch { throw new HttpError(401, "Please sign in again."); }
  const roles = Array.isArray(claims.roles) ? claims.roles : [claims.role];
  const emails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim().replace(/^["']|["']$/g, "").toLowerCase())
    .filter(Boolean);
  const trustedClaim = claims.admin === true || roles.some(r => donationConfig.adminRoles.includes(r));
  const allowlistedEmail = claims.email && emails.includes(claims.email.toLowerCase());
  if (!trustedClaim && allowlistedEmail && !claims.email_verified) {
    throw new HttpError(403, "Verify your administrator email before continuing.");
  }
  if (!trustedClaim && !(claims.email_verified && allowlistedEmail)) {
    throw new HttpError(403, "Administrator access required.");
  }
  return claims.uid;
}
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
