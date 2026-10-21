"use client";
/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { ContentEntry } from "@/lib/press";

export default function ContentManager({ kind }: { kind: "books" | "team" }) {
  const source = kind === "books" ? "pressBooks" : "members";
  const noun = kind === "books" ? "book" : "team member";
  const empty = { name: "", description: "", imageUrl: "", price: "", role: "" };
  const [form, setForm] = useState(empty);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => onSnapshot(collection(db, source), snapshot => {
    setEntries(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ContentEntry)).sort((a,b) => a.name.localeCompare(b.name)));
    setLoaded(true);
  }, () => { setError("Unable to load content. Check your connection and Firestore permissions."); setLoaded(true); }), [source]);
  function reset() { setEditing(null); setForm(empty); setFile(null); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!auth.currentUser) { setError("Please sign in before saving."); return; }
    if (!form.name.trim() || !form.description.trim()) { setError("Enter a name and description."); return; }
    if (kind === "books" && (!form.price.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0)) { setError("Enter a valid price."); return; }
    if (!file && !form.imageUrl) { setError("Choose a photo."); return; }
    setBusy(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Choose a JPG, PNG or WebP image up to 10 MB.");
        const body = new FormData(); body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok || !data.secure_url) throw new Error(data.error || "Photo upload failed.");
        imageUrl = data.secure_url;
        setForm(current => ({ ...current, imageUrl })); setFile(null);
      }
      const data = { name: form.name.trim(), description: form.description.trim(), imageUrl,
        ...(kind === "books" ? { price: Number(form.price) } : { role: form.role.trim() }), updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, source, editing), data);
      else await addDoc(collection(db, source), { ...data, createdAt: serverTimestamp() });
      reset(); setMessage("Saved. This entry now appears on your website.");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save. Please try again."); }
    finally { setBusy(false); }
  }
  async function remove(entry: ContentEntry) {
    if (!window.confirm(`Remove ${entry.name} from the website?`)) return;
    setBusy(true); setError(""); setMessage("");
    try { await deleteDoc(doc(db, source, entry.id)); if (editing === entry.id) reset(); setMessage("Removed successfully."); }
    catch { setError("Unable to remove this entry. Please try again."); }
    finally { setBusy(false); }
  }
  const field = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-blue-600";
  return <div className="mx-auto max-w-6xl space-y-8 text-slate-900">
    <div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Website content</p><h1 className="mt-2 text-3xl font-bold">{kind === "books" ? "Press book catalogue" : "Team members"}</h1><p className="mt-3 text-slate-600">Manage names, descriptions and photos. Saved changes appear on the public website.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    {message && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}
    <div className="grid items-start gap-8 lg:grid-cols-2">
    <form onSubmit={save} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">{editing ? "Edit" : "Add"} {noun}</h2>
      <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
      <label className="block font-medium">{kind === "books" ? "Book title" : "Full name"}<input className={field} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required maxLength={160}/></label>
      {kind === "books" ? <label className="block font-medium">Price (KES)<input type="number" min="0" step="0.01" required className={field} value={form.price} onChange={e => setForm({...form, price: e.target.value})}/></label> : <label className="block font-medium">Role / position<input className={field} value={form.role} onChange={e => setForm({...form, role: e.target.value})} maxLength={120}/></label>}
      <label className="block font-medium">{kind === "books" ? "Book description" : "Short description"}<textarea className={field} rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required maxLength={2000}/></label>
      {form.imageUrl && <img src={form.imageUrl} alt={form.name || "Current photo"} className="h-36 w-28 rounded-lg object-cover"/>}
      <label className="block font-medium">{kind === "books" ? "Book cover" : "Profile photo"}<input key={`${editing}-${form.imageUrl}`} type="file" accept="image/jpeg,image/png,image/webp" className={field} onChange={e => setFile(e.target.files?.[0] || null)} required={!form.imageUrl}/><span className="mt-1 block text-sm font-normal text-slate-500">JPG, PNG or WebP, up to 10 MB. {file?.name}</span></label>
      <div className="flex flex-wrap gap-3"><button className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white" type="submit">{busy ? "Saving..." : `Save ${noun}`}</button>{editing && <button type="button" onClick={reset} className="rounded-xl border px-5 py-3">Cancel edit</button>}</div>
      </fieldset>
    </form>
    <section className="space-y-4"><h2 className="text-xl font-bold">Published entries ({entries.length})</h2>
      {!loaded && <p role="status">Loading content...</p>}{loaded && !entries.length && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-slate-500">Add your first {noun} using the form.</p>}
      {entries.map(entry => <article key={entry.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.name} className="h-24 w-20 shrink-0 rounded-lg object-cover"/>}
        <div className="min-w-0"><h3 className="font-bold">{entry.name}</h3><p className="text-sm text-blue-700">{kind === "books" ? `KES ${Number(entry.price).toLocaleString()}` : entry.role}</p><p className="mt-2 line-clamp-2 text-sm text-slate-600">{entry.description}</p>
        <div className="mt-3 flex gap-4"><button disabled={busy} onClick={() => { setEditing(entry.id); setForm({ name: entry.name, description: entry.description || "", imageUrl: entry.imageUrl || "", price: String(entry.price ?? ""), role: entry.role || "" }); setFile(null); setMessage(""); }} className="font-semibold text-blue-700">Edit</button><button disabled={busy} onClick={() => remove(entry)} className="font-semibold text-red-700">Remove</button></div></div>
      </article>)}
    </section></div>
  </div>;
}
