"use client";

import { useCarrito } from "@/app/hooks/useCarrito";
import { Badge } from "@/components/ui/badge";


export default function CarritoSummary() {
  const { totalItems, totalPrice } = useCarrito();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Badge className="bg-pink-500">{totalItems}</Badge>
          <span className="text-sm font-medium">items en carrito</span>
        </div>
        <div className="text-lg font-bold text-pink-600">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
