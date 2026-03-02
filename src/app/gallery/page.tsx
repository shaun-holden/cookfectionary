"use client";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { GalleryImage } from "@/types";
import { X } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery").then(r => r.json()).then(d => { setImages(d.images || []); setLoading(false); });
  }, []);

  return (
    <PublicLayout>
      <section className="bg-dark py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Work</p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-gray-400">A glimpse of the events, dishes, and memories we&apos;ve helped create.</p>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl animate-pulse" style={{ height: `${200 + i * 40}px` }} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Gallery coming soon.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map(img => (
                <div key={img.id} onClick={() => setSelected(img)}
                  className="break-inside-avoid cursor-pointer rounded-2xl overflow-hidden group relative">
                  <img src={img.imageUrl} alt={img.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold">{img.title}</p>
                      {img.category && <p className="text-brand-300 text-sm">{img.category}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-brand-400" onClick={() => setSelected(null)}>
            <X size={28} />
          </button>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <img src={selected.imageUrl} alt={selected.title} className="max-h-[80vh] max-w-full object-contain rounded-xl" />
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">{selected.title}</p>
              {selected.description && <p className="text-gray-400 text-sm mt-1">{selected.description}</p>}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
