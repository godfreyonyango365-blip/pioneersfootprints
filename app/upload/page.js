"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUrl(data.secure_url);
      setPublicId(data.public_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUrl("");
      setPublicId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload PDF/DOC</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p>{error}</p>}

      {url && (
        <div>
          <p>Uploaded File:</p>
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
          <p>Public ID: {publicId}</p>
        </div>
      )}
    </div>
  );
}
