import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getFeaturedItems() {
  try {
    return await prisma.menuItem.findMany({ where: { available: true }, take: 4, orderBy: { createdAt: "asc" } });
  } catch {
    return [];
  }
}

export default async function FeaturedMenu() {
  const items = await getFeaturedItems();

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">Our Specialties</p>
          <h2 className="font-display text-4xl font-bold text-dark">Featured Dishes</h2>
        </div>
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Menu items coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">🍽️</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">{item.category}</p>
                  <h3 className="font-semibold text-dark mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <p className="font-bold text-brand-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/menu" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
