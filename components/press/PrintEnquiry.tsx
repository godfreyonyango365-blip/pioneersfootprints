"use client";
import { FormEvent } from "react";
import { whatsappLink } from "@/lib/press";

export default function PrintEnquiry() {
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = ["Hello Pioneers Footprints Press, I would like a printing quote.",
      ...[["Name", "name"], ["Contact number", "phone"], ["Book title", "title"], ["Number of pages", "pages"], ["Paper size", "size"], ["Printing", "color"], ["Number of copies", "copies"], ["Additional details", "notes"]].map(([label, key]) => `${label}: ${String(data.get(key) || "Not provided").trim()}`)].join("\n");
    window.location.assign(whatsappLink(message));
  }
  const field = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-blue-600";
  return <section id="print-enquiry" className="scroll-mt-28 bg-slate-100 py-20">
    <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
      <div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Let’s print your book</p><h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Your manuscript.<br/>Our next project.</h2><p className="mt-6 max-w-md text-lg leading-8 text-slate-600">Tell us about your book and the printing you need. Our press team will discuss production options and pricing with you on WhatsApp.</p><ol className="mt-8 space-y-4 text-slate-700"><li>01 — Share your book details</li><li>02 — Discuss paper, colour and finishing</li><li>03 — Receive a personalised quote</li></ol></div>
      <form onSubmit={send} className="grid gap-5 rounded-3xl bg-white p-6 shadow-sm sm:grid-cols-2 md:p-8">
        <label className="font-medium">Your name<input name="name" autoComplete="name" required maxLength={120} pattern=".*\S.*" className={field}/></label>
        <label className="font-medium">Contact number<input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9() .\-]{7,25}" title="Enter your phone number, including country code if applicable" className={field}/></label>
        <label className="font-medium sm:col-span-2">Book title (optional)<input name="title" maxLength={160} className={field}/></label>
        <label className="font-medium">Number of pages<input name="pages" type="number" min="1" max="100000" step="1" required className={field}/></label>
        <label className="font-medium">Number of copies<input name="copies" type="number" min="1" max="1000000" step="1" defaultValue="1" required className={field}/></label>
        <label className="font-medium">Paper size<select name="size" className={field} defaultValue="A5"><option>A5</option><option>A4</option></select></label>
        <label className="font-medium">Printing colour<select name="color" className={field}><option>Black and white</option><option>Full colour</option><option>Mixed colour and black and white</option></select></label>
        <label className="font-medium sm:col-span-2">Additional details (optional)<textarea name="notes" rows={3} maxLength={1500} className={field} placeholder="Binding, cover, deadline or questions"/></label>
        <div className="sm:col-span-2"><button type="submit" className="w-full rounded-xl bg-green-700 px-6 py-4 font-bold text-white transition hover:bg-green-800">Send enquiry via WhatsApp</button><p className="mt-3 text-sm leading-6 text-slate-500">WhatsApp opens with your details filled in. Tap Send there to deliver your enquiry. No payment is required.</p></div>
      </form>
    </div>
  </section>;
}
