"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Leaf, Laptop } from "lucide-react";

const services = [
  {
    title: "Publications & Literature",
    description:
      "KJV Bibles, Luo Bibles, Song Books, Kiswahili Biblia, Ellen White writings (The Great Controversy, Desire of Ages, Early Writings), Pioneers Library and archival publications.",
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
      "Web design, development, graphics design, media production, and camera work for all digital solutions.",
    icon: Laptop,
    color: "bg-purple-600",
    href: "/services/media",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 px-4 py-12 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
       <motion.h1
  className="text-4xl md:text-5xl font-bold text-center mb-12 
  bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 
  bg-[length:200%_200%] bg-clip-text text-transparent"
  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
>
  Services we Offer
</motion.h1>

  <div className="overflow-hidden w-full">
  <motion.div
    className="flex whitespace-nowrap gap-10"
    animate={{ x: ["0%", "-50%"] }}
    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
  >
    {[...Array(2)].map((_, i) => (
      <span
        key={i}
        className="text-4xl md:text-5xl font-bold 
        bg-gradient-to-r from-green-400 via-purple-400 to-blue-400 
        bg-clip-text text-transparent"
      >
        Explore Our Services  • Explore Our Services   • Explore Our Services •
      </span>
    ))}
  </motion.div>
</div>


        <div className="grid md:grid-cols-3 gap-8">
          {services.map(({ title, description, icon: Icon, color, href }, index) => (
            <motion.div
              key={title}
              className="rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color}`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">{description}</p>

              {/* CTA Button */}
              <Link
                href={href}
                className="mt-4 inline-block text-center bg-gradient-to-r from-green-500  to-blue-600  text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                View Service →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
