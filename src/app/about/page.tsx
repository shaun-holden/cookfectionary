import PublicLayout from "@/components/layout/PublicLayout";
import { Heart, Award, Users } from "lucide-react";

export const metadata = { title: "About — Cookfectionary" };

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-dark py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-display text-5xl font-bold text-white mb-6">About Cookfectionary</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Born from a love of authentic Caribbean flavors and a passion for bringing people together around the table.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-brand-200 to-brand-400 rounded-3xl h-80 flex items-center justify-center text-8xl shadow-lg">
            👨‍🍳
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-dark mb-4">A Passion for Flavor</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookfectionary was founded on the belief that food is more than sustenance — it&apos;s memory, culture, and love. Our recipes have been passed down through generations, carrying the warmth of Caribbean kitchens into every event we cater.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              From intimate family gatherings to large-scale corporate events, we bring the same care and craftsmanship to every plate. We specialize in authentic Jamaican and Caribbean cuisine, prepared fresh the day of your event.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether it&apos;s the slow heat of our jerk chicken, the tender fall of our oxtail, or the sweetness of our rum cake — every dish is a story waiting to be shared.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Community", description: "We believe food builds community. Every event we cater is an opportunity to bring people closer." },
              { icon: Award, title: "Excellence", description: "We never compromise on quality. From sourcing ingredients to plating, excellence is our standard." },
              { icon: Users, title: "Service", description: "Your experience matters to us from first contact to the last plate. We're with you every step." },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center p-8 rounded-2xl border border-gray-800">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-500/10 rounded-2xl mb-4">
                  <Icon className="text-brand-400" size={26} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["500+", "Events Catered"], ["10K+", "Happy Guests"], ["15+", "Years Experience"], ["100%", "Satisfaction"]].map(([num, label]) => (
            <div key={label}>
              <p className="font-display text-4xl font-bold text-white">{num}</p>
              <p className="text-brand-100 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
