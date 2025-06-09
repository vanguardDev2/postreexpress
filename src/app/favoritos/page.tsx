"use client";
import PostreDetailModal from "@/components/postre-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import CarritoSheet from "@/components/carrito-sheet";
import { authClient } from "@/lib/auth-client";
import { Favorito, Postre } from "@/lib/utils";
import {
  ArrowLeft,
  Cake,
  Heart,
  Loader2,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteFavorite, getFavoritos } from "../actions/actions";
import { useCarrito } from "../hooks/useCarrito";

const { data: session } = await authClient.getSession();

export default function FavoritosPage() {
  const { addToCart } = useCarrito();
  const [selectedPostre, setSelectedPostre] = useState<Postre | null>(null);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await getFavoritos(session?.user?.id || "");
        setFavoritos(response);
      } catch (error) {
        console.error("Error fetching favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritos();
  }, [session?.user?.id]);

  const totalFavoritos = favoritos.length;

  const handleRemoveFromFavoritos = async (postre: Postre) => {
    if (!session?.user?.id) return;

    // Store the current favorites for potential rollback
    const previousFavoritos = [...favoritos];

    // Optimistically update UI first (before API call completes)
    setFavoritos((prevFavoritos) =>
      prevFavoritos.filter((fav) => fav.postre.id !== postre.id)
    );

    try {
      // Make the API call to delete the favorite
      const result = await deleteFavorite(postre.id, session.user.id);

      // If the deletion was unsuccessful, revert to previous state
      if (!result || !result.success) {
        setFavoritos(previousFavoritos);
        console.error("Failed to remove favorite");
      }
    } catch (error) {
      // On error, revert to previous state
      setFavoritos(previousFavoritos);
      console.error("Error removing favorite:", error);
    }
  };

  const handleQuickAddToCart = (postre: Postre) => {
    addToCart(postre, postre.size, postre.ingredients);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Volver</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Cake className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Postre Express
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CarritoSheet />
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando tus favoritos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Volver</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                Postre Express
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CarritoSheet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-pink-500 fill-current" />
            <h2 className="text-3xl font-bold text-gray-800">Mis Favoritos</h2>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {totalFavoritos}
            </Badge>
          </div>
          <p className="text-gray-600">
            Tus postres favoritos guardados para cuando los necesites
          </p>
        </div>

        {favoritos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestros deliciosos postres y marca tus favoritos haciendo
              clic en el corazón
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                Explorar Postres
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritos.map((postre) => (
              <Card
                key={postre.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={postre.postre.imageUrl || "/placeholder.svg"}
                    alt={postre.postre.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleRemoveFromFavoritos(postre.postre)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors group-hover:scale-110 transform duration-200"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-5 w-5 text-pink-500 fill-current" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                      Favorito
                    </Badge>
                  </div>
                </div>

                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {postre.postre.name}
                    </h3>
                    <span className="font-bold text-pink-600 text-lg">
                      ${postre.postre.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {postre.postre.description || "Descripción no disponible"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {postre.postre.size}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {postre.postre.ingredients.length} ingredientes
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex space-x-2 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPostre(postre.postre)}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Personalizar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    onClick={() => handleQuickAddToCart(postre.postre)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" /> Añadir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {favoritos.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md inline-block">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                ¿Buscas algo más?
              </h3>
              <p className="text-gray-600 mb-4">
                Explora nuestra colección completa de postres
              </p>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-pink-500 text-pink-600 hover:bg-pink-50"
                >
                  Ver Todos los Postres
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {selectedPostre && (
        <PostreDetailModal
          postre={selectedPostre}
          onClose={() => setSelectedPostre(null)}
        />
      )}
    </div>
  );
}
