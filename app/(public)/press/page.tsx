import Image from "next/image";
import { BookOpen, Printer, Layers, Truck, ArrowUpRight } from "lucide-react";
import BookCatalogue from "@/components/press/BookCatalogue";
import PrintEnquiry from "@/components/press/PrintEnquiry";
import { whatsappLink } from "@/lib/press";

const services = [
  { title: "Book printing & publishing", icon: BookOpen, description: "Bring your manuscript to life with thoughtfully produced books for authors, ministries, schools and organisations." },
  { title: "Binding & finishing", icon: Layers, description: "Give your publication a lasting finish. Discuss cover, binding and presentation options with our team." },
  { title: "General printing", icon: Printer, description: "Booklets, brochures, flyers, manuals and church resources, prepared for clear communication." },
  { title: "Literature distribution", icon: Truck, description: "Connect readers with educational and spiritual literature that preserves pioneer heritage and shares the gospel." },
];

export default function PressPage() {
  return <main className="min-h-screen bg-white text-slate-900">
    <section className="relative overflow-hidden bg-[#071a34] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
   <div className="mb-8">
  <h1 className="font-extrabold uppercase leading-[1.05] tracking-tight">

    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
      PIONEERS
    </span>

    <span className="block mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-blue-300">
      FOOTPRINTS
    </span>

    <span className="mt-5 flex items-center gap-4">
      <span className="h-[2px] w-10 sm:w-16 bg-blue-400"></span>

      <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.35em] text-white">
        PRESS
      </span>

      <span className="h-[2px] w-10 sm:w-16 bg-blue-400"></span>
    </span>

 </h1>
<p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">From your first manuscript to the finished book, we help you share knowledge, preserve truth and put meaningful literature into readers’ hands.</p>
          <div className="mt-9 flex flex-wrap gap-4"><a href="#print-enquiry" className="rounded-xl bg-white px-6 py-4 font-semibold text-blue-950 hover:bg-blue-100">Request a printing quote <ArrowUpRight className="ml-2 inline h-4 w-4"/></a><a href="#books" className="rounded-xl border border-white/40 px-6 py-4 font-semibold hover:bg-white/10">Browse our books</a></div>
          <p className="mt-8 text-sm text-blue-200">Publishing · Printing · Bookbinding · Distribution</p>
        </div>
        <div className="relative rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-10"><div className="relative h-72 sm:h-96"><Image src="/assets/press.png" alt="Books and literature at Pioneers Footprints" fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-contain"/></div><div className="mt-5 border-t border-white/15 pt-5"><p className="text-lg font-semibold">A home for the printed word</p><p className="mt-2 text-sm leading-6 text-slate-300">Supporting authors, ministries and communities through literature.</p></div></div>
      </div>
    </section>
    <section className="border-b border-slate-200 bg-slate-50 py-10"><div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-3">{["Printing for your purpose", "A4 & A5 book formats", "Colour & black-and-white options"].map((text, i) => <div key={text} className="flex items-center gap-4"><span className="text-sm font-bold text-blue-700">0{i+1}</span><p className="font-semibold">{text}</p></div>)}</div></section>
    <BookCatalogue/>
    <section id="our-services" className="bg-[#f5f8fc] py-20"><div className="mx-auto max-w-7xl px-6"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Made for your next chapter</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">More than ink on paper</h2><p className="mt-5 max-w-2xl leading-8 text-slate-600">Practical printing and publishing support, with a commitment to literature that educates, inspires and serves.</p><div className="mt-10 grid gap-6 md:grid-cols-2">{services.map(({ title, icon: Icon, description }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-8"><Icon className="mb-5 h-9 w-9 text-blue-800"/><h3 className="text-xl font-bold">{title}</h3><p className="mt-4 leading-7 text-slate-600">{description}</p><a className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700" href={whatsappLink(`Hello, I would like to know more about ${title}.`)}>Discuss your project <ArrowUpRight className="h-4 w-4"/></a></article>)}</div></div></section>
    <PrintEnquiry/>
    <section className="bg-blue-950 px-6 py-14 text-center text-white"><h2 className="text-2xl font-bold">Prefer to speak with our press team?</h2><p className="mt-4 text-blue-100">Let’s find the right approach for your publication.</p><div className="mt-6 flex flex-wrap justify-center gap-4"><a href="tel:+254742767609" className="rounded-xl border border-white/30 px-6 py-3 font-semibold">Call 0742 767 609</a><a href={whatsappLink("Hello Pioneers Footprints Press, I would like to discuss a project.")} className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-950">Chat on WhatsApp</a></div></section>
  </main>;
}
