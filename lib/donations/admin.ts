import "server-only";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { donationConfig } from "./config";

function adminApp() {
  return getApps().find(a => a.name === "donations") ?? initializeApp({
    credential: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }) : applicationDefault(),
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }, "donations");
}
export const donationDb = () => getFirestore(adminApp());
export async function requireDonationAdmin(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) throw new HttpError(401, "Sign in to continue.");
  let claims;
  try { claims = await getAuth(adminApp()).verifyIdToken(token, true); }
  catch { throw new HttpError(401, "Please sign in again."); }
  const roles = Array.isArray(claims.roles) ? claims.roles : [claims.role];
  const emails = (process.env.ADMIN_EMAILS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (claims.admin !== true && !roles.some(r => donationConfig.adminRoles.includes(r)) &&
      !(claims.email_verified && claims.email && emails.includes(claims.email.toLowerCase()))) {
    throw new HttpError(403, "Administrator access required.");
  }
  return claims.uid;
}
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
