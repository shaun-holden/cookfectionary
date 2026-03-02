import { Utensils, Heart, Star, Clock } from "lucide-react";

const features = [
  { icon: Utensils, title: "Authentic Recipes", description: "Every dish is made from scratch using time-honored Caribbean family recipes." },
  { icon: Heart, title: "Made with Love", description: "We pour passion into every plate, treating your event like our own celebration." },
  { icon: Star, title: "Premium Quality", description: "Only the freshest ingredients, sourced locally whenever possible." },
  { icon: Clock, title: "On-Time Always", description: "We understand your event timeline and guarantee punctual, professional service." },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="font-display text-4xl font-bold text-white">The Cookfectionary Difference</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center p-6 rounded-2xl border border-gray-800 hover:border-brand-600 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500/10 rounded-xl mb-4">
                <Icon className="text-brand-400" size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
