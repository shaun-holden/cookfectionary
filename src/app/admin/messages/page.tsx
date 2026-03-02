"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { Conversation, Message } from "@/types";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        const convs = d.conversations || [];
        setConversations(convs);
        if (convs.length > 0) { setSelected(convs[0]); setMessages(convs[0].messages || []); }
      });
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { socket.off("new-message"); };
  }, [socket]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function selectConversation(conv: Conversation) {
    setSelected(conv);
    setMessages(conv.messages || []);
    if (socket) socket.emit("join-conversation", conv.id);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selected || !token) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: selected.id, content: input.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setInput("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-white mb-6">Messages</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl flex overflow-hidden" style={{ height: "65vh" }}>
        {/* Conversation list */}
        <div className="w-56 border-r border-gray-800 flex flex-col">
          <div className="p-3 border-b border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && <p className="text-gray-500 text-xs text-center p-4">No conversations yet.</p>}
            {conversations.map(conv => (
              <button key={conv.id} onClick={() => selectConversation(conv)}
                className={`w-full text-left p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors ${selected?.id === conv.id ? "bg-gray-800" : ""}`}>
                <p className="text-sm font-medium text-white truncate">{conv.customer?.name}</p>
                <p className="text-xs text-gray-500 truncate">{conv.messages?.[conv.messages.length - 1]?.content || "No messages"}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-gray-800">
                <p className="font-semibold text-white text-sm">{selected.customer?.name}</p>
                <p className="text-xs text-gray-500">{selected.customer?.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => {
                  const isAdmin = msg.sender?.role === "ADMIN";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isAdmin ? "bg-brand-500 text-white rounded-br-sm" : "bg-gray-800 text-gray-200 rounded-bl-sm"}`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isAdmin ? "text-brand-100" : "text-gray-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Reply..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button type="submit" disabled={sending || !input.trim()}
                  className="bg-brand-500 text-white p-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation to reply
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
