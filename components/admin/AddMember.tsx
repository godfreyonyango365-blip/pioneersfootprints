"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddMember() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [metadata, setMetadata] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name) {
      alert("Please enter a member name.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "members"), {
        name,
        imageUrl,
        metadata,
        createdAt: serverTimestamp(),
      });

      setName("");
      setImageUrl("");
      setMetadata("");
      alert("Member added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700">Member Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Enter member name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Metadata</label>
        <textarea
          value={metadata}
          onChange={(event) => setMetadata(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Additional member notes"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:opacity-70"
      >
        {loading ? "Saving member..." : "Save Member"}
      </button>
    </form>
  );
}
