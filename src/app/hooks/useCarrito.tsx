"use client";

import { Ingrediente, Postre } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

interface CarritoItem {
  id: string;
  postre: Postre;
  size: string;
  ingredients: Ingrediente[];
  quantity: number;
  totalPrice: number;
}

interface CarritoContextType {
  items: CarritoItem[];
  addToCart: (
    postre: Postre,
    size: string,
    ingredients: Ingrediente[],
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([]);

  const calculateItemPrice = (
    postre: Postre,
    size: string,
    ingredients: Ingrediente[],
    quantity: number
  ) => {
    let basePrice = postre.price;

    // Ajustar precio por tamaño
    if (size === "Pequeño") basePrice *= 0.8;
    if (size === "Grande") basePrice *= 1.2;
    if (size === "Extra Grande") basePrice *= 1.5;

    // Sumar precio de ingredientes
    const ingredientsPrice = ingredients.reduce(
      (sum, ing) => sum + ing.price,
      0
    );

    return (basePrice + ingredientsPrice) * quantity;
  };

  const addToCart = (
    postre: Postre,
    size: string,
    ingredients: Ingrediente[],
    quantity = 1
  ) => {
    const totalPrice = calculateItemPrice(postre, size, ingredients, quantity);

    const newItem: CarritoItem = {
      id: `${postre.id}-${Date.now()}`, // ID único
      postre,
      size,
      ingredients,
      quantity,
      totalPrice,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const totalPrice = calculateItemPrice(
            item.postre,
            item.size,
            item.ingredients,
            quantity
          );
          return { ...item, quantity, totalPrice };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
}
