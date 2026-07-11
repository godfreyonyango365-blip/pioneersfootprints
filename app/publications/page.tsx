"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { BookOpen, Search, Inbox } from "@/components/icon";

interface Publication {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
}

/* ---------------- SKELETON CARD ---------------- */
function SkeletonCard() {
  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-slate-800" />

      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-full bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 dark:bg-slate-800 rounded" />

        <div className="flex gap-2 pt-2">
          <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-800 rounded" />
          <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filtered, setFiltered] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "publications"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Publication[];

        setPublications(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(publications);
      return;
    }

    const filteredData = publications.filter((pub) =>
      `${pub.name} ${pub.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFiltered(filteredData);
  }, [search, publications]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-200 dark:border-slate-800 pb-6">

          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Publications <span className="text-blue-600 dark:text-blue-400">Library</span>
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading library..."
                  : `${filtered.length} documents available`}
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search publications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg 
                         bg-white dark:bg-slate-900 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* LOADING SKELETONS */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <Inbox className="w-14 h-14 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-white">
              No publications found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try changing your search keywords
            </p>
          </div>
        ) : (
          /* GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub) => (
              <div
                key={pub.id}
                className="border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden 
                           bg-white dark:bg-slate-900 hover:shadow-lg transition"
              >

                {/* THUMBNAIL (CLICKABLE) */}
                <div className="h-40 bg-gray-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer">
                  {pub.thumbnailUrl ? (
                    <img
                      src={pub.thumbnailUrl}
                      alt={pub.name}
                      className="w-full h-full object-cover"
                      onClick={() => setSelectedImage(pub.thumbnailUrl ?? null)}
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">
                      No Thumbnail
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {pub.name}
                  </h2>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {pub.description}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedPdf(pub.fileUrl)}
                      className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-1 rounded 
                                 hover:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      View
                    </button>

                    <a
                      href={pub.fileUrl}
                      download
                      className="flex-1 bg-green-600 dark:bg-green-500 text-white py-1 rounded text-center 
                                 hover:bg-green-700 dark:hover:bg-green-600"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF MODAL */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 w-[95%] h-[90%] rounded-lg overflow-hidden relative">

              <button
                onClick={() => setSelectedPdf(null)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded z-10"
              >
                Close
              </button>

              <iframe src={selectedPdf} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* IMAGE PREVIEW MODAL */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full p-4">

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded z-10"
              >
                Close
              </button>

              <img
                src={selectedImage}
                alt="Selected publication preview"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}