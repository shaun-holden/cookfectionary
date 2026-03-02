"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MenuItem } from "@/types";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const CATEGORIES = ["Mains", "Sides", "Desserts", "Drinks"];
const BLANK = { name: "", description: "", price: "", category: "Mains", image: "", available: true };

export default function AdminMenuPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<typeof BLANK>(BLANK);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(d => setItems(d.items || []));
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ folder: "cookfectionary/menu" }),
      });
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", apiKey);
      fd.append("folder", "cookfectionary/menu");
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const upData = await upRes.json();
      setForm(f => ({ ...f, image: upData.secure_url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveItem() {
    const url = editing ? `/api/menu/${editing.id}` : "/api/menu";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: parseFloat(form.price as unknown as string) }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? data.item : i));
    } else {
      setItems(prev => [...prev, data.item]);
    }
    toast.success(editing ? "Item updated" : "Item created");
    setShowForm(false);
    setEditing(null);
    setForm(BLANK);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setItems(prev => prev.filter(i => i.id !== id)); toast.success("Deleted"); }
    else toast.error("Delete failed");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Menu Items</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }}
          className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 flex items-center gap-2">
          <Plus size={15} />Add Item
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">{editing ? "Edit Item" : "New Menu Item"}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["name", "Name", "text"], ["description", "Description", "text"], ["price", "Price ($)", "number"]].map(([k, l, t]) => (
              <div key={k} className={k === "description" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{l}</label>
                <input type={t} value={form[k as keyof typeof form] as string}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }}
                className="w-full text-sm text-gray-400" />
              {uploading && <p className="text-xs text-brand-400 mt-1">Uploading...</p>}
              {form.image && <img src={form.image} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />}
            </div>
          </div>
          <button onClick={saveItem} className="mt-4 bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 flex items-center gap-2">
            <Check size={15} />{editing ? "Update" : "Create"} Item
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="h-36 bg-gray-800 flex items-center justify-center overflow-hidden">
              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-4xl">🍽️</span>}
            </div>
            <div className="p-4">
              <p className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">{item.category}</p>
              <p className="font-semibold text-white mb-1">{item.name}</p>
              <p className="text-gray-400 text-xs line-clamp-2 mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-400">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(item); setForm({ name: item.name, description: item.description, price: String(item.price), category: item.category, image: item.image || "", available: item.available }); setShowForm(true); }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
