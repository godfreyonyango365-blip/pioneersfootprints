"use client";

import { useState } from "react";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Book Printing",
    text: "Professional production of books, devotionals, manuals, ministry literature, and publications.",
  },
  {
    number: "02",
    title: "Booklets & Magazines",
    text: "Clean, sharp printing for booklets, magazines, study guides, programs, and campaigns.",
  },
  {
    number: "03",
    title: "Ministry Printing",
    text: "Evangelistic materials, church programs, Bible studies, flyers, and ministry resources.",
  },
  {
    number: "04",
    title: "Business Printing",
    text: "Professional business cards, brochures, posters, letterheads, and promotional materials.",
  },
];

const products = [
  "Books",
  "Booklets",
  "Magazines",
  "Brochures",
  "Flyers",
  "Posters",
  "Business Cards",
  "Church Programs",
];

export default function PrintingPressPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "Book Printing",
    quantity: "",
    size: "A5",
    color: "Black & White",
    binding: "None",
    deadline: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `
Hello Pioneers Footprints Printing Press,

I would like to request a quotation.

Name: ${form.name}
Phone: ${form.phone}
Product: ${form.product}
Quantity: ${form.quantity}
Size: ${form.size}
Colour: ${form.color}
Binding: ${form.binding}
Deadline: ${form.deadline}

Additional Information:
${form.message}
    `;

    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="bg-[#f7f6f1] text-[#111827]">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative min-h-[780px] overflow-hidden bg-[#0D0C29]">

        {/* Decorative typography */}
        <div className="absolute -right-20 top-20 hidden select-none text-[180px] font-black leading-none text-white/[0.025] lg:block">
          PRINT
        </div>

        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10" />

        <div className="mx-auto grid min-h-[780px] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">

          {/* LEFT */}
          <div className="relative z-10">

            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-emerald-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Pioneers Footprints Printing Press
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
              PRINT
              <br />
              <span className="text-emerald-300">WITH PURPOSE.</span>
            </h1>

            <p className="mt-9 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
              Professional printing and finishing for books, ministries,
              churches, schools, businesses, and organizations.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#quote"
                className="bg-white px-7 py-4 text-sm font-bold uppercase tracking-wide text-[#0D0C29] transition hover:bg-emerald-200"
              >
                Start a Printing Project
              </a>

              <a
                href="#services"
                className="border border-white/25 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/5"
              >
                Explore Services
              </a>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              <span>Books</span>
              <span>Ministry</span>
              <span>Business</span>
              <span>Education</span>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative hidden h-[580px] lg:block">

            <div className="absolute right-4 top-8 h-[480px] w-[360px] rotate-[6deg] bg-white/10" />

            <div className="absolute right-12 top-20 h-[480px] w-[360px] -rotate-[7deg] overflow-hidden bg-[#1C3A22] shadow-2xl">

              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.12),transparent_40%)]" />

              <div className="relative flex h-full flex-col justify-between p-10">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                    Publishing
                  </p>

                  <h2 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight text-white">
                    Ideas
                    <br />
                    Into
                    <br />
                    Print.
                  </h2>
                </div>

                <div>
                  <div className="mb-6 h-px w-full bg-white/20" />

                  <p className="max-w-xs text-sm leading-6 text-white/60">
                    From manuscript preparation to the finished printed
                    publication.
                  </p>

                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                    Pioneers Footprints
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 w-52 bg-white p-6 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                Our Philosophy
              </p>

              <p className="mt-3 text-lg font-bold leading-tight text-[#0D0C29]">
                Print the message.
                <br />
                Share the truth.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          INTRO
      ========================================================== */}
      <section className="border-b border-black/10 bg-[#f7f6f1]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1C3A22]">
              The Press
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.03em] text-[#0D0C29] sm:text-5xl">
              More than ink
              <br />
              on paper.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-2xl font-medium leading-10 text-gray-700">
              Every publication carries a message. We help you present that
              message with clarity, quality, and professional craftsmanship.
            </p>

            <p className="mt-7 max-w-2xl leading-8 text-gray-500">
              Pioneers Footprints Printing Press provides printing and
              finishing services for ministries, churches, educational
              institutions, businesses, organizations, and individuals.
            </p>
          </div>
        </div>
      </section>


      {/* =========================================================
          SERVICES
      ========================================================== */}
      <section id="services" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-8 border-b border-black/10 pb-10 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1C3A22]">
                What We Do
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-[#0D0C29] sm:text-5xl">
                Printing services
                <br />
                built around you.
              </h2>
            </div>

            <p className="max-w-md leading-7 text-gray-500">
              From small quantities to larger production runs, we help turn
              your ideas into finished printed materials.
            </p>
          </div>


          <div className="mt-16 grid border-l border-t border-black/10 sm:grid-cols-2">

            {services.map((service) => (
              <div
                key={service.number}
                className="group border-b border-r border-black/10 p-8 transition hover:bg-[#f7f6f1] lg:p-12"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-[#1C3A22]">
                    {service.number}
                  </span>

                  <span className="text-2xl text-gray-300 transition group-hover:text-[#1C3A22]">
                    ↗
                  </span>
                </div>

                <h3 className="mt-14 text-2xl font-black text-[#0D0C29]">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-md leading-7 text-gray-500">
                  {service.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          STATEMENT
      ========================================================== */}
      <section className="bg-[#1C3A22] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl">
              A well-produced
              <br />
              publication
              <br />
              <span className="text-emerald-300">speaks before you do.</span>
            </h2>

            <div>
              <div className="h-px w-16 bg-emerald-300" />

              <p className="mt-7 text-lg leading-8 text-white/65">
                Quality paper, accurate colour, clean finishing, and thoughtful
                presentation can make the difference between an ordinary
                document and a publication people want to keep.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          WHAT WE PRINT
      ========================================================== */}
      <section className="bg-[#f7f6f1] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-16 lg:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1C3A22]">
                Our Products
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-[#0D0C29] sm:text-5xl">
                What can
                <br />
                we print?
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-gray-500">
                Whatever your project requires, we can help you determine the
                appropriate size, paper, colour, binding, and finishing.
              </p>
            </div>


            <div className="grid grid-cols-2 border-l border-t border-black/10">

              {products.map((product, index) => (
                <div
                  key={product}
                  className="border-b border-r border-black/10 p-6 transition hover:bg-white sm:p-8"
                >
                  <span className="text-xs font-bold text-gray-400">
                    0{index + 1}
                  </span>

                  <h3 className="mt-8 text-lg font-bold text-[#0D0C29]">
                    {product}
                  </h3>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          PUBLISHING
      ========================================================== */}
      <section className="bg-[#0D0C29] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-2">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Publishing Support
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
                Have a manuscript?
                <br />
                Let&apos;s prepare it for print.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-white/60">
                Need help preparing your publication? We can assist with
                typesetting, layout, cover preparation, print-ready files,
                binding, and finishing.
              </p>

              <Link
                href="#quote"
                className="mt-8 inline-flex border border-white/30 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white hover:text-[#0D0C29]"
              >
                Discuss Your Project
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          REQUEST A QUOTE
          KEPT AS THE CONSTANT SECTION
      ========================================================== */}
      <section id="quote" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-10 lg:p-14">

            <div className="max-w-2xl">
              <p className="font-semibold uppercase tracking-widest text-[#1C3A22]">
                Get Started
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Request a Printing Quote
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Give us the details of your project. After submitting, your
                request will open in WhatsApp so we can discuss your quotation.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 grid gap-6 sm:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Name
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C3A22]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone / WhatsApp
                </label>

                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07XX XXX XXX"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1C3A22]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product
                </label>

                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                >
                  {products.map((product) => (
                    <option key={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Quantity
                </label>

                <input
                  required
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Size
                </label>

                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                >
                  <option>A4</option>
                  <option>A5</option>
                  <option>A6</option>
                  <option>Custom Size</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Colour
                </label>

                <select
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                >
                  <option>Black & White</option>
                  <option>Full Colour</option>
                  <option>Mixed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Binding
                </label>

                <select
                  name="binding"
                  value={form.binding}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                >
                  <option>None</option>
                  <option>Perfect Binding</option>
                  <option>Saddle Stitch</option>
                  <option>Hardcover</option>
                  <option>Spiral Binding</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Required By
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Additional Information
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your printing project..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1C3A22] px-6 py-4 font-bold text-white transition hover:bg-[#0D0C29]"
                >
                  Send Quote Request via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="bg-[#1C3A22] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Pioneers Footprints
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.03em] sm:text-6xl">
                Your idea deserves
                <br />
                to be beautifully printed.
              </h2>
            </div>

            <a
              href="#quote"
              className="inline-flex shrink-0 bg-white px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#1C3A22] transition hover:bg-emerald-100"
            >
              Request a Quote
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}