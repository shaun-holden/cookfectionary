"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, ImageIcon, FileText, Users, MessageSquare, LogOut } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 pt-16 flex">
        <aside className="hidden md:flex flex-col w-56 bg-gray-900 border-r border-gray-800 p-4 fixed top-16 bottom-0 left-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3">Admin Panel</p>
          <nav className="flex-1 space-y-1">
            {navLinks.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-brand-500/10 text-brand-400 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"}`}>
                  <Icon size={16} />{label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 px-3 py-2 rounded-lg">
            <LogOut size={16} />Sign Out
          </button>
        </aside>
        <main className="flex-1 md:ml-56 p-6 text-white">{children}</main>
      </div>
    </>
  );
}
