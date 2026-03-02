"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import { Plus } from "lucide-react";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false); });
  }, [token]);

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-purple-100 text-purple-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-dark">My Orders</h1>
        <Link href="/order" className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 flex items-center gap-2">
          <Plus size={15} />New Order
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-orange-100 p-12 text-center">
          <p className="text-gray-400 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/order" className="bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-600">
            Browse Menu & Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-orange-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-dark">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status]}`}>{order.status.replace("_", " ")}</span>
                  <p className="text-sm font-bold text-dark">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-0.5">
                {order.eventType && <p>Event: {order.eventType}</p>}
                {order.eventDate && <p>Date: {new Date(order.eventDate).toLocaleDateString()}</p>}
                {order.guestCount && <p>Guests: {order.guestCount}</p>}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map(item => (
                    <span key={item.id} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                      {item.menuItem?.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              {order.invoice && order.invoice.status !== "PAID" && order.invoice.stripeUrl && (
                <a href={order.invoice.stripeUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 block w-full text-center bg-brand-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-600">
                  Pay Invoice — ${order.invoice.amount.toFixed(2)}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
