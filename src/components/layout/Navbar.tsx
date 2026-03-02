"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur border-b border-brand-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-xl font-bold text-brand-400">
            Cookfectionary
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-300 hover:text-brand-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/order" className="relative text-gray-300 hover:text-brand-400 transition-colors p-2">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-brand-400 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  {user.role === "ADMIN" ? "Admin" : "Dashboard"}
                </Link>
                <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors ml-2">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-brand-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark border-t border-brand-700/30 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-gray-300 hover:text-brand-400 py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/order" onClick={() => setOpen(false)} className="text-gray-300 hover:text-brand-400 py-1 flex items-center gap-2">
            <ShoppingCart size={16} /> Order ({count})
          </Link>
          {user ? (
            <>
              <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="text-gray-300 hover:text-brand-400 py-1">
                {user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
              </Link>
              <button onClick={() => { logout(); setOpen(false); }} className="text-red-400 text-left py-1">Sign Out</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="bg-brand-500 text-white px-4 py-2 rounded-lg text-center">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
