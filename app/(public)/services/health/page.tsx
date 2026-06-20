"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Heart, PlusSquareIcon, Cross, ShoppingCart, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "254742767609";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello,%20I%20am%20inquiring%20about a specific health service.`;

// Health Services Data
const healthServices = [
  {
    title: "Natural Remedies",
    description: "Explore effective and safe herbal remedies for everyday wellness. Our solutions are natural, time-tested, and crafted to support your health holistically.",
    image: "/assets/remedies.jpeg",
    tags: ["Herbal", "Wellness", "Natural"],
    orderLink: "https://www.nurushop.co.ke/shop?category=herbs"
  },
  {
    title: "Health Education",
    description: "Empowering communities through education on nutrition, preventive care, and healthy living habits. Workshops, seminars, and resources available.",
    image: "/assets/health.png",
    icon: <Heart className="w-5 h-5" />,
    tags: ["Education", "Nutrition", "Awareness"],
    orderLink: "https://www.nurushop.co.ke/shop?category=health-books"
  },
  {
    title: "Medical Missionary Work",
    description: "Serving communities with medical support, wellness checkups, and health outreach programs, combining faith and service for holistic care.",
    image: "/assets/medical.jpeg",
    icon: <Cross className="w-5 h-5" />,
    tags: ["Outreach", "Care", "Community"],
    contact: true
  },
  {
    title: "Wellness Programs",
    description: "Structured wellness programs promoting fitness, stress management, and healthy living practices, designed for all ages and lifestyles.",
    image:  "/assets/wellness.jpeg",
    icon: <PlusSquareIcon className="w-5 h-5" />,
    tags: ["Fitness", "Mindfulness", "Lifestyle"],
   contact: true
  }
];

export default function HealthPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
            alt="Full view"
          />
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 py-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-green-600 dark:text-green-500 mb-6 tracking-tight">
            Natural Health & <span className="text-slate-900 dark:text-white">Medical Services</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
            Our mission is to promote natural healing and wellness through carefully crafted remedies, education, missionary work, and wellness programs.
          </p>
        </div>
      </div>

      {/* Health Services Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {healthServices.map((service, index) => (
            <div
              key={index}
              className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300"
            >
              {/* Service Image */}
              <div
                className="h-56 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-zoom-in"
                onClick={() => setSelectedImage(service.image)}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-2 rounded-lg shadow-sm">
                  {service.icon}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
                <div className="mt-auto">
                  {service.contact ? (
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contact Our Health Team
                    </a>
                  ) : (
                    <a
                      href={service.orderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Place Order
                    </a>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="p-8 bg-green-600 rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Can&apos;t find a specific service?</h3>
          <p className="opacity-90 mb-6">We can help provide tailored health solutions upon request.</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Our Health Team
          </a>
        </div>
      </div>
    </main>
  );
}
