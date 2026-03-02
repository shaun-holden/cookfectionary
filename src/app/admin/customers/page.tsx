"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Phone } from "lucide-react";

interface Customer { id: string; name: string; email: string; phone?: string; createdAt: string; _count: { orders: number } }

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/customers", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setCustomers(d.customers || []); setLoading(false); });
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-6">Customers ({customers.length})</h1>
      {loading ? (
        <div className="space-y-3">{Array(5).fill(null).map((_, i) => <div key={i} className="bg-gray-900 rounded-xl h-16 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{c.name}</p>
                <div className="flex gap-4 mt-1">
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-400">
                    <Mail size={11} />{c.email}
                  </a>
                  {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-400">
                    <Phone size={11} />{c.phone}
                  </a>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{c._count.orders} order{c._count.orders !== 1 ? "s" : ""}</p>
                <p className="text-xs text-gray-500">Joined {new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {customers.length === 0 && <p className="text-gray-500 text-center py-12">No customers yet.</p>}
        </div>
      )}
    </div>
  );
}
