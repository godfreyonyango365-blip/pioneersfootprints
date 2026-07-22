"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  error?: string;
  message?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/np-godfrey123/login");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const uploadToCloudinary = async (uploadFile: File) => {
    const formData = new FormData();
    formData.append("file", uploadFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok) {
      throw new Error(data.error || data.message || "Upload failed");
    }

    return data;
  };

  const handleUpload = async () => {
    if (!file || !name || !description) {
      alert("Please fill required fields");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10MB");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      console.log("Starting Cloudinary upload...");
      const fileRes = await uploadToCloudinary(file);
      console.log("Cloudinary upload successful:", fileRes);
      setProgress(50);

      let thumbUrl = "";
      let thumbPublicId = "";

      if (thumbnail) {
        console.log("Uploading thumbnail...");
        const thumbRes = await uploadToCloudinary(thumbnail);
        thumbUrl = thumbRes.secure_url;
        thumbPublicId = thumbRes.public_id;
        console.log("Thumbnail upload successful:", thumbRes);
      }
      setProgress(75);

      console.log("Saving to Firestore...", {
        name,
        description,
        fileUrl: fileRes.secure_url,
        filePublicId: fileRes.public_id,
        thumbnailUrl: thumbUrl,
        thumbnailPublicId: thumbPublicId,
      });

      const docRef = await addDoc(collection(db, "publications"), {
        name,
        description,
        fileUrl: fileRes.secure_url,
        filePublicId: fileRes.public_id,
        thumbnailUrl: thumbUrl,
        thumbnailPublicId: thumbPublicId,
        createdAt: serverTimestamp(),
      });

      console.log("Document saved to Firestore with ID:", docRef.id);
      setProgress(100);

      alert("Upload successful! Publication added to library.");

      setName("");
      setDescription("");
      setFile(null);
      setThumbnail(null);
      setFilePreview(null);
      setThumbPreview(null);
      setProgress(0);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String(err.message)
            : "Upload failed";
      console.error("Error details:", message);
      alert(`Upload failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      {authLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-slate-600">Checking authentication...</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Upload Publication
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload PDF documents with optional thumbnail preview.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Document (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setFilePreview(URL.createObjectURL(f));
            }}
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Thumbnail (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setThumbnail(f);
              if (f) setThumbPreview(URL.createObjectURL(f));
            }}
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-800"
          />
        </div>

        {(filePreview || thumbPreview) && (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {filePreview && (
              <iframe src={filePreview} className="h-60 w-full rounded-lg border" />
            )}
            {thumbPreview && (
              <img
                src={thumbPreview}
                alt="Thumbnail preview"
                className="h-32 w-32 rounded-lg border object-cover"
              />
            )}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Uploading... {progress}%
            <div className="mt-2 h-2 w-full rounded bg-blue-100">
              <div
                className="h-2 rounded bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Uploading..." : "Upload Publication"}
        </button>
        </div>
      )}
    </main>
  );
}
