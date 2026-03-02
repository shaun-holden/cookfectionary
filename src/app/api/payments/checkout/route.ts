import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId, amount, description } = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: description || "Catering Order" },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/dashboard/orders?success=true`,
    cancel_url: `${appUrl}/dashboard/orders?cancelled=true`,
    metadata: { orderId, userId: payload.id },
  });

  return NextResponse.json({ url: session.url });
}
