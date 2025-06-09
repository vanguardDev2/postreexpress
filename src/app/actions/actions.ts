"use server";

import { prisma } from "@/lib/prisma";

export async function getPostres(searchParams?: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    const search = (searchParams?.search as string) || "";
    const size = (searchParams?.size as string) || "";
    const minPrice = parseFloat((searchParams?.minPrice as string) || "10000");
    const maxPrice = parseFloat((searchParams?.maxPrice as string) || "50000");
    const ingredientesParam = (searchParams?.ingredientes as string) || "";

    const selectedIngredientesIds = ingredientesParam
      ? ingredientesParam.split(",").map((id) => parseInt(id, 10))
      : [];

    const allPostres = await prisma.postre.findMany({
      include: {
        ingredients: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return allPostres.filter((postre) => {
      if (search && !postre.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (size && postre.size !== size) {
        return false;
      }

      if (postre.price < minPrice || postre.price > maxPrice) {
        return false;
      }

      if (selectedIngredientesIds.length > 0) {
        const hasSelectedIngrediente = postre.ingredients.some(
          (ingredienteId) => selectedIngredientesIds.includes(ingredienteId.id)
        );

        if (!hasSelectedIngrediente) {
          return false;
        }
      }

      return true;
    });
  } catch (error) {
    console.error("Error fetching postres:", error);
    return [];
  }
}

export async function getIngredientes() {
  return prisma.ingrediente.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getFavoritos(userId: string) {
  try {
    const favoritos = await prisma.favorito.findMany({
      where: {
        userId: userId,
      },
      include: {
        postre: {
            include: {
                ingredients: true,
            }
        },
      },
    });

    return favoritos
  } catch (error) {
    console.error("Error fetching favoritos:", error);
    return [];
  }
}

export const isFavorite = async (postreId: number, userId: string) => {
  try {
    const favorito = await prisma.favorito.findFirst({
      where: {
        postreId: postreId,
        userId: userId,
      },
    });
    return !!favorito;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export async function deleteFavorite(postreId: number, userId: string) {
  try {
    const favorito = await prisma.favorito.findFirst({
      where: {
        postreId: postreId,
        userId: userId,
      },
    });

    if (!favorito) {
      return { success: false, error: "Favorito no encontrado" };
    }

    await prisma.favorito.delete({
      where: {
        id: favorito.id,
      },
    });

    return { success: true };
  }
    catch (error) {
        console.error("Error deleting favorite:", error);
        return { success: false, error: "No se pudo eliminar el favorito" };
    }
}


export async function addToFavorites(postreId: number, userId: string) {
  try {
    const postre = await prisma.postre.findUnique({
      where: { id: postreId },
    });
    if (!postre) {
      return { success: false, error: "Postre no encontrado" };
    }
    

    console.log("isfavorite", isFavorite);
    
    await prisma.favorito.create({
      data: {
        postreId: postre.id,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, error: "No se pudo agregar a favoritos" };
  }
}

export async function addToCart(productId: number) {}


export async function toggleFavorite(postreId: number, userId: string) {
  try {
    // Check if the favorite already exists
    const isFav = await isFavorite(postreId, userId);
    
    if (isFav) {
      // If it exists, delete it
      await deleteFavorite(postreId, userId);
      return { added: false, removed: true };
    } else {
      // If it doesn't exist, add it
      await addToFavorites(postreId, userId);
      return { added: true, removed: false };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}
