import { donationDb, requireDonationAdmin } from '@/lib/donations/admin';
import { json, jsonBody, safeRoute, rateLimit } from '@/lib/donations/http';
import { reconcileDonation } from '@/lib/donations/payments';
export const runtime = 'nodejs';
export async function GET(request: Request) { return safeRoute(async () => {
  await requireDonationAdmin(request);
  const cursor = new URL(request.url).searchParams.get('cursor');
  let query = donationDb().collection('donations').orderBy('__name__').limit(50);
  if (cursor && /^[a-z0-9-]{1,100}$/.test(cursor)) query = query.startAfter(cursor);
  const page = await query.get();
  const donations = page.docs.map(doc => { const d = doc.data(); return {reference:doc.id,status:d.status,donorEmail:d.donorEmail,donorName:d.donorName,purpose:d.purpose,amountSubunit:d.amountSubunit,reason:d.reason,initializedAt:d.initializedAt?.toDate().toISOString() ?? null}; });
  const successful = donationDb().collection('donations').where('status','==','success');
  const total = await successful.aggregate({amount:(await import('firebase-admin/firestore')).AggregateField.sum('amountSubunit'),count:(await import('firebase-admin/firestore')).AggregateField.count()}).get();
  return json({donations,nextCursor:page.size === 50 ? page.docs[49].id:null,totalSubunit:total.data().amount,successfulCount:total.data().count});
}); }
export async function POST(request: Request) { return safeRoute(async () => { await requireDonationAdmin(request); await rateLimit(request,'admin-reconcile',30); const body = await jsonBody(request); return json(await reconcileDonation(body.reference)); }); }
