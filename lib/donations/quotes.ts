import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { donationConfig as config, isDonationCurrency, parseDonationAmount } from './config';
import { HttpError } from './admin';
export type Quote = { v: 1; inputCurrency: 'KES'|'USD'; inputAmountSubunit: number; chargeAmountSubunit: number; exchangeRate: string|null; exchangeRateDate: string|null; expiresAt: number };
export function secret(name: string) {
  const value = process.env[name];
  if (!value || value.length < 24) throw new HttpError(503, 'Donations are temporarily unavailable.');
  return value;
}
function signingKey() {
  // Domain-separated derivation keeps quote signatures separate from Paystack webhook signatures.
  return createHmac('sha256', (process.env.DONATION_QUOTE_SIGNING_SECRET ? secret('DONATION_QUOTE_SIGNING_SECRET') : secret('PAYSTACK_SECRET_KEY'))).update('donations:quote:key:v1:' + config.siteId).digest();
}
export function equalSignature(actual: string, expected: string, encoding: 'hex'|'base64url') {
  const a = Buffer.from(actual, encoding), b = Buffer.from(expected, encoding);
  return a.length === b.length && timingSafeEqual(a,b);
}
function signature(payload: string) { return createHmac('sha256', signingKey()).update('donations:quote:v1:' + payload).digest('base64url'); }
export function signQuote(quote: Quote) { const payload = Buffer.from(JSON.stringify(quote)).toString('base64url'); return payload + '.' + signature(payload); }
export function convertAmount(amount: number, rate: string) {
  if (!/^\d{1,6}(\.\d{1,10})?$/.test(rate) || Number(rate) <= 0) throw new HttpError(503, 'A valid exchange rate is unavailable.');
  const [whole, fraction=''] = rate.split('.');
  const scale = BigInt(10) ** BigInt(fraction.length);
  const numerator = BigInt(whole + fraction);
  const converted = Number((BigInt(amount) * numerator + scale / BigInt(2)) / scale);
  if (!Number.isSafeInteger(converted) || converted < config.currencies.KES.min || converted > config.currencies.KES.max) throw new HttpError(400, 'Converted amount is outside the KES donation limits.');
  return converted;
}
function validDate(date: unknown, fresh: boolean) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const time = Date.parse(date + 'T00:00:00Z');
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === date && time <= Date.now() && (!fresh || Date.now()-time <= 7*86400000);
}
let cachedRate: { rate: string; date: string; fetched: number } | undefined;
export async function createQuote(amount: unknown, currency: unknown) {
  if (!isDonationCurrency(currency)) throw new HttpError(400,'Choose KES or USD.');
  let input: number;
  try { input = parseDonationAmount(amount,currency); } catch { throw new HttpError(400,'Enter an amount within the permitted limits, using up to two decimal places.'); }
  let rate = null, date = null;
  if (currency === 'USD') {
    if (!cachedRate || Date.now()-cachedRate.fetched > 3600000 || !validDate(cachedRate.date,true)) {
      const response = await fetch(config.rateUrl,{signal:AbortSignal.timeout(10000),cache:'no-store'});
      if (!response.ok) throw new HttpError(503,'Exchange rates are temporarily unavailable.');
      const data = await response.json();
      if (data.base !== 'USD' || data.quote !== 'KES' || !validDate(data.date,true)) throw new HttpError(503,'A current exchange rate is unavailable.');
      const value = String(data.rate);
      convertAmount(100,value);
      cachedRate = {rate:value,date:data.date,fetched:Date.now()};
    }
    rate = cachedRate.rate; date = cachedRate.date;
  }
  const quote: Quote = {v:1,inputCurrency:currency,inputAmountSubunit:input,chargeAmountSubunit:rate ? convertAmount(input,rate) : input,exchangeRate:rate,exchangeRateDate:date,expiresAt:Math.floor(Date.now()/1000)+900};
  return {...quote,token:signQuote(quote),chargeCurrency:'KES',exchangeRateProvider:rate ? config.rateProvider : null,expiresAt:new Date(quote.expiresAt*1000).toISOString()};
}
export function verifyQuote(token: unknown, amount: unknown, currency: unknown): Quote {
  try {
    if (typeof token !== 'string' || token.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) throw 0;
    const [payload,sig] = token.split('.');
    if (!equalSignature(sig,signature(payload),'base64url')) throw 0;
    const q: Quote = JSON.parse(Buffer.from(payload,'base64url').toString());
    const now = Math.floor(Date.now()/1000);
    if (q.v !== 1 || !isDonationCurrency(currency) || q.inputCurrency !== currency || q.inputAmountSubunit !== parseDonationAmount(amount,currency) || !Number.isSafeInteger(q.expiresAt) || q.expiresAt <= now || q.expiresAt > now+900) throw 0;
    if (currency === 'KES' ? q.exchangeRate !== null || q.exchangeRateDate !== null || q.chargeAmountSubunit !== q.inputAmountSubunit : typeof q.exchangeRate !== 'string' || !validDate(q.exchangeRateDate,true) || convertAmount(q.inputAmountSubunit,q.exchangeRate) !== q.chargeAmountSubunit) throw 0;
    return q;
  } catch { throw new HttpError(400,'Your quote is invalid or expired. Please request a new quote.'); }
}

