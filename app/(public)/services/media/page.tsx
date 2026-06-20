"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { MessageCircle, X } from "@/components/icon";

const WHATSAPP_NUMBER = "254742767609";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello,%20I%20am%20inquiring%20about a specific media service.`;

// Media Services Data
const mediaServices = [
  {
    title: "Website Design & Development",
    description: "Professional and responsive websites tailored for your business or personal brand. From concept to deployment, we ensure clean code and stunning visuals.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    tags: ["Webapps", "School Dashboard", "Phone Apps"],
    
  },
  {
    title: "Graphic Design",
    description: "Creative visual solutions for branding, marketing materials, and social media content. High-quality designs that communicate your message effectively.",
    image: "/assets/graphics.png",
    tags: ["Branding", "Logos", "Banners"],
  
  },
  {
    title: "Video Production",
    description: "Professional video services including promotional videos, documentaries, and event coverage. We handle scripting, shooting, and editing.",
    image: "/assets/editing.png",
    tags: ["Editing", "Filming", "Production"],
    
  },
  {
    title: "Photography & Camera Work",
    description: "Capture moments with professional photography services for events, products, or personal projects. High-quality images delivered fast.",
    image:  "/assets/camera.jpg",
    tags: ["Events", "Weddings", "Funerals"],
    
  }
];

export default function MediaPage() {
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
            Software & <span className="text-slate-900 dark:text-white">Media Services</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0">
            We offer professional digital solutions to help your brand shine, including website design, graphic design, video production, and photography.
          </p>
        </div>
      </div>

      {/* Media Services Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {mediaServices.map((service, index) => (
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
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="p-8 bg-blue-600 rounded-3xl text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Can&apos;t find a specific service?</h3>
          <p className="opacity-90 mb-6">We can help provide tailored media solutions upon request.</p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Our Media Team
          </a>
        </div>
      </div>
    </main>
  );
}
