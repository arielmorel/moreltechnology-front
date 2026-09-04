"use client";

import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Laptop, Monitor, Tv, Smartphone, Cable, Cpu, LayoutGrid } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Monitor,
  Tv,
  Smartphone,
  Cable,
  Cpu,
};

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedProcessor: string;
  setSelectedProcessor: (value: string) => void;
  selectedRam: string;
  setSelectedRam: (value: string) => void;
  selectedStorage: string;
  setSelectedStorage: (value: string) => void;
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  brands: string[];
  processors: string[];
  rams: string[];
  storages: string[];
  tags: string[];
}

export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedProcessor,
  setSelectedProcessor,
  selectedRam,
  setSelectedRam,
  selectedStorage,
  setSelectedStorage,
  selectedCondition,
  setSelectedCondition,
  selectedTag,
  setSelectedTag,
  priceRange,
  setPriceRange,
  maxPrice,
  brands,
  processors,
  rams,
  storages,
  tags,
}: ProductFiltersProps) {
  return (
    <div className="space-y-7">
      {/* Category Pills */}
      <div className="space-y-3 border-t border-border/60 pt-6">
        <label className="text-[13px] font-semibold text-foreground">Categoría</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("todas")}
            className={cn(
              "rounded-lg h-9 px-4 font-medium transition-all gap-1.5",
              selectedCategory === "todas" ? "shadow-sm" : "border-border/60"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Todas
          </Button>
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-lg h-9 px-4 font-medium transition-all gap-1.5",
                  selectedCategory === cat.id ? "shadow-sm" : "border-border/60"
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-3 border-t border-border/60 pt-6">
        <label className="text-[13px] font-semibold text-foreground">Marca</label>
        <Select value={selectedBrand} onValueChange={(val) => setSelectedBrand(val || "todas")}>
          <SelectTrigger className="h-11 rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl">
            <SelectItem value="todas">Todas las marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 border-t border-border/60 pt-6">
        <label className="text-[13px] font-semibold text-foreground">Especificaciones</label>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Procesador</label>
            <Select value={selectedProcessor} onValueChange={(val) => setSelectedProcessor(val || "todas")}>
              <SelectTrigger className="h-11 w-full rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
                <SelectValue placeholder="Todos los procesadores" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="todas">Todos los procesadores</SelectItem>
                {processors.map((processor) => (
                  <SelectItem key={processor} value={processor}>{processor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Memoria RAM</label>
            <Select value={selectedRam} onValueChange={(val) => setSelectedRam(val || "todas")}>
              <SelectTrigger className="h-11 w-full rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
                <SelectValue placeholder="Toda la memoria RAM" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="todas">Toda la memoria RAM</SelectItem>
                {rams.map((ram) => (
                  <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Almacenamiento</label>
            <Select value={selectedStorage} onValueChange={(val) => setSelectedStorage(val || "todas")}>
              <SelectTrigger className="h-11 w-full rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
                <SelectValue placeholder="Todo el almacenamiento" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-xl">
                <SelectItem value="todas">Todo el almacenamiento</SelectItem>
                {storages.map((storage) => (
                  <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Precio</label>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
            RD$ {priceRange[0].toLocaleString("es-DO")} - RD$ {priceRange[1].toLocaleString("es-DO")}
          </span>
        </div>
        <div className="px-2">
          <Slider
            value={priceRange}
            min={0}
            max={maxPrice}
            step={1000}
            onValueChange={(val) => setPriceRange(val as number[])}
            className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mín</label>
            <Input
              type="number"
              min={0}
              max={priceRange[1]}
              step={1000}
              value={priceRange[0]}
              onChange={(e) => {
                const val = Math.max(0, Math.min(Number(e.target.value), priceRange[1]));
                setPriceRange([val, priceRange[1]]);
              }}
              className="h-9 rounded-lg border-border/60 bg-background text-sm font-medium tabular-nums"
            />
          </div>
          <span className="mt-5 text-muted-foreground text-xs">—</span>
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Máx</label>
            <Input
              type="number"
              min={priceRange[0]}
              max={maxPrice}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Math.min(maxPrice, Math.max(Number(e.target.value), priceRange[0]));
                setPriceRange([priceRange[0], val]);
              }}
              className="h-9 rounded-lg border-border/60 bg-background text-sm font-medium tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Condition & Tags */}
      <div className="grid grid-cols-1 gap-6 border-t border-border/60 pt-6">
        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-foreground">Estado</label>
          <Select value={selectedCondition} onValueChange={(val) => setSelectedCondition(val || "todas")}>
            <SelectTrigger className="h-11 rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
              <SelectValue placeholder="Cualquier estado" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl">
              <SelectItem value="todas">Cualquier estado</SelectItem>
              <SelectItem value="Nuevo">Equipos Nuevos</SelectItem>
              <SelectItem value="Usado">Equipos Usados (A+/A/B)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Especialidad / Uso</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "todas" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("todas")}
              className={cn(
                  "rounded-full h-8 px-4 text-xs font-medium transition-all",
                  selectedTag === "todas" ? "bg-primary text-primary-foreground shadow-sm" : "border-border/60 text-muted-foreground"
              )}
            >
              Todos los usos
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "rounded-full h-8 px-4 text-xs font-medium transition-all",
                  selectedTag === tag ? "bg-primary text-primary-foreground shadow-sm" : "border-border/60 text-muted-foreground"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
