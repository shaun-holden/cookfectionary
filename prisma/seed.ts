import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cookfectionary.com" },
    update: {},
    create: {
      email: "admin@cookfectionary.com",
      password: adminPassword,
      name: "Cookfectionary Admin",
      phone: "+1234567890",
      role: Role.ADMIN,
    },
  });

  // Customer
  const custPassword = await bcrypt.hash("customer123", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@cookfectionary.com" },
    update: {},
    create: {
      email: "customer@cookfectionary.com",
      password: custPassword,
      name: "Jane Smith",
      phone: "+1987654321",
      role: Role.CUSTOMER,
    },
  });

  // Menu Items
  const menuItems = [
    { name: "Jerk Chicken Platter", description: "Slow-marinated jerk chicken with festival and rice & peas", price: 22, category: "Mains" },
    { name: "Oxtail Stew", description: "Tender oxtail braised in rich Jamaican spices", price: 28, category: "Mains" },
    { name: "Curry Goat", description: "Slow-cooked goat in fragrant curry sauce", price: 26, category: "Mains" },
    { name: "Ackee & Saltfish", description: "Jamaica's national dish with sautéed peppers and onions", price: 20, category: "Mains" },
    { name: "Brown Stew Fish", description: "Pan-fried fish in savory brown stew sauce", price: 24, category: "Mains" },
    { name: "Rice & Peas", description: "Coconut-infused rice cooked with kidney beans", price: 6, category: "Sides" },
    { name: "Festival", description: "Sweet fried dough — the perfect Caribbean side", price: 4, category: "Sides" },
    { name: "Plantain", description: "Fried sweet plantain slices", price: 5, category: "Sides" },
    { name: "Coleslaw", description: "Creamy homemade coleslaw", price: 4, category: "Sides" },
    { name: "Callaloo", description: "Sautéed Caribbean greens with scotch bonnet", price: 6, category: "Sides" },
    { name: "Rum Cake", description: "Moist Jamaican rum cake with raisins and spices", price: 8, category: "Desserts" },
    { name: "Bread Pudding", description: "Warm bread pudding with vanilla sauce", price: 7, category: "Desserts" },
    { name: "Sorrel Drink", description: "Refreshing hibiscus drink with ginger and spice", price: 5, category: "Drinks" },
    { name: "Lemonade", description: "Fresh-squeezed lemonade", price: 4, category: "Drinks" },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: item.name.toLowerCase().replace(/\s+/g, "-"), ...item },
    });
  }

  // Sample Gallery Images
  const galleryImages = [
    { title: "Wedding Buffet", description: "Elegant full buffet setup for a garden wedding", category: "Events", imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800" },
    { title: "Jerk Station", description: "Live jerk cooking station at corporate event", category: "Events", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
    { title: "Dessert Table", description: "Custom dessert spread with rum cakes and pastries", category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800" },
    { title: "Catering Setup", description: "Professional outdoor catering setup", category: "Setup", imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800" },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }

  // Sample Conversation + Messages
  const conversation = await prisma.conversation.create({
    data: { customerId: customer.id },
  });
  await prisma.message.createMany({
    data: [
      { conversationId: conversation.id, senderId: customer.id, content: "Hi! I'm interested in catering for my daughter's birthday party for 50 guests.", read: true },
      { conversationId: conversation.id, senderId: admin.id, content: "Hello Jane! We'd love to help make that celebration special. What date are you considering?", read: true },
      { conversationId: conversation.id, senderId: customer.id, content: "We're looking at March 15th. Can you do a Jamaican theme?", read: false },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("Admin: admin@cookfectionary.com / admin123");
  console.log("Customer: customer@cookfectionary.com / customer123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
