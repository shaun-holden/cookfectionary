import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, "ADMIN");
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from Cloudinary if hosted there
  if (image.imageUrl.includes("cloudinary")) {
    const publicId = image.imageUrl.split("/").pop()?.split(".")[0];
    if (publicId) await cloudinary.uploader.destroy(`cookfectionary/gallery/${publicId}`);
  }

  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
