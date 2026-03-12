"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  option_id: number;
  name: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: CartItem) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Очистка корзины
  const clearCart = () => {
    setItems([]);
  };

  // Добавление товара
  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, item];
    });
  };

  // Увеличение количества
  const increase = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  // Уменьшение количества
  const decrease = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        increase,
        decrease,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}