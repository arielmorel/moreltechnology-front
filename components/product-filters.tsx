"use client";

import { useMemo } from "react";
import { categories } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  brands: string[];
  tags: string[];
  clearFilters: () => void;
  activeFiltersCount: number;
}

export function ProductFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedCondition,
  setSelectedCondition,
  selectedTag,
  setSelectedTag,
  priceRange,
  setPriceRange,
  maxPrice,
  brands,
  tags,
  clearFilters,
  activeFiltersCount,
}: ProductFiltersProps) {
  return (
    <div className="space-y-10">
      {/* Active Filters Summary & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20">
              {activeFiltersCount}
            </div>
            <span className="text-sm font-bold">Filtros activos</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 gap-2 h-8 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            LIMPIAR TODO
          </Button>
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-primary" />
          Buscador
        </label>
        <div className="relative group">
          <Input
            placeholder="Buscar por modelo, i5, ram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 pr-12 rounded-2xl border-border/50 bg-card shadow-sm focus:ring-primary focus:border-primary transition-all group-hover:border-primary/30"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Categoría</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("todas")}
            className={cn(
              "rounded-xl h-10 px-5 font-bold transition-all",
              selectedCategory === "todas" ? "shadow-lg shadow-primary/20" : "border-border/50"
            )}
          >
            Todas
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-xl h-10 px-5 font-bold transition-all",
                selectedCategory === cat.id ? "shadow-lg shadow-primary/20" : "border-border/50"
              )}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Marca</label>
        <Select value={selectedBrand} onValueChange={(val) => setSelectedBrand(val || "todas")}>
          <SelectTrigger className="h-12 rounded-xl border-border/50 bg-card hover:border-primary/30 transition-all font-medium">
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

      {/* Price Range Slider */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Presupuesto</label>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
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
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
          <span>Min: $0</span>
          <span>Max: ${maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Condition & Tags */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Estado</label>
          <Select value={selectedCondition} onValueChange={(val) => setSelectedCondition(val || "todas")}>
            <SelectTrigger className="h-12 rounded-xl border-border/50 bg-card hover:border-primary/30 transition-all font-medium">
              <SelectValue placeholder="Cualquier estado" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl">
              <SelectItem value="todas">Cualquier estado</SelectItem>
              <SelectItem value="Nuevo">Equipos Nuevos</SelectItem>
              <SelectItem value="Usado">Equipos Usados (A+/A/B)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Especialidad / Uso</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "todas" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("todas")}
              className={cn(
                "rounded-full h-8 px-4 text-[11px] font-black uppercase tracking-wider transition-all",
                selectedTag === "todas" ? "bg-primary text-primary-foreground shadow-md" : "border-border/50 text-muted-foreground"
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
                  "rounded-full h-8 px-4 text-[11px] font-black uppercase tracking-wider transition-all",
                  selectedTag === tag ? "bg-primary text-primary-foreground shadow-md" : "border-border/50 text-muted-foreground"
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
