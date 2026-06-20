"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Inline SVG icons — replaces react-icons entirely
const IconWhatsapp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-white text-2xl w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.847L.057 23.882l6.19-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.5-5.24-1.375l-.375-.214-3.876.9.976-3.762-.233-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-xl w-5 h-5">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const IconYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-xl w-5 h-5">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);

const IconEnvelope = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-sm w-4 h-4">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-sm w-4 h-4">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const IconMapMarker = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-sm w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-sm w-4 h-4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    { icon: IconEnvelope, label: "pioneersfootprints1844@gmail.com", href: "mailto:pioneersfootprints1844@gmail.com" },
    { icon: IconPhone, label: "+254742767609", href: "tel:+254742767609" },
    { icon: IconMapMarker, label: "Kenya" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg viewBox="0 0 1440 80" className="w-full h-auto">
          <path fill="currentColor" className="text-gray-50" d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold mb-5">Pioneers<span className="text-blue-400 ml-55">Footprints</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Preserving the legacy and teachings of our spiritual pioneers — inspiring faith, unity, and commitment to God's cause.</p>
            <div className="flex gap-4">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                <IconFacebook />
              </a>
              <a href="https://youtube.com/@PioneersFootprints?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 transform hover:scale-110">
                <IconYoutube />
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="w-full">
            <h2 className="text-lg font-semibold mb-2 mt-10">Pioneers Footprints Reference Hub</h2>
            <p className="text-gray-400 text-sm mb-10">A curated gateway of trusted study platforms and historical references supporting biblical research, pioneer heritage, and ministry growth.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl">
              {[
                { name: "EGW Writings", url: "https://egwwritings.org/" },
                { name: "Sunday Law", url: "https://SundayLaw.com/" },
                { name: "Young Evangelists Ministry", url: "https://youngevangelists.vercel.app/" },
                { name: "Advent AI", url: "https://adventai.app/" },
                { name: "Advent Nurutech", url: "https://www.adventnurutech.xyz/" },
                { name: "Nuru Shop", url: "https://nurushop.co.ke/" },
              ].map((site, index) => (
                <a key={index} href={site.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-gray-800/40 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconGlobe />
                    </div>
                    <span className="text-gray-300 group-hover:text-white text-sm">{site.name}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h3 className="text-lg font-semibold mt-10">Get In Touch</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 flex-shrink-0 mt-0.5">
                    <item.icon />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">{item.label}</a>
                  ) : (
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="https://youtube.com/@PioneersFootprints?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg group">
            <div className="flex items-center gap-3">
              <IconYoutube />
              <div>
                <p className="text-white font-semibold">Visit our YouTube</p>
                <p className="text-white/80 text-xs">Watch sermons & teachings</p>
              </div>
            </div>
            <span className="text-white group-hover:translate-x-1 transition-transform">↗</span>
          </a>

          <a href="https://wa.me/254742767609?text=Hello%20Pioneers%20Footprints" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg group">
            <div className="flex items-center gap-3">
              <IconWhatsapp />
              <div>
                <p className="text-white font-semibold">Chat on WhatsApp</p>
                <p className="text-white/80 text-xs">Instant ministry support</p>
              </div>
            </div>
            <span className="text-white group-hover:translate-x-1 transition-transform">↗</span>
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-400 text-center md:text-left">
              <p>© {currentYear} Pioneers Footprints. All Rights Reserved.</p>
            </div>
            <div className="text-gray-500 text-center md:text-right">
              <p>Designed & powered by <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Advent Pioneers Tech</a></p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Sitemap</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}