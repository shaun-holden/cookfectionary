import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const items = await prisma.menuItem.findMany({
    where: { ...(category ? { category } : {}), available: true },
    orderBy: { category: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, "ADMIN");
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const data = await req.json();
  const item = await prisma.menuItem.create({ data });
  return NextResponse.json({ item }, { status: 201 });
}
