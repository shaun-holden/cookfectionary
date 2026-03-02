"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import toast from "react-hot-toast";

const STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false); });
  }, [token]);

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as Order["status"] } : o));
      toast.success("Status updated");
    } else {
      toast.error("Update failed");
    }
  }

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    COMPLETED: "bg-purple-500/10 text-purple-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-6">Orders</h1>
      {loading ? (
        <div className="space-y-3">{Array(5).fill(null).map((_, i) => <div key={i} className="bg-gray-900 rounded-xl h-24 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-white">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-400">{order.user?.name} · {order.user?.email}</p>
                  {order.user?.phone && <p className="text-xs text-gray-500">{order.user.phone}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-white">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400 mb-3">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                {order.eventType && <span>Event: {order.eventType}</span>}
                {order.eventDate && <span>Date: {new Date(order.eventDate).toLocaleDateString()}</span>}
                {order.guestCount && <span>Guests: {order.guestCount}</span>}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {order.items.map(item => (
                  <span key={item.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                    {item.menuItem?.name} ×{item.quantity}
                  </span>
                ))}
              </div>
              {order.notes && <p className="text-xs text-gray-400 italic mb-3">Note: {order.notes}</p>}
              <div className="flex flex-wrap gap-2">
                {STATUSES.filter(s => s !== order.status).map(s => (
                  <button key={s} onClick={() => updateStatus(order.id, s)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                    → {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-center py-12">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}
