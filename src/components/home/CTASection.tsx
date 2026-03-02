import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-brand-600">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Make Your Event Unforgettable?</h2>
        <p className="text-brand-100 text-lg mb-8">Get in touch today to discuss your event and receive a custom quote.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/order" className="bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-50 transition-colors">
            Order Now
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
