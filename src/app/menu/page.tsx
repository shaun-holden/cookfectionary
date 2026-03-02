"use client";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";
import toast from "react-hot-toast";
import { Plus, ShoppingCart } from "lucide-react";

const CATEGORIES = ["All", "Mains", "Sides", "Desserts", "Drinks"];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(d => { setItems(d.items || []); setLoading(false); });
  }, []);

  const filtered = category === "All" ? items : items.filter(i => i.category === category);

  return (
    <PublicLayout>
      <section className="bg-dark py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Our Menu</h1>
          <p className="text-gray-400">Fresh, authentic Caribbean cuisine crafted for your event.</p>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-brand-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-orange-100 group">
                  <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-5xl">🍽️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">{item.category}</p>
                    <h3 className="font-semibold text-dark mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-brand-600 text-lg">${item.price.toFixed(2)}</p>
                      <button onClick={() => { addItem(item); toast.success(`${item.name} added!`); }}
                        className="bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-lg transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
