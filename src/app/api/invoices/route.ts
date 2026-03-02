import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getUserFromRequest } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { sendInvoiceEmail } from "@/lib/email";
import { sendInvoiceSMS } from "@/lib/sms";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: payload.role === "ADMIN" ? {} : { order: { userId: payload.id } },
    include: { order: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, "ADMIN");
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { orderId, amount, deposit, dueDate } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Create Stripe Payment Link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Cookfectionary Invoice #${orderId.slice(-8).toUpperCase()}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId },
  });

  const invoice = await prisma.invoice.create({
    data: {
      orderId,
      amount,
      deposit,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      stripeUrl: paymentLink.url,
      status: "SENT",
    },
    include: { order: { include: { user: true } } },
  });

  // Notify customer
  try {
    await sendInvoiceEmail(order.user.email, order.user.name, invoice.id, amount, paymentLink.url);
    if (order.user.phone) await sendInvoiceSMS(order.user.phone, amount);
  } catch (err) {
    console.error("Invoice notification error:", err);
  }

  return NextResponse.json({ invoice }, { status: 201 });
}
