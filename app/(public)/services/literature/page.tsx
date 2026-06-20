"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { Book, Archive, Languages, Star, ScrollText, Library, ShoppingCart, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "254742767609";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello,%20I%20am%20inquiring%20about%20a%20specific%20book%20from%20the%20Literature%20page.`;

const services = [
  {
    title: "King James Version (KJV) Bibles",
    description: "The classic, authorized version of the Holy Scriptures. We provide high-quality study editions, large print, and reference Bibles for deep spiritual study.",
    image: "/assets/kjv.jpeg",
    icon: <Book className="w-5 h-5" />,
    tags: ["Study Edition", "Hardcover", "Reference"],
    orderLink: "https://www.nurushop.co.ke"
  },
  {
    title: "Luo & Kiswahili Translations",
    description: "Bringing the Word of God closer to home. We offer accurate and readable translations in Dholuo and Kiswahili, perfect for local congregations and personal devotion.",
    image: "/assets/luo.jpeg",
    icon: <Languages className="w-5 h-5" />,
    tags: ["Regional", "Clear Text", "Standard"],
    orderLink: "https://www.nurushop.co.ke"
  },
  {
    title: "Sacred Song Books",
    description: "A comprehensive collection of traditional and contemporary hymns. Includes musical notation and lyrics to uplift your worship services and private meditation.",
    image: "/assets/song.png",
    icon: <ScrollText className="w-5 h-5" />,
    tags: ["Hymnals", "Lyrics", "Sheet Music"],
    orderLink: "https://www.nurushop.co.ke/products/6TQoQYO1abnlvwRoABGm"
  },
  {
    title: "Ellen G. White Writings",
    description: "Explore the profound insights of the Spirit of Prophecy. From 'The Desire of Ages' to 'The Great Controversy,' we stock the complete library of E.G. White's inspired works.",
    image: "/assets/egw.jpeg",
    icon: <Star className="w-5 h-5" />,
    tags: ["Prophecy", "Health", "Education"],
    orderLink: "https://www.nurushop.co.ke/shop?category=ellen-white-writings"
  },
  {
    title: "Pioneers Library Archives",
    description: "Deepen your understanding of heritage with our curated archives. This collection includes rare manuscripts, historical periodicals, and foundational theology from early pioneers.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
    icon: <Archive className="w-5 h-5" />,
    tags: ["Historical", "Rare Books", "Gospel Order"],
    orderLink: "https://www.nurushop.co.ke/shop?category=pioneers-writings"
  },
  {
    title: "Educational & Children's Literature",
    description: "Materials designed to nurture faith in the younger generation. Illustrated Bible stories, simplified lesson studies, and character-building activity books.",
    image: "/assets/books.png",
    icon: <Library className="w-5 h-5" />,
    tags: ["Blueprint Curriculum", "Study Guides", ""],
    orderLink: "https://www.nurushop.co.ke"
  }
];

export default function LiteraturePage() {
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
          <h1 className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-500 mb-6 tracking-tight">
            Publications & <span className="text-slate-900 dark:text-white">Literature</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
            We provide a wide range of spiritual and educational materials curated to nourish your soul and expand your biblical understanding.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
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
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
                <div className="mt-auto">
                  <a 
                    href={service.orderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 bg-blue-600 dark:bg-blue-600 text-white font-bold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Place Order
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="p-8 bg-blue-600 rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Can&apos;t find a specific book?</h3>
          <p className="opacity-90 mb-6">We can help source specific theological works and archives upon request.</p>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Our Librarian
          </a>
        </div>
      </div>
    </main>
  );
}
