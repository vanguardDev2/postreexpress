"use client";

import { getFavoritos, toggleFavorite } from "@/app/actions/actions";
import { useCarrito } from "@/app/hooks/useCarrito";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Postre } from "@/lib/utils";
import { Heart, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostreDetailModal from "./postre-detail-modal";

const { data } = await authClient.getSession();
interface PostresListProps {
  postres: Postre[];
}

export default function PostresList({ postres }: PostresListProps) {
  const [selectedPostre, setSelectedPostre] = useState<Postre | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [pendingFavorites, setPendingFavorites] = useState<Set<number>>(
    new Set()
  );
  const { addToCart } = useCarrito();

  // Fetch all user favorites at once
  useEffect(() => {
    const loadFavorites = async () => {
      if (!data?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const favorites = await getFavoritos(data.user.id);
        setFavoriteIds(new Set(favorites.map((fav) => fav.postre.id)));
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [data?.user?.id]);

  const handleFavoriteToggle = async (postreId: number) => {
    if (!data?.user?.id) return;

    if (pendingFavorites.has(postreId)) return;

    setPendingFavorites((prev) => {
      const updated = new Set(prev);
      updated.add(postreId);
      return updated;
    });

    setFavoriteIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(postreId)) {
        updated.delete(postreId);
      } else {
        updated.add(postreId);
      }
      return updated;
    });

    try {
      await toggleFavorite(postreId, data.user.id);
    } catch (error) {
      console.error("Error toggling favorite status:", error);

      setFavoriteIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(postreId)) {
          updated.delete(postreId);
        } else {
          updated.add(postreId);
        }
        return updated;
      });
    } finally {
      setPendingFavorites((prev) => {
        const updated = new Set(prev);
        updated.delete(postreId);
        return updated;
      });
    }
  };

  const isFavorite = (postreId: number) => favoriteIds.has(postreId);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postres.map((postre) => (
          <Card
            key={postre.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={postre.imageUrl || "/placeholder.svg"}
                alt={postre.name}
                fill
                className="object-cover"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                onClick={() => handleFavoriteToggle(postre.id)}
                disabled={isLoading || pendingFavorites.has(postre.id)}
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-300 ${
                    isFavorite(postre.id)
                      ? "text-pink-500 fill-pink-500"
                      : "text-gray-400 hover:text-pink-400"
                  } ${pendingFavorites.has(postre.id) ? "opacity-60" : ""}`}
                />
              </button>
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  {postre.name}
                </h3>
                <span className="font-bold text-pink-600">
                  ${postre.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {postre.description}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {postre.size}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {postre.ingredients.length} ingredientes
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPostre(postre)}
                className="flex-1 mr-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Personalizar
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                onClick={() =>
                  addToCart(postre, postre.size, postre.ingredients)
                }
              >
                <ShoppingCart className="h-4 w-4 mr-1" /> Añadir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {postres.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron postres con los filtros seleccionados.
          </p>
          <Button variant="link" className="mt-2 text-pink-600">
            Limpiar filtros
          </Button>
        </div>
      )}

      {selectedPostre && (
        <PostreDetailModal
          postre={selectedPostre}
          onClose={() => setSelectedPostre(null)}
        />
      )}
    </div>
  );
}
