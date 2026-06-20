"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function ServiceCard({ title, description, imageUrl }: ServiceCardProps) {
  return (
    <motion.div
      className="rounded-2xl shadow-xl overflow-hidden flex flex-col bg-white dark:bg-slate-800 transition-colors"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-48 w-full relative">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{title}</h3>
        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
