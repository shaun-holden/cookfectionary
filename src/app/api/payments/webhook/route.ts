import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string } };
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "PAID" } });
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string } };
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.invoice.updateMany({ where: { orderId }, data: { status: "PAID", paidAt: new Date() } });
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "PAID" } });
    }
  }

  return NextResponse.json({ received: true });
}
