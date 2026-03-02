"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Message, Conversation } from "@/types";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerMessagesPage() {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        if (d.conversation) {
          setConversation(d.conversation);
          setMessages(d.conversation.messages || []);
        }
      });
  }, [token]);

  useEffect(() => {
    if (!socket || !conversation) return;
    socket.emit("join-conversation", conversation.id);
    socket.on("new-message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { socket.off("new-message"); };
  }, [socket, conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !conversation || !token) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: conversation.id, content: input.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setInput("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-dark mb-6">Messages</h1>
      <div className="bg-white rounded-2xl border border-orange-100 flex flex-col" style={{ height: "60vh" }}>
        <div className="p-4 border-b border-gray-100">
          <p className="font-semibold text-dark text-sm">Chat with Cookfectionary</p>
          <p className="text-xs text-gray-400">We typically reply within a few hours</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No messages yet. Say hello!</p>
          )}
          {messages.map(msg => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-brand-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-brand-100" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          <button type="submit" disabled={sending || !input.trim()}
            className="bg-brand-500 text-white p-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-colors">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
