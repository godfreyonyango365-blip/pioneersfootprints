'use client';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, LockKeyhole } from 'lucide-react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { donationConfig as config, DonationCurrency, formatDonationAmount, parseDonationAmount } from '@/lib/donations/config';
import { readDonationResponse } from '@/lib/donations/client';
type Quote = {token:string;inputCurrency:DonationCurrency;inputAmountSubunit:number;chargeCurrency:'KES';chargeAmountSubunit:number;exchangeRate:string|null;exchangeRateDate:string|null;exchangeRateProvider:string|null;expiresAt:string};
export default function DonationForm() {
  const [amount,setAmount] = useState('');
  const [currency,setCurrency] = useState<DonationCurrency>('KES');
  const [quote,setQuote] = useState<Quote|null>(null);
  const [quoteKey,setQuoteKey] = useState('');
  const [refresh,setRefresh] = useState(0);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [quoteError,setQuoteError] = useState('');
  const generation = useRef(0);
  const key = currency + ':' + amount;
  useEffect(() => {
    const id = ++generation.current;
    const controller = new AbortController();
    let refreshTimer: ReturnType<typeof setTimeout>;
    if (!amount.trim()) {
      return () => controller.abort();
    }
    const timer = setTimeout(async () => {
      setQuote(null); setQuoteError('');
      try {
        parseDonationAmount(amount,currency);
        const response = await fetch('/api/donations/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount,currency}),signal:controller.signal});
        const data = await readDonationResponse<Quote>(response,'The donation service is temporarily unavailable. Please try again shortly.');
        if (controller.signal.aborted || generation.current !== id) return;
        if (data.inputCurrency !== currency || data.inputAmountSubunit !== parseDonationAmount(amount,currency) || data.chargeCurrency !== config.chargeCurrency || !Number.isSafeInteger(data.chargeAmountSubunit) || Date.parse(data.expiresAt) <= Date.now()+30000) throw new Error('Please request a fresh quote.');
        setQuote(data); setQuoteKey(key);
        refreshTimer = setTimeout(() => { setQuote(null); setRefresh(n => n+1); },Math.max(0,Date.parse(data.expiresAt)-Date.now()-30000));
      } catch (err) { if (!controller.signal.aborted && generation.current === id) setQuoteError(err instanceof Error ? err.message : 'Unable to calculate your donation.'); }
    },350);
    return () => { controller.abort(); clearTimeout(timer); clearTimeout(refreshTimer); };
  },[amount,currency,key,refresh]);
  const ready = quote && quoteKey === key;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!ready || busy) return; if (Date.parse(quote.expiresAt) <= Date.now()) {setQuote(null);setRefresh(n => n+1);return;}
    setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/paystack/initialize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount,currency,quoteToken:quote.token,email:form.get('email'),donorName:form.get('donorName'),purpose:form.get('purpose')}),signal:AbortSignal.timeout(20000)});
      const data = await readDonationResponse<{authorizationUrl:string;reference:string}>(response,'Unable to start checkout. Please try again shortly.');
      const url = new URL(data.authorizationUrl);
      if (url.protocol !== 'https:' || url.hostname !== config.checkoutHost || url.username || url.password || url.port) throw new Error('Invalid checkout address.');
      window.location.assign(url.href);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to start checkout.'); setBusy(false); }
  }
  const field = 'mt-2 block w-full min-w-0 rounded-xl border border-slate-300 bg-white p-3 text-slate-950 focus:outline-2 focus:outline-blue-600 disabled:opacity-60';
  return <form onSubmit={submit} className="min-w-0 space-y-6 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl sm:p-8">
    <div><p className="text-sm font-semibold text-green-700">Secure hosted checkout</p><h2 className="mt-2 text-2xl font-bold">Make a donation</h2></div>
    <fieldset disabled={busy} className="grid min-w-0 gap-5 sm:grid-cols-3">
      <label className="font-medium">Currency<select value={currency} onChange={e => {setCurrency(e.target.value as DonationCurrency);setQuote(null);setQuoteError('');}} className={field}><option>KES</option><option>USD</option></select></label>
      <label className="font-medium sm:col-span-2">Donation amount<input name="amount" inputMode="decimal" required maxLength={11} value={amount} onChange={e => {setAmount(e.target.value);setQuote(null);setQuoteError('');}} placeholder={currency === 'KES' ? 'Enter amount in KES' : 'Enter amount in USD'} autoComplete="off" className={field} aria-describedby="amount-limits" /></label>
    </fieldset>
    <p id="amount-limits" className="text-sm text-slate-600">{formatDonationAmount(config.currencies[currency].min,currency)} – {formatDonationAmount(config.currencies[currency].max,currency)}</p>
    <fieldset disabled={busy} className="space-y-5">
      <label className="block font-medium">Your name (optional)<input name="donorName" maxLength={100} autoComplete="name" placeholder="Type your name" className={field}/></label>
      <label className="block font-medium">Receipt email<input name="email" type="email" required maxLength={254} autoComplete="email" className={field}/></label>
      <label className="block font-medium">Donation purpose<select name="purpose" defaultValue={config.defaultPurpose} className={field}>{Object.entries(config.purposes).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    </fieldset>
    <div aria-live="polite" className="min-w-0 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
      {ready ? <><p>Your donation: <strong>{formatDonationAmount(quote.inputAmountSubunit,currency)}</strong></p><p>Paystack will charge <strong>{formatDonationAmount(quote.chargeAmountSubunit,quote.chargeCurrency)}</strong>.</p>{currency === 'USD' && <><p>1 USD = {quote.exchangeRate} KES · {quote.exchangeRateProvider} · {quote.exchangeRateDate}</p><p>Your card issuer or payment provider may apply additional conversion fees.</p></>}</> : <p>{quoteError || (amount ? 'Calculating your secure quote…' : 'Enter a custom donation amount to receive a secure KES quote.')}</p>}
      {quoteError && <button type="button" onClick={() => setRefresh(n => n+1)} className="mt-2 underline">Retry quote</button>}
    </div>
    {error && <p role="alert" className="break-words text-red-700">{error}</p>}
    <button disabled={!ready || busy} className="w-full rounded-xl bg-blue-800 px-4 py-4 font-semibold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Opening secure checkout…' : 'Continue to Paystack'}</button>
    <div className="border-t border-slate-200 pt-6">
      <div className="flex flex-wrap justify-center gap-3" aria-label="Supported payment methods">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold"><CreditCard aria-hidden="true" className="size-5 text-blue-700"/>Card</div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold"><FaApple aria-hidden="true" className="size-5"/>Apple Pay</div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold"><FaGoogle aria-hidden="true" className="size-4 text-blue-600"/>Google Pay</div>
      </div>
      <div className="mt-6 flex gap-3 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-600">
        <LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-slate-500"/>
        <p>Cards and eligible Apple Pay or Google Pay wallets are processed securely by Paystack in KES. Your card issuer may apply its own conversion. We never store card details. <a href="#donation-privacy-details" className="underline decoration-slate-400 underline-offset-2 hover:text-blue-800">See our privacy policy.</a></p>
      </div>
      <p id="donation-privacy-details" className="mt-3 pl-8 text-xs leading-5 text-slate-500">{config.privacy}</p>
    </div>
  </form>;
}

