"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const services = [
  {
    title: "Pioneers Footprints Press",
    description:
      "Professional printing, publishing and binding. Browse our books or request a quote for your manuscript.",
    image: "/assets/press.png",
    imageAlt: "Pioneers Footprints Press",
    href: "/press",
  },
  {
    title: "Publications & Literature",
    description:
      "KJV Bibles, Luo Bibles, Song Books, Kiswahili Biblia, Ellen White writings, pioneers library and archival publications.",
    image: "/assets/books.png",
    imageAlt: "Books and publications",
    href: "/services/literature",
  },
  {
    title: "Natural Health & Medical Services",
    description:
      "Natural health products, remedies, medical missionary work, and educational support for wellness.",
    image: "/assets/medical.jpeg",
    imageAlt: "Natural health and medical services",
    href: "/services/health",
  },
  {
    title: "Software & Media Services",
    description:
      "Web and media services for digital outreach, design, development, and content production.",
    image: "/assets/camera.jpg",
    imageAlt: "Camera for software and media services",
    href: "/services/media",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-gray-50 dark:bg-slate-900 px-4 py-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Our Services
          </p>
        
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-8">
            Explore the core services we offer to preserve pioneer heritage, promote health, and grow your digital presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map(({ title, description, image, imageAlt, href }, index) => (
            <motion.div
              key={title}
              className="rounded-3xl shadow-xl flex flex-col border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Image
                src={image}
                alt={imageAlt}
                width={640}
                height={360}
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-6 p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                </div>
                <Link
                  href={href}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-blue-600 text-white py-3 px-5 text-sm font-semibold hover:bg-blue-700 transition"
                >
                  View Service →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
