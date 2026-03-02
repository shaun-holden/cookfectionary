import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cookfectionary — Where Every Bite Tells a Story",
  description: "Premium catering for weddings, corporate events, parties, and more. Authentic Caribbean and soul food catering.",
  openGraph: {
    title: "Cookfectionary",
    description: "Premium catering services — Where Every Bite Tells a Story",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              {children}
              <Toaster position="top-right" toastOptions={{ style: { background: "#1a1209", color: "#fff" } }} />
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
