import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, "ADMIN");
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const data = await req.json();
  const image = await prisma.galleryImage.create({ data });
  return NextResponse.json({ image }, { status: 201 });
}
