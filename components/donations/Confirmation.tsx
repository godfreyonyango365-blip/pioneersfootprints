'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDonationAmount } from '@/lib/donations/config';
export default function Confirmation({reference}:{reference:string}) {
  const [result,setResult] = useState<{status:string;amountSubunit:number;reason:string}|null>(null);
  const [error,setError] = useState('');
  const [attempt,setAttempt] = useState(0);
  const [busy,setBusy] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/paystack/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reference}),signal:controller.signal}).then(async response => {const data = await response.json();if (!response.ok) throw new Error(data.error || 'Payment could not yet be confirmed.');if (!controller.signal.aborted) setResult(data);}).catch(err => {if (!controller.signal.aborted) setError(err.message);}).finally(() => {if (!controller.signal.aborted) setBusy(false);});
    return () => controller.abort();
  },[reference,attempt]);
  const success = result?.status === 'success';
  return <section className="mx-auto w-full max-w-xl min-w-0 rounded-3xl bg-white p-6 text-slate-950 shadow-xl sm:p-10" aria-live="polite"><h1 className="text-3xl font-bold">{busy ? 'Verifying your donation…' : success ? 'Donation confirmed' : 'Payment could not yet be confirmed'}</h1>{success ? <><p className="mt-5 text-xl">Thank you for giving.</p><p className="mt-3 text-2xl font-bold text-green-700">{formatDonationAmount(result.amountSubunit,'KES')}</p><p className="mt-4 leading-7">Paystack may send a payment receipt to the email you provided, depending on the merchant’s receipt settings. This website does not send a separate email receipt. Keep this reference for enquiries.</p></> : <p className="mt-5 leading-7">{busy ? 'We are checking the payment directly with Paystack.' : error || result?.reason || 'We have not confirmed receipt of your donation.'}</p>}<p className="mt-6 break-all text-sm text-slate-600">Reference: {reference || 'Not provided'}</p>{!success && !busy && <button onClick={() => {setBusy(true);setError('');setAttempt(n => n+1);}} className="mt-6 rounded-xl border border-blue-700 p-3 text-blue-800">Check payment again</button>}<Link href={success ? '/' : '/donate'} className="mt-6 block rounded-xl bg-blue-800 p-4 text-center font-semibold text-white">{success ? 'Return home' : 'Return to donation form'}</Link></section>;
}
