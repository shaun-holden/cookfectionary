"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Invoice } from "@/types";
import { ExternalLink } from "lucide-react";

export default function InvoicesPage() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/invoices", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setInvoices(d.invoices || []); setLoading(false); });
  }, [token]);

  const statusColor: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    SENT: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-dark mb-6">My Invoices</h1>
      {loading ? (
        <div className="space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />)}</div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-orange-100 p-12 text-center">
          <p className="text-gray-400">No invoices yet. They&apos;ll appear here once your order is confirmed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-2xl border border-orange-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark">Invoice #{inv.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  {inv.dueDate && <p className="text-xs text-gray-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[inv.status]}`}>{inv.status}</span>
                  <p className="text-lg font-bold text-dark">${inv.amount.toFixed(2)}</p>
                </div>
              </div>
              {inv.deposit && (
                <p className="text-sm text-gray-500 mt-2">Deposit: ${inv.deposit.toFixed(2)}</p>
              )}
              {inv.paidAt && <p className="text-sm text-green-600 mt-1">Paid on {new Date(inv.paidAt).toLocaleDateString()}</p>}
              {inv.stripeUrl && inv.status !== "PAID" && (
                <a href={inv.stripeUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full bg-brand-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600">
                  <ExternalLink size={14} />Pay Now
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
