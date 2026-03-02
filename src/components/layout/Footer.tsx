import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-xl text-brand-400 mb-3">Cookfectionary</h3>
            <p className="text-sm leading-relaxed">
              Where every bite tells a story. Premium Caribbean and soul food catering for your most memorable moments.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[["Home", "/"], ["About", "/about"], ["Menu", "/menu"], ["Gallery", "/gallery"], ["Contact", "/contact"], ["Order Now", "/order"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-brand-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /><a href="mailto:hello@cookfectionary.com" className="hover:text-brand-400">hello@cookfectionary.com</a></li>
              <li className="flex items-center gap-2"><Phone size={14} /><a href="tel:+1234567890" className="hover:text-brand-400">(123) 456-7890</a></li>
              <li className="flex items-center gap-2"><MapPin size={14} />Your City, State</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Instagram" className="hover:text-brand-400 transition-colors"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-brand-400 transition-colors"><Facebook size={18} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Cookfectionary. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
