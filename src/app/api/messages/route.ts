import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, requireAuth } from "@/lib/auth";
import { sendNewMessageEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.role === "ADMIN") {
    const conversations = await prisma.conversation.findMany({
      include: { customer: { select: { id: true, name: true, email: true } }, messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } } },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ conversations });
  }

  let conversation = await prisma.conversation.findFirst({
    where: { customerId: payload.id },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } } },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { customerId: payload.id },
      include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } } },
    });
  }

  return NextResponse.json({ conversation });
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const message = await prisma.message.create({
    data: { conversationId, senderId: payload.id, content },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  // Update conversation timestamp
  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

  // Emit socket event
  const io = (global as { io?: { to: (room: string) => { emit: (event: string, data: unknown) => void } } }).io;
  if (io) {
    io.to(`conversation:${conversationId}`).emit("new-message", message);
    io.to("admin-room").emit("new-message", message);
  }

  // Email notification to the other party
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true },
    });
    if (conversation) {
      if (payload.role === "ADMIN") {
        // Admin replied — notify customer
        await sendNewMessageEmail(conversation.customer.email, conversation.customer.name, content.slice(0, 100));
      } else {
        // Customer sent message — notify admin
        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) await sendNewMessageEmail(admin.email, admin.name, content.slice(0, 100));
      }
    }
  } catch (err) {
    console.error("Message email error:", err);
  }

  return NextResponse.json({ message }, { status: 201 });
}
