"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GalleryImage } from "@/types";
import toast from "react-hot-toast";
import { Upload, Trash2, Plus, X } from "lucide-react";

const BLANK = { title: "", description: "", category: "", imageUrl: "" };

export default function AdminGalleryPage() {
  const { token } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/gallery").then(r => r.json()).then(d => setImages(d.images || []));
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ folder: "cookfectionary/gallery" }),
      });
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", apiKey);
      fd.append("folder", "cookfectionary/gallery");
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const upData = await upRes.json();
      setForm(f => ({ ...f, imageUrl: upData.secure_url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveImage() {
    if (!form.imageUrl) { toast.error("Please upload an image first"); return; }
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { toast.error("Failed to save"); return; }
    setImages(prev => [data.image, ...prev]);
    toast.success("Photo added to gallery!");
    setShowForm(false);
    setForm(BLANK);
  }

  async function deleteImage(id: string) {
    if (!confirm("Remove this photo?")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setImages(prev => prev.filter(i => i.id !== id)); toast.success("Removed"); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Gallery</h1>
        <button onClick={() => setShowForm(true)} className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 flex items-center gap-2">
          <Plus size={15} />Add Photo
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Add Gallery Photo</h2>
            <button onClick={() => { setShowForm(false); setForm(BLANK); }} className="text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Category (optional)</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Weddings, Events"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Description (optional)</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">Photo</label>
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-brand-500 transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
            </label>
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-3 h-32 rounded-xl object-cover" />}
          </div>
          <button onClick={saveImage} disabled={uploading || !form.title}
            className="bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-60">
            Add to Gallery
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-800">
            <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <button onClick={() => deleteImage(img.id)} className="self-end bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600">
                <Trash2 size={14} />
              </button>
              <div>
                <p className="text-white text-sm font-semibold">{img.title}</p>
                {img.category && <p className="text-brand-300 text-xs">{img.category}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && !showForm && (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No gallery photos yet.</p>
          <button onClick={() => setShowForm(true)} className="text-brand-400 hover:text-brand-300 text-sm">Upload your first photo</button>
        </div>
      )}
    </div>
  );
}
