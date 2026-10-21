import 'server-only';
import { createHash } from 'node:crypto';
import { donationDb, HttpError, withDonationDatabaseTimeout } from './admin';
export async function readBody(request: Request, limit = 8192) {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413,'Request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400,'Request body required.');
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) { const {value,done} = await reader.read(); if (done) break; length += value.length; if (length > limit) { await reader.cancel(); throw new HttpError(413,'Request is too large.'); } chunks.push(value); }
  return Buffer.concat(chunks);
}
export async function jsonBody(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new HttpError(415,'Use application/json.');
  try { const value = JSON.parse((await readBody(request)).toString('utf8')); if (!value || typeof value !== 'object' || Array.isArray(value)) throw 0; return value; }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400,'Invalid JSON request.'); }
}
export async function rateLimit(request: Request, scope: string, limit = 20) {
  // Only trust an IP header explicitly configured for the deployment's reverse proxy.
  const header = process.env.DONATION_TRUSTED_IP_HEADER;
  const identity = header ? request.headers.get(header)?.split(',')[0].trim() || 'unknown' : 'shared';
  const minute = Math.floor(Date.now()/60000);
  const id = createHash('sha256').update(scope + ':' + identity + ':' + minute).digest('hex');
  const db = donationDb(), ref = db.collection('donationRateLimits').doc(id);
  await withDonationDatabaseTimeout(db.runTransaction(async tx => {
    const snap = await tx.get(ref); const count = snap.data()?.count || 0;
    if (count >= limit) throw new HttpError(429,'Too many requests. Please try again shortly.');
    tx.set(ref,{count:count+1,expiresAt:new Date((minute+2)*60000)});
  }));
}
export function json(value: unknown, status = 200) { return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}}); }
export async function safeRoute(work: () => Promise<Response>) {
  try { return await work(); } catch (error) {
    return json({error:error instanceof HttpError ? error.message : 'Unable to complete this request. Please try again.'},error instanceof HttpError ? error.status : 503);
  }
}
