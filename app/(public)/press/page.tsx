"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaBookOpen,
  FaPrint,
  FaBook,
  FaTruck,
  FaArrowRight,
} from "react-icons/fa";

const pressServices = [
  {
    title: "Book Printing & Publishing",
    subtitle: "Bringing Knowledge to Life",
    description:
      "At Pioneers Footprints Press, we specialize in producing quality books and publications. Our printing services support authors, ministries, institutions, and organizations in transforming manuscripts into professionally printed publications. We are particularly committed to preserving and distributing literature that advances education, truth, and the everlasting gospel.",
    image: "https://res.cloudinary.com/dzi7p6hoi/image/upload/v1792354564/gw3pjuemetqqqtmno6yg.jpg",
    icon: FaBookOpen,
  },
  {
    title: "Bookbinding & Finishing",
    subtitle: "Quality That Lasts",
    description:
      "We provide professional bookbinding and finishing services designed to enhance the durability, appearance, and usability of printed materials. From educational books and religious publications to manuals and other printed documents, our goal is to deliver carefully finished products that meet the needs of our clients.",
    image: "/press/bookbinding.jpg",
    icon: FaBook,
  },
  {
    title: "General Printing Services",
    subtitle: "Professional Printing Solutions",
    description:
      "Our printing services include booklets, brochures, flyers, educational materials, church publications, and other printed resources. We strive to provide clear printing, attractive presentation, and dependable services for individuals, churches, schools, businesses, and organizations.",
    image: "/press/printing-services.jpg",
    icon: FaPrint,
  },
  {
    title: "Literature Evangelism & Distribution",
    subtitle: "Taking the Printed Word Further",
    description:
      "Pioneers Footprints Press is committed to supporting literature evangelism through the publication and distribution of spiritually enriching materials. We believe that the printed page remains a powerful instrument for communicating biblical truth, preserving the legacy of the Adventist pioneers, and preparing people for the coming of Christ.",
    image: "/press/literature.jpg",
    icon: FaTruck,
  },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06152e] via-[#092b60] to-[#104c91] py-24 text-white">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">

          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-300/30 bg-white/10 px-5 py-2 text-sm font-medium text-blue-100">
            <FaPrint />
            Publishing • Printing • Bookbinding
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            Pioneers Footprints
            <span className="block text-blue-300">Press</span>
          </h1>

          <div className="mx-auto mb-8 h-1 w-24 rounded-full bg-blue-400" />

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
            Dedicated to quality printing, professional book production,
            publishing, and the advancement of literature evangelism.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <a
              href="https://wa.me/254742767609"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-white px-7 py-3 font-semibold text-[#092b60] transition hover:bg-blue-100"
            >
              <FaWhatsapp className="text-xl" />
              Contact Our Press
              <FaArrowRight />
            </a>

            <a
              href="#our-services"
              className="inline-flex items-center gap-3 rounded-lg border border-white/40 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Our Services
            </a>

          </div>

        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="bg-[#f5f8fc] py-20">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Welcome to Our Printing Press
          </span>

          <h2 className="mb-7 text-3xl font-bold text-[#092b60] md:text-4xl">
            Excellence in Printing & Publishing
          </h2>

          <p className="text-lg leading-9 text-slate-600">
            Pioneers Footprints Press is a publishing and printing ministry
            dedicated to advancing the work of literature evangelism through
            quality printing, book production, binding, and publishing
            services. We are committed to producing publications that
            educate, inspire, and communicate the everlasting gospel.
          </p>

        </div>

      </section>

      {/* SERVICES */}
      <section id="our-services" className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-20 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              What We Do
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#092b60] md:text-4xl">
              Our Press Services
            </h2>

            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-blue-600" />

            <p className="mx-auto mt-6 max-w-2xl text-slate-600">
              Discover our printing, publishing, and book production
              services designed to meet your needs.
            </p>

          </div>

          <div className="space-y-24">

            {pressServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className={`grid items-center gap-12 lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >

                  {/* IMAGE */}
                  <div className="group relative">

                    <div className="relative h-[300px] overflow-hidden rounded-2xl bg-slate-100 shadow-xl sm:h-[400px]">

                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                    </div>

                    <div className="absolute -bottom-5 right-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#092b60] text-2xl text-white shadow-lg">
                      <Icon />
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <div>

                    <span className="mb-4 inline-block text-sm font-bold uppercase tracking-widest text-blue-700">
                      {service.subtitle}
                    </span>

                    <h3 className="mb-6 text-3xl font-bold leading-tight text-[#092b60] md:text-4xl">
                      {service.title}
                    </h3>

                    <div className="mb-7 h-1 w-16 rounded-full bg-blue-600" />

                    <p className="mb-8 text-lg leading-9 text-slate-600">
                      {service.description}
                    </p>

                    <a
                      href={`https://wa.me/254742767609?text=${encodeURIComponent(
                        `Hello Pioneers Footprints Press, I would like more information about ${service.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                      Enquire About This Service
                      <FaArrowRight />
                    </a>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="bg-[#f5f8fc] py-20">

        <div className="mx-auto max-w-5xl px-6">

          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#06152e] to-[#104c91] px-8 py-16 text-center text-white shadow-xl md:px-16">

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Get in Touch
            </span>

            <h2 className="mb-6 mt-4 text-3xl font-bold md:text-4xl">
              For More Information
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-blue-100">
              Do you need professional printing, bookbinding,
              publishing, or literature production services?
              Contact Pioneers Footprints Press today.
            </p>

            <a
              href="tel:+254742767609"
              className="mb-10 inline-flex items-center gap-4 text-2xl font-bold transition hover:text-blue-200 md:text-3xl"
            >
              <FaPhoneAlt className="text-blue-300" />
              0742 767 609
            </a>

            <div className="flex flex-wrap justify-center gap-4">

              <a
                href="https://wa.me/254742767609"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp Us
              </a>

              <a
                href="tel:+254742767609"
                className="inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-semibold text-[#092b60] transition hover:bg-blue-100"
              >
                <FaPhoneAlt />
                Call Us
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}