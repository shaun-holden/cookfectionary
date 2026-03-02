import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } }, items: { include: { menuItem: true } }, invoice: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (payload.role !== "ADMIN" && order.userId !== payload.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, "ADMIN");
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const data = await req.json();
  const order = await prisma.order.update({ where: { id }, data, include: { user: true, items: { include: { menuItem: true } }, invoice: true } });
  return NextResponse.json({ order });
}
