const testimonials = [
  { name: "Marcus & Diane T.", event: "Wedding Reception", quote: "Cookfectionary made our wedding day absolutely perfect. The jerk chicken and oxtail had our guests raving all night!" },
  { name: "Sarah M.", event: "Corporate Luncheon", quote: "Professional, delicious, and right on time. Our team has never been so well fed. Will definitely book again." },
  { name: "The Johnson Family", event: "Family Reunion", quote: "Every dish was authentic and made with love. It felt like grandma's Sunday cooking for 200 people!" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">Reviews</p>
          <h2 className="font-display text-4xl font-bold text-dark">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
              <div className="flex mb-3">
                {Array(5).fill(null).map((_, i) => (
                  <span key={i} className="text-brand-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-dark text-sm">{t.name}</p>
                <p className="text-brand-500 text-xs">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
