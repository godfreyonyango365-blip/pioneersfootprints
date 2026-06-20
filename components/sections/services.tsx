"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Leaf, Laptop } from "lucide-react";

const services = [
  {
    title: "Publications & Literature",
    description:
      "KJV Bibles, Luo Bibles, Song Books, Kiswahili Biblia, Ellen White writings, pioneers library and archival publications.",
    icon: BookOpen,
    color: "bg-blue-600",
    href: "/services/literature",
  },
  {
    title: "Natural Health & Medical Services",
    description:
      "Natural health products, remedies, medical missionary work, and educational support for wellness.",
    icon: Leaf,
    color: "bg-green-600",
    href: "/services/health",
  },
  {
    title: "Software & Media Services",
    description:
      "Web and media services for digital outreach, design, development, and content production.",
    icon: Laptop,
    color: "bg-purple-600",
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

        <div className="grid md:grid-cols-3 gap-8">
          {services.map(({ title, description, icon: Icon, color, href }, index) => (
            <motion.div
              key={title}
              className="rounded-3xl shadow-xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
