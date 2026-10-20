import { createHmac } from 'node:crypto';
import { secret, equalSignature } from '@/lib/donations/quotes';
import { reconcileDonation, validReference } from '@/lib/donations/payments';
import { donationConfig } from '@/lib/donations/config';
import { HttpError } from '@/lib/donations/admin';
import { json, readBody, safeRoute } from '@/lib/donations/http';
export const runtime = 'nodejs';
export async function POST(request: Request) { return safeRoute(async () => {
  const raw = await readBody(request,262144);
  const signature = request.headers.get('x-paystack-signature') || '';
  const expected = createHmac('sha512',secret('PAYSTACK_SECRET_KEY')).update(raw).digest('hex');
  if (!/^[a-fA-F0-9]{128}$/.test(signature) || !equalSignature(signature,expected,'hex')) throw new HttpError(401,'Invalid signature.');
  let event;
  try { event = JSON.parse(raw.toString('utf8')); } catch { throw new HttpError(400,'Invalid event.'); }
  if (!['charge.success','charge.pending','charge.failed'].includes(event?.event)) return json({received:true});
  let metadata = event.data?.metadata;
  if (typeof metadata === 'string') { try { metadata = JSON.parse(metadata); } catch { metadata = null; } }
  if (!validReference(event.data?.reference) || metadata?.donation !== true || metadata?.source !== donationConfig.source) return json({received:true});
  // Always independently verify, including conflicting or out-of-order events.
  await reconcileDonation(event.data.reference,event.data);
  return json({received:true});
}); }

