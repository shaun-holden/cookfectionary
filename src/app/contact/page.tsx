"use client";
import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // In production connect this to Formspree or your email API
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll be in touch within 24 hours.");
    setForm({ name: "", email: "", phone: "", eventType: "", message: "" });
    setLoading(false);
  }

  return (
    <PublicLayout>
      <section className="bg-dark py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400">Ready to book or have questions? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
            <h2 className="font-display text-2xl font-bold text-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                    <option value="">Select...</option>
                    <option>Wedding</option>
                    <option>Corporate Event</option>
                    <option>Birthday Party</option>
                    <option>Family Reunion</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                <Send size={16} />{loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-dark mb-6">Contact Information</h2>
              <ul className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "hello@cookfectionary.com", href: "mailto:hello@cookfectionary.com" },
                  { icon: Phone, label: "Phone", value: "(123) 456-7890", href: "tel:+1234567890" },
                  { icon: MapPin, label: "Location", value: "Your City, State" },
                  { icon: Clock, label: "Hours", value: "Mon–Sat: 9am – 7pm" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-brand-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                      {href ? <a href={href} className="text-dark hover:text-brand-600 font-medium">{value}</a>
                        : <p className="text-dark font-medium">{value}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl">
              <h3 className="font-semibold text-dark mb-2">Event Consultations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We offer free 30-minute consultations for new events. Book online or call us to discuss your needs, guest count, and get a custom quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
