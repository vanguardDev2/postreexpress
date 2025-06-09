"use client";

import { useCarrito } from "@/app/hooks/useCarrito";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CarritoSheet() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCarrito();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    // Aquí iría la lógica para proceder al checkout
    console.log("Proceder al checkout con items:", items);
    alert("Funcionalidad de checkout próximamente!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ShoppingCart className="h-6 w-6 text-gray-600" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-pink-500 hover:bg-pink-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col px-4">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-left flex items-center justify-between">
            <span>Mi Carrito</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Vaciar
              </Button>
            )}
          </SheetTitle>
          {totalItems > 0 && (
            <p className="text-sm text-gray-600">
              {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu
              carrito
            </p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega algunos postres deliciosos para comenzar
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              Explorar Postres
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.postre.imageUrl || "/placeholder.svg"}
                        alt={item.postre.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.postre.name}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.size}
                            </Badge>
                            {item.ingredients.length > 0 && (
                              <span className="text-xs text-gray-500">
                                +{item.ingredients.length} ingredientes
                              </span>
                            )}
                          </div>
                          {item.ingredients.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {item.ingredients
                                  .map((ing) => ing.name)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${item.totalPrice.toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ${(item.totalPrice / item.quantity).toFixed(2)}{" "}
                              c/u
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span className="text-pink-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 h-12"
                >
                  Proceder al Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Envío gratis en pedidos mayores a $25
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
