const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Make io available to API routes
  global.io = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("join-admin", () => {
      socket.join("admin-room");
    });

    socket.on("join-user", (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on("send-message", (data) => {
      io.to(`conversation:${data.conversationId}`).emit("new-message", data);
      io.to("admin-room").emit("new-message", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
