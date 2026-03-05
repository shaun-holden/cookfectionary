"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, ShoppingBag, FileText, MessageSquare, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  const sidebarContent = (
    <>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Customer Portal</p>
      <nav className="flex-1 space-y-1">
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon size={16} />{label}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg transition-colors">
        <LogOut size={16} />Sign Out
      </button>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream pt-16 flex">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-[4.5rem] left-4 z-40 bg-white border border-orange-200 text-gray-600 p-2 rounded-lg shadow-sm"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-30">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative flex flex-col w-56 h-full bg-white border-r border-orange-100 p-4">
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-orange-100 p-4 fixed top-16 bottom-0 left-0">
          {sidebarContent}
        </aside>

        <main className="flex-1 md:ml-56 p-6 pt-16 md:pt-6">{children}</main>
      </div>
    </>
  );
}
