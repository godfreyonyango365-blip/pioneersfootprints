"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContentEntry, whatsappLink } from "@/lib/press";

export default function BookCatalogue() {
  const [books, setBooks] = useState<ContentEntry[]>([]);
  const [status, setStatus] = useState("Loading our books...");
  useEffect(() => onSnapshot(collection(db, "pressBooks"), snapshot => {
    setBooks(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ContentEntry)).sort((a,b) => a.name.localeCompare(b.name)));
    setStatus(snapshot.empty ? "Ask our team about available titles and upcoming publications." : "");
  }, () => setStatus("The catalogue is temporarily unavailable. Contact us on WhatsApp for available books.")), []);
  return <section id="books" className="scroll-mt-28 py-20"><div className="mx-auto max-w-7xl px-6">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">From our shelves</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Books from our press</h2><p className="mt-4 text-slate-600">Explore our titles and enquire directly about ordering.</p></div><a href={whatsappLink("Hello, which books are available from your press?")} className="font-semibold text-blue-700">Ask about availability →</a></div>
    {status && <p role="status" className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">{status}</p>}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{books.map(book => <article key={book.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-72 items-center justify-center bg-slate-100 p-6">{book.imageUrl ? <img src={book.imageUrl} alt={`${book.name} book cover`} className="h-full w-full object-contain"/> : <span className="text-slate-500">Book cover coming soon</span>}</div>
      <div className="flex flex-1 flex-col p-6"><h3 className="text-xl font-bold">{book.name}</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{book.description}</p><p className="mt-5 text-xl font-bold text-blue-900">{new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(Number(book.price || 0))}</p><a href={whatsappLink(`Hello, I would like to order ${book.name} (KES ${book.price}). Please confirm availability and delivery options.`)} className="mt-5 block rounded-xl bg-blue-900 px-4 py-3 text-center font-semibold text-white">Enquire about this book</a></div>
    </article>)}</div>
  </div></section>;
}
