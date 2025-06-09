"use client";

import { getIngredientes } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Ingrediente, tamanosDisponibles } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function FiltersPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedSize, setSelectedSize] = useState(
    searchParams.get("size") || ""
  );
  const [priceRange, setPriceRange] = useState([
    parseFloat(searchParams.get("minPrice") || "0"),
    parseFloat(searchParams.get("maxPrice") || "20"),
  ]);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<number[]>(
    searchParams.get("ingredientes")
      ? searchParams
          .get("ingredientes")!
          .split(",")
          .map((id) => parseInt(id, 10))
      : []
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchIngredientes = async () => {
      const data = await getIngredientes();
      setIngredientes(data);
    };

    fetchIngredientes();
  }, []);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (selectedSize) params.set("size", selectedSize);

      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());

      if (selectedIngredientes.length > 0) {
        params.set("ingredientes", selectedIngredientes.join(","));
      }

      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSize("");
    setPriceRange([0, 20]);
    setSelectedIngredientes([]);
    router.push("/");
  };

  const toggleIngrediente = (id: number) => {
    setSelectedIngredientes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Filtros</h3>
        <button
          className="md:hidden text-gray-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
        </button>
      </div>

      <div className={`space-y-6 ${isOpen || "hidden md:block"}`}>
        {/* Búsqueda */}
        <div>
          <Label htmlFor="search">Buscar</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Buscar postres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Tamaño */}
        <div>
          <Label>Tamaño</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {tamanosDisponibles.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={
                  selectedSize === size ? "bg-pink-500 hover:bg-pink-600" : ""
                }
                onClick={() =>
                  setSelectedSize(size === selectedSize ? "" : size)
                }
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Rango de precio */}
        <div>
          <div className="flex justify-between">
            <Label>Precio</Label>
            <span className="text-sm text-gray-500">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 20]}
            min={5000}
            max={60000}
            step={0.5}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-2"
          />
        </div>

        {/* Ingredientes */}
        <div>
          <Label>Ingredientes</Label>
          <div className="space-y-2 mt-1 max-h-40 overflow-y-auto pr-2">
            {ingredientes.map((ingrediente) => (
              <div key={ingrediente.id} className="flex items-center">
                <Checkbox
                  id={`ingrediente-${ingrediente.id}`}
                  checked={selectedIngredientes.includes(ingrediente.id)}
                  onCheckedChange={() => toggleIngrediente(ingrediente.id)}
                />
                <label
                  htmlFor={`ingrediente-${ingrediente.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {ingrediente.name} (+${ingrediente.price.toFixed(2)})
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Limpiar
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            disabled={isPending}
          >
            {isPending ? "Aplicando..." : "Aplicar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
