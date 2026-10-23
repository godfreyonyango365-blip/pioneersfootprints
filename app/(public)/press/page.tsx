import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import BookCatalogue from "@/components/press/BookCatalogue";
import LiteratureDistribution from "@/components/press/LiteratureDistribution";
import PrintEnquiry from "@/components/press/PrintEnquiry";
import { whatsappLink } from "@/lib/press";

export default function PressPage() {
  return <main className="min-h-screen bg-white text-slate-900">
    <section className="relative overflow-hidden bg-[#071a34] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
   <div className="mb-8">
  <h1 className="font-extrabold uppercase leading-[1.05] tracking-tight">

    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
      PIONEERS
    </span>

    <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-300">
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
    <LiteratureDistribution />
    <PrintEnquiry/>
    <section className="bg-blue-950 px-6 py-14 text-center text-white"><h2 className="text-2xl font-bold">Prefer to speak with our press team?</h2><p className="mt-4 text-blue-100">Let’s find the right approach for your publication.</p><div className="mt-6 flex flex-wrap justify-center gap-4"><a href="tel:+254742767609" className="rounded-xl border border-white/30 px-6 py-3 font-semibold">Call 0742 767 609</a><a href={whatsappLink("Hello Pioneers Footprints Press, I would like to discuss a project.")} className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-950">Chat on WhatsApp</a></div></section>
  </main>;
}
