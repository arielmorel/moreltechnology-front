"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/lib/data";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterChip } from "@/components/ui/filter-chip";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { BadgePercent, SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 12;
const CATEGORY_LAPTOPS = "Laptops";
const MAX_PRICE_DEFAULT = 200000;

const USO_OPTIONS = [
  { id: "gamer", label: "Gaming", tags: ["gamer", "gaming"] },
  { id: "estudiantes", label: "Estudiantes", tags: ["estudiantes", "estudio"] },
  { id: "programacion", label: "Programación", tags: ["programacion", "developer"] },
  { id: "trabajo", label: "Trabajo", tags: ["trabajo", "oficina", "productividad"] },
  { id: "diseno", label: "Diseño", tags: ["diseno", "arquitectura", "diseño"] },
];

const USO_LABELS: Record<string, string> = USO_OPTIONS.reduce(
  (acc, uso) => ({ ...acc, [uso.id]: uso.label }),
  {}
);

const CONDITION_OPTIONS = [
  { id: "todas", label: "Cualquier estado" },
  { id: "Nuevo", label: "Equipos Nuevos" },
  { id: "Usado", label: "Equipos Usados" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Destacados" },
  { id: "price_asc", label: "Precio ↑" },
  { id: "price_desc", label: "Precio ↓" },
];

function isLaptopCategory(category: string): boolean {
  const c = category.toLowerCase();
  return c === "laptop" || c === "laptops" || c === "portatiles" || c === "port\u00e1tiles";
}

interface LaptopsClientProps {
  initialProducts: Product[];
  initialTotal: number;
}

interface FilterPanelProps {
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
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  brands: string[];
  processors: string[];
  rams: string[];
  storages: string[];
}

function LaptopsFilterPanel({
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
  priceRange,
  setPriceRange,
  maxPrice,
  brands,
  processors,
  rams,
  storages,
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      {/* Marca */}
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

      {/* Especificaciones */}
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

      {/* Precio */}
      <div className="space-y-4 border-t border-border/60 pt-6">
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

      {/* Condición */}
      <div className="space-y-3 border-t border-border/60 pt-6">
        <label className="text-[13px] font-semibold text-foreground">Estado</label>
        <Select value={selectedCondition} onValueChange={(val) => setSelectedCondition(val || "todas")}>
          <SelectTrigger className="h-11 rounded-lg border-border/60 bg-background hover:border-primary/30 transition-all font-medium">
            <SelectValue placeholder="Cualquier estado" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl">
            {CONDITION_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function LaptopsClient({ initialProducts, initialTotal }: LaptopsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState<number>(initialTotal);
  const pageRef = useRef(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string>("todas");
  const [selectedUso, setSelectedUso] = useState<string>("todas");
  const [selectedProcessor, setSelectedProcessor] = useState<string>("todas");
  const [selectedRam, setSelectedRam] = useState<string>("todas");
  const [selectedStorage, setSelectedStorage] = useState<string>("todas");
  const [selectedCondition, setSelectedCondition] = useState<string>("todas");
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE_DEFAULT]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const brands = useMemo(
    () => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(),
    [products]
  );

  const processors = useMemo(
    () => Array.from(new Set(products.map(p => p.processor).filter(Boolean))).sort(),
    [products]
  );

  const rams = useMemo(
    () => Array.from(new Set(products.map(p => p.ram).filter(Boolean))).sort(),
    [products]
  );

  const storages = useMemo(
    () => Array.from(new Set(products.map(p => p.ssd).filter(Boolean))).sort(),
    [products]
  );

  const maxPrice = useMemo(() => {
    if (products.length === 0) return MAX_PRICE_DEFAULT;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesBrand = selectedBrand === "todas" || product.brand === selectedBrand;
      const matchesProcessor = selectedProcessor === "todas" || product.processor === selectedProcessor;
      const matchesRam = selectedRam === "todas" || product.ram === selectedRam;
      const matchesStorage = selectedStorage === "todas" || product.ssd === selectedStorage;
      const matchesOffers = !showOnlyOffers || Boolean(product.originalPrice && product.originalPrice > product.price);
      const matchesUso = selectedUso === "todas" || USO_OPTIONS.some(
        uso => uso.id === selectedUso && uso.tags.some(tag => product.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
      );
      const matchesCondition = selectedCondition === "todas" ||
        (selectedCondition === "Nuevo" && product.condition === "Nuevo") ||
        (selectedCondition === "Usado" && product.condition.includes("Usado"));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesBrand && matchesProcessor && matchesRam && matchesStorage && matchesOffers && matchesUso && matchesCondition && matchesPrice;
    });
  }, [products, selectedBrand, selectedProcessor, selectedRam, selectedStorage, showOnlyOffers, selectedUso, selectedCondition, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const hasMore = products.length < total;

  const loadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    try {
      const result = await getProducts(nextPage, PAGE_SIZE, CATEGORY_LAPTOPS);
      const next = result.products.filter(p => isLaptopCategory(p.category));
      setProducts(prev => [...prev, ...next]);
      setTotal(result.total);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Sync filters to the URL so filtered views are shareable (client-side).
  useEffect(() => {
    const params = new URLSearchParams();
    if (showOnlyOffers) params.set("oferta", "true");
    if (selectedUso !== "todas") params.set("uso", selectedUso);
    if (selectedBrand !== "todas") params.set("marca", selectedBrand);
    if (selectedProcessor !== "todas") params.set("procesador", selectedProcessor);
    if (selectedRam !== "todas") params.set("ram", selectedRam);
    if (selectedStorage !== "todas") params.set("almacenamiento", selectedStorage);
    if (selectedCondition !== "todas") params.set("estado", selectedCondition);
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE_DEFAULT) {
      params.set("min", priceRange[0].toString());
      params.set("max", priceRange[1].toString());
    }
    if (sortBy !== "newest") params.set("orden", sortBy);
    const queryString = params.toString();
    const newUrl = `/laptops${queryString ? `?${queryString}` : ""}`;
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [showOnlyOffers, selectedUso, selectedBrand, selectedProcessor, selectedRam, selectedStorage, selectedCondition, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedBrand("todas");
    setSelectedUso("todas");
    setSelectedProcessor("todas");
    setSelectedRam("todas");
    setSelectedStorage("todas");
    setSelectedCondition("todas");
    setShowOnlyOffers(false);
    setPriceRange([0, MAX_PRICE_DEFAULT]);
    setSortBy("newest");
  };

  const activeFiltersCount = (selectedBrand !== "todas" ? 1 : 0) +
    (selectedUso !== "todas" ? 1 : 0) +
    (selectedProcessor !== "todas" ? 1 : 0) +
    (selectedRam !== "todas" ? 1 : 0) +
    (selectedStorage !== "todas" ? 1 : 0) +
    (selectedCondition !== "todas" ? 1 : 0) +
    (showOnlyOffers ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE_DEFAULT ? 1 : 0);

  const appliedFilters = [
    showOnlyOffers ? { label: "Ofertas", remove: () => setShowOnlyOffers(false) } : null,
    selectedUso !== "todas" ? { label: `Uso: ${USO_LABELS[selectedUso] || selectedUso}`, remove: () => setSelectedUso("todas") } : null,
    selectedBrand !== "todas" ? { label: `Marca: ${selectedBrand}`, remove: () => setSelectedBrand("todas") } : null,
    selectedProcessor !== "todas" ? { label: `Procesador: ${selectedProcessor}`, remove: () => setSelectedProcessor("todas") } : null,
    selectedRam !== "todas" ? { label: `RAM: ${selectedRam}`, remove: () => setSelectedRam("todas") } : null,
    selectedStorage !== "todas" ? { label: `Almacenamiento: ${selectedStorage}`, remove: () => setSelectedStorage("todas") } : null,
    selectedCondition !== "todas" ? { label: `Estado: ${selectedCondition}`, remove: () => setSelectedCondition("todas") } : null,
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE_DEFAULT
      ? { label: `RD$ ${priceRange[0].toLocaleString("es-DO")} - RD$ ${priceRange[1].toLocaleString("es-DO")}`, remove: () => setPriceRange([0, MAX_PRICE_DEFAULT]) }
      : null,
  ].filter((filter): filter is { label: string; remove: () => void } => filter !== null);

  const filterPanel = (
    <LaptopsFilterPanel
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      selectedProcessor={selectedProcessor}
      setSelectedProcessor={setSelectedProcessor}
      selectedRam={selectedRam}
      setSelectedRam={setSelectedRam}
      selectedStorage={selectedStorage}
      setSelectedStorage={setSelectedStorage}
      selectedCondition={selectedCondition}
      setSelectedCondition={setSelectedCondition}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      maxPrice={maxPrice}
      brands={brands}
      processors={processors}
      rams={rams}
      storages={storages}
    />
  );

  return (
    <section className="py-14 lg:py-16 w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Header + count */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Laptops disponibles en <span className="text-primary">Santo Domingo</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {filteredProducts.length > 0
                ? `${filteredProducts.length} equipo${filteredProducts.length > 1 ? "s" : ""} encontrado${filteredProducts.length > 1 ? "s" : ""} de ${total}`
                : "Ajusta los filtros o consulta disponibilidad por WhatsApp"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={activeFiltersCount === 0}
            className="h-10 rounded-xl text-sm border-border/60"
          >
            <X className="w-4 h-4 mr-1.5" />
            Limpiar filtros
          </Button>
        </div>

        {/* Quick chips row */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 mb-4">
          <FilterChip active={showOnlyOffers} onClick={() => setShowOnlyOffers(!showOnlyOffers)}>
            <BadgePercent className="w-3 h-3" />
            Ofertas
          </FilterChip>

          {USO_OPTIONS.map(uso => (
            <FilterChip
              key={uso.id}
              active={selectedUso === uso.id}
              onClick={() => setSelectedUso(selectedUso === uso.id ? "todas" : uso.id)}
            >
              {uso.label}
            </FilterChip>
          ))}

          <span className="w-px bg-border self-stretch my-1 shrink-0" aria-hidden="true" />

          {SORT_OPTIONS.map(option => (
            <FilterChip
              key={option.id}
              active={sortBy === option.id}
              onClick={() => setSortBy(option.id)}
            >
              {option.label}
            </FilterChip>
          ))}

          {/* Mobile filters trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-8 px-3 gap-1.5 rounded-full text-xs font-medium bg-card border-border shrink-0"
                  />
                }
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="h-4 w-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="text-lg font-bold flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
                  {filterPanel}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active filters */}
        {appliedFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {appliedFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={filter.remove}
                className="inline-flex shrink-0 items-center gap-1 bg-muted text-muted-foreground text-[11px] px-2.5 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <span className="truncate max-w-[120px]">{filter.label}</span>
                <X className="h-3 w-3 shrink-0" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 bg-card/80 border border-border/60 rounded-2xl p-5 shadow-sm">
              {filterPanel}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore ? (
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="h-12 px-8 rounded-xl font-semibold"
                    >
                      {isLoadingMore ? "Cargando..." : "Cargar más equipos"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Has visto todos los equipos disponibles en stock.
                  </p>
                )}

                {isLoadingMore && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 pt-4">
                    {[...Array(3)].map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <SlidersHorizontal className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">No encontramos equipos</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  No hay laptops con los filtros seleccionados. Prueba limpiar los filtros o consúltanos por WhatsApp.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button onClick={clearFilters} className="px-4 py-2 rounded-lg text-sm">
                    Limpiar filtros
                  </Button>
                  <WhatsAppDropdown
                    message="Hola, estoy buscando una laptop. ¿Qué tienen disponible?"
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Consultar por WhatsApp
                  </WhatsAppDropdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}