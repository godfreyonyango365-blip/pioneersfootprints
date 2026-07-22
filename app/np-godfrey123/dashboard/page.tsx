"use client";

import Link from "next/link";
import {
  BookOpen,
  Download,
  Library,
  Newspaper,
  Video,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Publications",
      description: "Read and download books, magazines, and missionary tracts.",
      href: "/publications",
      icon: <Library className="w-8 h-8" />,
    },
    {
      title: "Articles",
      description: "Study present truth and Adventist pioneer writings.",
      href: "/articles",
      icon: <Newspaper className="w-8 h-8" />,
    },
    {
      title: "Books",
      description: "Browse the growing digital library.",
      href: "/books",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Downloads",
      description: "Download PDFs and missionary resources.",
      href: "/downloads",
      icon: <Download className="w-8 h-8" />,
    },
    {
      title: "Media",
      description: "Watch sermons, studies, and evangelistic videos.",
      href: "/media",
      icon: <Video className="w-8 h-8" />,
    },
    {
      title: "Support the Ministry",
      description: "Partner with us in advancing the publishing work.",
      href: "/donate",
      icon: <HeartHandshake className="w-8 h-8" />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0D0C29] text-white">
      {/* Hero */}
      <section className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Pioneers Footprints
          </h1>

          <p className="mt-6 max-w-3xl text-slate-300 text-lg">
            Preserving and sharing the everlasting gospel through literature,
            Adventist pioneer writings, health publications, and missionary
            resources.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/publications"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold transition"
            >
              Browse Publications
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-slate-700 hover:bg-slate-800 px-6 py-3 font-semibold transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10">
          Explore the Library
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-blue-500 transition p-8 group"
            >
              <div className="text-blue-500 mb-6">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-slate-400 mb-6">
                {item.description}
              </p>

              <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition">
                Open
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-slate-500 text-center">
          © {new Date().getFullYear()} Pioneers Footprints Reference Hub.
          All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}