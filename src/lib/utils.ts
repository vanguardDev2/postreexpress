import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const tamanosDisponibles = ["Pequeño", "Mediano", "Grande", "Extra Grande"]

export type Favorito = Prisma.FavoritoGetPayload<{
    include: {
        postre: {
          include: {
            ingredients: true;
          }
        };
    };        

}>;

export type Postre = Prisma.PostreGetPayload<{
    include: {
        ingredients: true;
    };
}>;
export type Ingrediente = Prisma.IngredienteGetPayload<{
   
}>;