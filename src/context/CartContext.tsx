"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, MenuItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(menuItem: MenuItem, quantity = 1, notes?: string) {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { menuItem, quantity, notes }];
    });
  }

  function removeItem(menuItemId: string) {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) return removeItem(menuItemId);
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
