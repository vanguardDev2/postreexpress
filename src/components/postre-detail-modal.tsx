
import { getIngredientes } from "@/app/actions/actions";
import { useCarrito } from "@/app/hooks/useCarrito";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ingrediente, Postre, tamanosDisponibles } from "@/lib/utils";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PostreDetailModalProps {
  postre: Postre;
  onClose: () => void;
}

export default function PostreDetailModal({
  postre,
  onClose,
}: PostreDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState(postre.size);
  const [selectedIngredientes, setSelectedIngredientes] = useState<
    Ingrediente[]
  >(postre.ingredients);
  const [allIngredientes, setAllIngredientes] = useState<Ingrediente[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCarrito();

  // Calcular precio total basado en tamaño y ingredientes
  const calculateTotalPrice = () => {
    let basePrice = postre.price;

    // Ajustar precio por tamaño
    if (selectedSize === "Pequeño") basePrice *= 0.8;
    if (selectedSize === "Grande") basePrice *= 1.2;
    if (selectedSize === "Extra Grande") basePrice *= 1.5;

    // Sumar precio de ingredientes adicionales
    const ingredientesPrice = selectedIngredientes.reduce(
      (sum, ing) => sum + ing.price,
      0
    );

    return (basePrice + ingredientesPrice) * quantity;
  };

  useEffect(() => {
    const fetchIngredientes = async () => {
      const data = await getIngredientes();
      setAllIngredientes(data);
    };

    fetchIngredientes();
  }, []);

  const handleAddToCart = () => {
    addToCart(postre, selectedSize, selectedIngredientes, quantity);
    onClose();
  };

  const toggleIngrediente = (ingrediente: Ingrediente) => {
    setSelectedIngredientes((prev) => {
      const exists = prev.some((ing) => ing.id === ingrediente.id);

      if (exists) {
        return prev.filter((ing) => ing.id !== ingrediente.id);
      } else {
        return [...prev, ingrediente];
      }
    });
  };

  const isIngredienteSelected = (id: number) => {
    return selectedIngredientes.some((ing) => ing.id === id);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {postre.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={postre.imageUrl || "/placeholder.svg"}
              alt={postre.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{postre.description}</p>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Selecciona el tamaño:
              </h4>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="grid grid-cols-2 gap-2"
              >
                {tamanosDisponibles.map((size: any) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={`size-${size}`} />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Ingredientes:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {allIngredientes.map((ingrediente) => (
                  <div key={ingrediente.id} className="flex items-center">
                    <Checkbox
                      id={`modal-ingrediente-${ingrediente.id}`}
                      checked={isIngredienteSelected(ingrediente.id)}
                      onCheckedChange={() => toggleIngrediente(ingrediente)}
                    />
                    <label
                      htmlFor={`modal-ingrediente-${ingrediente.id}`}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {ingrediente.name} (+${ingrediente.price.toFixed(2)})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Cantidad:</h4>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <div className="text-xl font-bold text-pink-600">
            Total: ${calculateTotalPrice().toFixed(2)}
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            Añadir al Carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
