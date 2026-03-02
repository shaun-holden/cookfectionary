"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Invoice, Order } from "@/types";
import toast from "react-hot-toast";
import { Plus, X, ExternalLink } from "lucide-react";

export default function AdminInvoicesPage() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderId: "", amount: "", deposit: "", dueDate: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/invoices", { headers: h }).then(r => r.json()),
      fetch("/api/orders", { headers: h }).then(r => r.json()),
    ]).then(([inv, od]) => { setInvoices(inv.invoices || []); setOrders(od.orders || []); });
  }, [token]);

  async function createInvoice() {
    setCreating(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount), deposit: form.deposit ? parseFloat(form.deposit) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoices(prev => [data.invoice, ...prev]);
      toast.success("Invoice created and sent to customer!");
      setShowForm(false);
      setForm({ orderId: "", amount: "", deposit: "", dueDate: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  }

  const statusColor: Record<string, string> = {
    PENDING: "bg-gray-500/10 text-gray-400",
    SENT: "bg-blue-500/10 text-blue-400",
    PAID: "bg-green-500/10 text-green-400",
    OVERDUE: "bg-red-500/10 text-red-400",
    CANCELLED: "bg-gray-500/10 text-gray-500",
  };

  const uninvoicedOrders = orders.filter(o => !o.invoice && o.status !== "CANCELLED");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Invoices</h1>
        <button onClick={() => setShowForm(true)} className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 flex items-center gap-2">
          <Plus size={15} />Create Invoice
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">New Invoice</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Order</label>
              <select value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select order...</option>
                {uninvoicedOrders.map(o => (
                  <option key={o.id} value={o.id}>#{o.id.slice(-8).toUpperCase()} — {o.user?.name} (${o.total.toFixed(2)})</option>
                ))}
              </select>
            </div>
            {[["amount", "Invoice Amount ($)"], ["deposit", "Deposit Required ($, optional)"]].map(([k, l]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{l}</label>
                <input type="number" value={form[k as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Due Date (optional)</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <button onClick={createInvoice} disabled={creating || !form.orderId || !form.amount}
            className="mt-4 bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-60">
            {creating ? "Creating..." : "Create & Send Invoice"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {invoices.map(inv => (
          <div key={inv.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white">Invoice #{inv.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-400">{inv.order?.user?.name} · {new Date(inv.createdAt).toLocaleDateString()}</p>
                {inv.dueDate && <p className="text-xs text-gray-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[inv.status]}`}>{inv.status}</span>
                <p className="text-xl font-bold text-white">${inv.amount.toFixed(2)}</p>
              </div>
            </div>
            {inv.stripeUrl && (
              <a href={inv.stripeUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1.5 text-brand-400 text-xs hover:text-brand-300">
                <ExternalLink size={12} />View Payment Link
              </a>
            )}
          </div>
        ))}
        {invoices.length === 0 && <p className="text-gray-500 text-center py-12">No invoices yet.</p>}
      </div>
    </div>
  );
}
