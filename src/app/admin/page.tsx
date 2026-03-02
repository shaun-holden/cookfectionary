"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import { ShoppingBag, Users, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/orders", { headers: h }).then(r => r.json()),
      fetch("/api/customers", { headers: h }).then(r => r.json()),
    ]).then(([od, cu]) => {
      setOrders(od.orders || []);
      setCustomerCount(cu.customers?.length || 0);
    });
  }, [token]);

  const revenue = orders.filter(o => o.paymentStatus === "PAID").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === "PENDING").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Revenue", value: `$${revenue.toFixed(0)}`, icon: DollarSign, color: "text-green-400" },
    { label: "Customers", value: customerCount, icon: Users, color: "text-purple-400" },
    { label: "Pending", value: pending, icon: Clock, color: "text-yellow-400" },
  ];

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CONFIRMED: "bg-green-500/10 text-green-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400",
    COMPLETED: "bg-purple-500/10 text-purple-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Cookfectionary operations overview</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-400">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-brand-400 text-sm hover:text-brand-300">View all</Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 8).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">#{order.id.slice(-8).toUpperCase()} — {order.user?.name}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}{order.eventType ? ` · ${order.eventType}` : ""}{order.guestCount ? ` · ${order.guestCount} guests` : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-white">${order.total.toFixed(2)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status]}`}>{order.status}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
