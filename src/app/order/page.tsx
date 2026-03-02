"use client";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MenuItem } from "@/types";
import toast from "react-hot-toast";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["All", "Mains", "Sides", "Desserts", "Drinks"];

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState("All");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(d => setMenuItems(d.items || []));
  }, []);

  const filtered = category === "All" ? menuItems : menuItems.filter(i => i.category === category);

  async function placeOrder() {
    if (!user) { router.push("/login"); return; }
    if (!items.length) { toast.error("Add items to your order first"); return; }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity, notes: i.notes })),
          eventDate: eventDate || undefined,
          eventType: eventType || undefined,
          guestCount: guestCount ? parseInt(guestCount) : undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      toast.success("Order placed! Check your email for confirmation.");
      router.push("/dashboard/orders");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <PublicLayout>
      <section className="bg-dark py-12 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Build Your Order</h1>
        <p className="text-gray-400">Select items, add your event details, and we&apos;ll take care of the rest.</p>
      </section>

      <section className="py-10 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Menu */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-brand-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(item => {
                const cartItem = items.find(i => i.menuItem.id === item.id);
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-orange-100 p-4 flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🍽️</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs line-clamp-1 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-brand-600 font-bold text-sm">${item.price.toFixed(2)}</p>
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} className="w-7 h-7 bg-brand-100 text-brand-700 rounded-lg flex items-center justify-center hover:bg-brand-200">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} className="w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center hover:bg-brand-600">
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { addItem(item); toast.success(`${item.name} added`); }}
                            className="bg-brand-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-1">
                            <Plus size={12} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-orange-100 p-6 sticky top-20">
              <h2 className="font-semibold text-dark mb-4 flex items-center gap-2"><ShoppingCart size={18} /> Your Order</h2>

              {items.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No items yet. Add from the menu!</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{item.menuItem.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity} · ${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeItem(item.menuItem.id)} className="text-gray-400 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between font-bold text-dark">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Final price confirmed after consultation</p>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Event Date</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
                  <select value={eventType} onChange={e => setEventType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                    <option value="">Select type...</option>
                    <option>Wedding</option><option>Corporate Event</option><option>Birthday Party</option>
                    <option>Family Reunion</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Guest Count</label>
                  <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} min="1" placeholder="e.g. 50"
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Special Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Dietary restrictions, preferences..."
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                </div>
              </div>

              {user ? (
                <button onClick={placeOrder} disabled={placing || !items.length}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60">
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              ) : (
                <Link href="/login" className="block text-center w-full bg-brand-500 text-white py-3 rounded-xl font-semibold">
                  Sign In to Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
