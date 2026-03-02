"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, ShoppingBag, FileText, MessageSquare, LogOut } from "lucide-react";

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

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-orange-100 p-4 fixed top-16 bottom-0 left-0">
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
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg transition-colors">
            <LogOut size={16} />Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-56 p-6">{children}</main>
      </div>
    </>
  );
}
