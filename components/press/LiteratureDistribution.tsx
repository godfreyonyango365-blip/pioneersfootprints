"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { BookOpenText, MapPin } from "lucide-react";

import { db } from "@/lib/firebase";
import type { ContentEntry } from "@/lib/press";

const fallback: ContentEntry = {
  id: "distribution-introduction",
  name: "Literature for communities across Kenya and beyond",
  description:
    "We distribute pamphlets, tracts, Bibles, booklets, Ellen G. White books and our own publications, helping educational and spiritual literature reach readers wherever it is needed.",
  imageUrl: "/assets/books.png",
};

export default function LiteratureDistribution() {
  const [entries, setEntries] = useState<ContentEntry[]>([fallback]);
  const [message, setMessage] = useState("");

  useEffect(
    () =>
      onSnapshot(
        collection(db, "pressDistributions"),
        (snapshot) => {
          const updates = snapshot.docs
            .map((document) => ({ ...document.data(), id: document.id }) as ContentEntry)
            .filter((entry) => entry.name && entry.description && entry.imageUrl)
            .sort((a, b) => a.name.localeCompare(b.name));
          setEntries(updates.length ? updates : [fallback]);
          setMessage("");
        },
        () => {
          setEntries([fallback]);
          setMessage("Recent distribution updates are temporarily unavailable.");
        },
      ),
    [],
  );

  return (
    <section id="literature-distribution" className="bg-[#f5f8fc] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Reaching readers</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Pioneers Footprints Literature Distribution</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Distribution of pamphlets, tracts, Bibles, booklets, Ellen G. White books and our publications across Kenya and beyond.
          </p>
        </div>

        {message && <p role="status" className="mt-8 text-sm text-amber-800">{message}</p>}

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-72 bg-slate-100 sm:h-80">
                <img src={entry.imageUrl} alt={entry.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-7 sm:p-8">
                <div className="mb-4 flex items-center gap-3 text-blue-800">
                  <BookOpenText className="h-6 w-6" aria-hidden="true" />
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">{entry.name}</h3>
                <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{entry.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
