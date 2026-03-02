import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getUserFromRequest } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderConfirmationSMS } from "@/lib/sms";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = payload.role === "ADMIN" ? {} : { userId: payload.id };
  const orders = await prisma.order.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true, phone: true } }, items: { include: { menuItem: true } }, invoice: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, eventDate, eventType, guestCount, notes } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "No items in order" }, { status: 400 });

  // Calculate total
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: items.map((i: { menuItemId: string }) => i.menuItemId) } } });
  const total = items.reduce((sum: number, item: { menuItemId: string; quantity: number }) => {
    const menu = menuItems.find((m) => m.id === item.menuItemId);
    return sum + (menu?.price || 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: payload.id,
      total,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      eventType,
      guestCount,
      notes,
      items: {
        create: items.map((item: { menuItemId: string; quantity: number; notes?: string }) => {
          const menu = menuItems.find((m) => m.id === item.menuItemId);
          return { menuItemId: item.menuItemId, quantity: item.quantity, price: menu?.price || 0, notes: item.notes };
        }),
      },
    },
    include: { user: true, items: { include: { menuItem: true } } },
  });

  // Notify
  try {
    await sendOrderConfirmationEmail(order.user.email, order.user.name, order.id, order.total);
    if (order.user.phone) await sendOrderConfirmationSMS(order.user.phone, order.id);
  } catch (err) {
    console.error("Notification error:", err);
  }

  // Notify admin via Socket.IO
  const io = (global as { io?: { to: (room: string) => { emit: (event: string, data: unknown) => void } } }).io;
  if (io) io.to("admin-room").emit("new-order", order);

  return NextResponse.json({ order }, { status: 201 });
}
