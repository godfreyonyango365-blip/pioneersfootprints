import 'server-only';
import { randomBytes } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { donationConfig as config, donationSubunitToMajor, isDonationPurpose } from './config';
import { donationDb, HttpError } from './admin';
import { secret, verifyQuote } from './quotes';
export function validReference(value: unknown): value is string { return typeof value === 'string' && value.startsWith(config.referencePrefix) && /^[a-f0-9]{32}$/.test(value.slice(config.referencePrefix.length)); }
export function siteUrl() {
  let url: URL;
  try { url = new URL(process.env.SITE_URL || ''); } catch { throw new HttpError(503,'Donation checkout is not configured.'); }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash || (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) || (process.env.NODE_ENV === 'production' && (url.hostname === 'localhost' || /^\d+\./.test(url.hostname)))) throw new HttpError(503,'Donation checkout is not configured.');
  return url;
}
export function validCheckout(value: unknown): value is string {
  try { const url = new URL(String(value)); return url.protocol === 'https:' && url.hostname === config.checkoutHost && !url.username && !url.password && !url.port; } catch { return false; }
}
export async function gateway(path: string, body?: unknown) {
  const response = await fetch(config.gateway + path,{method:body ? 'POST':'GET',headers:{Authorization:`Bearer ${secret('PAYSTACK_SECRET_KEY')}`,'Content-Type':'application/json'},body:body ? JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000),cache:'no-store',redirect:'error'});
  if (!response.ok) throw new HttpError(502,'The payment provider is temporarily unavailable.');
  const result = await response.json();
  if (result.status !== true || !result.data || typeof result.data !== 'object') throw new HttpError(502,'The payment provider could not complete this request.');
  return result.data;
}
export async function initializeDonation(body: Record<string,unknown>) {
  const quote = verifyQuote(body.quoteToken,body.amount,body.currency);
  if (typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) throw new HttpError(400,'Enter a valid receipt email.');
  if (body.donorName !== undefined && (typeof body.donorName !== 'string' || body.donorName.length > 100 || /[\x00-\x1f\x7f]/.test(body.donorName))) throw new HttpError(400,'Enter a name of up to 100 characters.');
  if (!isDonationPurpose(body.purpose)) throw new HttpError(400,'Choose a valid donation purpose.');
  const callback = new URL('/donate/confirmation',siteUrl()).href;
  const reference = config.referencePrefix + randomBytes(16).toString('hex');
  const ref = donationDb().collection('donations').doc(reference);
  const name = typeof body.donorName === 'string' ? body.donorName.trim() : '';
  const record = {reference,siteId:config.siteId,source:config.source,donorEmail:body.email.trim().toLowerCase(),donorName:name || 'Anonymous',purpose:config.purposes[body.purpose],purposeId:body.purpose,currency:'KES',amountSubunit:quote.chargeAmountSubunit,donorInputCurrency:quote.inputCurrency,donorInputAmountSubunit:quote.inputAmountSubunit,exchangeRate:quote.exchangeRate,exchangeRateDate:quote.exchangeRateDate,exchangeRateProvider:quote.exchangeRate ? config.rateProvider:null,status:'pending',reason:'Awaiting payment completion.',initializedAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()};
  await ref.create(record);
  try {
    const data = await gateway('/transaction/initialize',{amount:String(record.amountSubunit),currency:'KES',email:record.donorEmail,reference,callback_url:callback,metadata:{donation:true,source:config.source,donor_name:name,donation_purpose:body.purpose,donation_currency:'KES',donation_amount_major:donationSubunitToMajor(record.amountSubunit),donation_amount_subunit:record.amountSubunit,donor_input_currency:quote.inputCurrency,donor_input_amount_major:donationSubunitToMajor(quote.inputAmountSubunit),donor_input_amount_subunit:quote.inputAmountSubunit,usd_to_kes_rate:quote.exchangeRate,exchange_rate_date:quote.exchangeRateDate,exchange_rate_provider:record.exchangeRateProvider,custom_fields:[]}});
    if (data.reference !== reference || !validCheckout(data.authorization_url)) throw new HttpError(502,'The payment provider returned an invalid checkout.');
    return {authorizationUrl:data.authorization_url as string,reference};
  } catch {
    await donationDb().runTransaction(async tx => { const snap = await tx.get(ref); if (snap.data()?.status !== 'success') tx.update(ref,{status:'failed',reason:'Checkout could not be initialized. Please try a new donation.',updatedAt:FieldValue.serverTimestamp()}); });
    throw new HttpError(502,'Checkout could not be initialized. Please try again.');
  }
}
export async function reconcileDonation(reference: string, event?: {id?: unknown; amount?: unknown; currency?: unknown}) {
  if (!validReference(reference)) throw new HttpError(400,'Invalid donation reference.');
  const db = donationDb(), ref = db.collection('donations').doc(reference);
  const existing = await ref.get();
  if (!existing.exists) throw new HttpError(404,'Donation record not found.');
  if (event && (event.currency !== 'KES' || event.amount !== existing.data()?.amountSubunit || !/^[1-9][0-9]{0,30}$/.test(String(event.id)))) throw new HttpError(409,'Payment event details could not be confirmed.');
  const data = await gateway('/transaction/verify/' + encodeURIComponent(reference));
  return db.runTransaction(async tx => {
    const snap = await tx.get(ref), record = snap.data();
    let metadata = data.metadata;
    if (typeof metadata === 'string') { try { metadata = JSON.parse(metadata); } catch { metadata = null; } }
    if (!record || record.reference !== reference || record.source !== config.source || record.siteId !== config.siteId || record.currency !== 'KES' || data.reference !== reference || data.currency !== 'KES' || !Number.isSafeInteger(data.amount) || data.amount !== record.amountSubunit || metadata?.donation !== true || metadata?.source !== config.source || (data.requested_amount !== undefined && data.requested_amount !== null && Number(data.requested_amount) !== data.amount) || !/^[1-9][0-9]{0,30}$/.test(String(data.id)) || (event && String(event.id) !== String(data.id)) || (record.gatewayTransactionId && record.gatewayTransactionId !== String(data.id)) || typeof data.customer?.email !== 'string' || data.customer.email.toLowerCase() !== record.donorEmail.toLowerCase()) throw new HttpError(409,'Payment details could not be confirmed.');
    const status = data.status === 'success' ? 'success' : ['failed','abandoned','reversed'].includes(data.status) ? 'failed' : 'pending';
    if (status === 'success' && (!data.paid_at || !Number.isFinite(Date.parse(data.paid_at)))) throw new HttpError(409,'Payment details could not be confirmed.');
    const effective = record.status === 'success' ? 'success' : status;
    const reason = effective === 'success' ? 'Payment independently verified.' : effective === 'pending' ? 'Awaiting payment confirmation.' : 'Payment could not be confirmed as successful.';
    if (record.status !== 'success') {
      const transactionRef = db.collection('donationTransactions').doc(String(data.id));
      const bound = await tx.get(transactionRef);
      if (bound.exists && bound.data()?.reference !== reference) throw new HttpError(409,'Payment details conflict with an existing donation.');
      tx.set(transactionRef,{reference});
      tx.update(ref,{status:effective,reason,channel:typeof data.channel === 'string' ? data.channel.slice(0,50):null,gatewayTransactionId:String(data.id),verifiedDonorEmail:data.customer.email,verifiedAmountSubunit:data.amount,verifiedCurrency:'KES',paidAt:status === 'success' ? new Date(data.paid_at):null,updatedAt:FieldValue.serverTimestamp()});
    }
    return {reference,status:effective,reason,amountSubunit:record.amountSubunit,currency:'KES' as const};
  });
}

