'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { formatDonationAmount } from '@/lib/donations/config';
import { readDonationResponse } from '@/lib/donations/client';
type Donation = {reference:string;status:string;donorEmail:string;donorName:string;purpose:string;amountSubunit:number;reason:string;initializedAt:string|null};
type Page = {donations:Donation[];nextCursor:string|null;totalSubunit:number;successfulCount:number};
export default function AdminDonations() {
  const [data,setData] = useState<Page|null>(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(true);
  const [signedIn,setSignedIn] = useState(false);
  const [cursor,setCursor] = useState('');
  const [reload,setReload] = useState(0);
  const [reference,setReference] = useState('');
  useEffect(() => onAuthStateChanged(auth,user => {setSignedIn(!!user);setData(null);setError('');setBusy(!!user);setReload(n => n+1);}),[]);
  useEffect(() => {
    if (!signedIn) return;
    const controller = new AbortController();
    async function load() {
      setBusy(true);setError('');setData(null);
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch('/api/admin/donations' + (cursor ? '?cursor=' + encodeURIComponent(cursor):''),{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});
        const result = await readDonationResponse<Page>(response,'Unable to load donations.');
        if (!controller.signal.aborted) setData(result);
      } catch (err) {if (!controller.signal.aborted) setError(err instanceof Error ? err.message:'Unable to load donations.');}
      finally {if (!controller.signal.aborted) setBusy(false);}
    }
    void load();return () => controller.abort();
  },[signedIn,cursor,reload]);
  async function reconcile(ref: string) {
    setBusy(true);setError('');
    try {const token = await auth.currentUser?.getIdToken();const response = await fetch('/api/admin/donations',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({reference:ref})});await readDonationResponse(response,'Unable to reconcile donation.');setReload(n => n+1);}
    catch (err) {setError(err instanceof Error ? err.message:'Unable to reconcile donation.');setBusy(false);}
  }
  return <section className="min-w-0 space-y-6 text-slate-950"><h1 className="text-3xl font-bold">Donations</h1><p className="text-slate-600">Only independently confirmed payments contribute to the total. Reconcile a reference to check its current status with Paystack.</p>{!signedIn && <Link className="inline-block rounded-xl bg-blue-800 p-4 text-white" href="/np-godfrey123/login">Sign in to view donations</Link>}{error && <p role="alert" className="break-words text-red-700">{error}</p>}{busy && signedIn && <p role="status">Loading verified donation records…</p>}{signedIn && <><form onSubmit={e => {e.preventDefault();void reconcile(reference);}} className="flex min-w-0 flex-wrap gap-3"><label className="min-w-0 flex-1">Payment reference<input value={reference} onChange={e => setReference(e.target.value)} maxLength={100} required className="mt-2 block w-full min-w-0 rounded-xl border bg-white p-3"/></label><button disabled={busy} className="self-end rounded-xl bg-blue-800 p-3 text-white disabled:opacity-50">Verify reference</button></form><button disabled={busy} onClick={() => setReload(n => n+1)} className="rounded-lg border border-blue-700 px-4 py-2 disabled:opacity-50">Refresh records</button></>}{data && <><div className="grid gap-4 sm:grid-cols-2"><p className="rounded-2xl bg-white p-6 shadow">Confirmed donations<strong className="mt-2 block text-2xl">{formatDonationAmount(data.totalSubunit,'KES')}</strong></p><p className="rounded-2xl bg-white p-6 shadow">Successful payments<strong className="mt-2 block text-2xl">{data.successfulCount}</strong></p></div><div className="space-y-4">{data.donations.length === 0 && <p>No donation records found.</p>}{data.donations.map(d => <article key={d.reference} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="break-words font-bold">{d.donorName}</h2><strong>{formatDonationAmount(d.amountSubunit,'KES')} · {d.status}</strong></div><p className="mt-2 break-all text-sm">{d.donorEmail}</p><p className="mt-2 text-sm">{d.purpose} · {d.initializedAt ? new Date(d.initializedAt).toLocaleString(): 'Initializing'}</p><p className="mt-2 break-all text-sm text-slate-500">{d.reference}</p><p className="mt-2 text-sm">{d.reason}</p><button disabled={busy} onClick={() => void reconcile(d.reference)} className="mt-4 rounded-lg border border-blue-700 p-2 text-blue-800 disabled:opacity-50">Reconcile with Paystack</button></article>)}</div><div className="flex gap-4">{cursor && <button disabled={busy} onClick={() => setCursor('')} className="rounded-lg border p-3">First page</button>}{data.nextCursor && <button disabled={busy} onClick={() => setCursor(data.nextCursor!)} className="rounded-lg border p-3">Next page</button>}</div></>}</section>;
}
