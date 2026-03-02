"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Order, Invoice } from "@/types";
import { ShoppingBag, FileText, MessageSquare, Plus } from "lucide-react";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/orders", { headers: h }).then(r => r.json()),
      fetch("/api/invoices", { headers: h }).then(r => r.json()),
    ]).then(([od, inv]) => { setOrders(od.orders || []); setInvoices(inv.invoices || []); });
  }, [token]);

  const pendingInvoices = invoices.filter(i => i.status === "SENT" || i.status === "OVERDUE");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-dark mb-1">Welcome back, {user?.name?.split(" ")[0]}!</h1>
      <p className="text-gray-500 mb-8">Here&apos;s a summary of your Cookfectionary account.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, href: "/dashboard/orders" },
          { label: "Pending Invoices", value: pendingInvoices.length, icon: FileText, href: "/dashboard/invoices" },
          { label: "Messages", value: "Chat", icon: MessageSquare, href: "/dashboard/messages" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="bg-white p-5 rounded-2xl border border-orange-100 hover:border-brand-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={18} className="text-brand-400 group-hover:text-brand-600" />
            </div>
            <p className="font-display text-3xl font-bold text-dark">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-orange-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-brand-500 text-sm hover:text-brand-700">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No orders yet</p>
            <Link href="/order" className="bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 inline-flex items-center gap-2">
              <Plus size={14} />Place an Order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}{order.eventType ? ` · ${order.eventType}` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-dark">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                    order.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending invoices */}
      {pendingInvoices.length > 0 && (
        <div className="bg-orange-50 border border-brand-200 rounded-2xl p-6">
          <h2 className="font-semibold text-dark mb-4">Invoices Awaiting Payment</h2>
          <div className="space-y-3">
            {pendingInvoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark">Invoice #{inv.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">${inv.amount.toFixed(2)}</p>
                </div>
                {inv.stripeUrl && (
                  <a href={inv.stripeUrl} target="_blank" rel="noopener noreferrer"
                    className="bg-brand-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-600">
                    Pay Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
