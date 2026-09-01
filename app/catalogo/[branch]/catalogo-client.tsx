"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts, searchProducts, AvailabilityFilter } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, MapPin, Share2, Loader2, X, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { ProductFilters } from "@/components/product-filters";
import { branches } from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 6;

function getBranchLabel(branchId: string): string {
  const branch = branches.find(b => b.id === branchId);
  return branch ? branch.name.replace("Sucursal ", "") : branchId;
}

export default function CatalogoBranchClient({ branch: initialBranch }: { branch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [branch] = useState<string>(initialBranch);

  const buildShareUrl = useCallback(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams(searchParams.toString());
    return `${baseUrl}/catalogo/${branch}?${params.toString()}`;
  }, [branch, searchParams]);

  const handleShare = async () => {
    const url = buildShareUrl();
    const title = `Catálogo Morel Technology - ${getBranchLabel(branch)}`;
    const text = `Mira estos equipos disponibles en ${getBranchLabel(branch)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        await navigator.clipboard.writeText(url);
        alert("¡Enlace copiado al portapapeles!");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [selectedBrand, setSelectedBrand] = useState<string>("todas");
  const [selectedProcessor, setSelectedProcessor] = useState<string>("todas");
  const [selectedRam, setSelectedRam] = useState<string>("todas");
  const [selectedStorage, setSelectedStorage] = useState<string>("todas");
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>("todas");
  const [selectedTag, setSelectedTag] = useState<string>("todas");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [stockFilter, setStockFilter] = useState<AvailabilityFilter>("IN_STOCK");

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const pageRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filtersKey = `${debouncedSearch}-${selectedCategory}-${branch}-${stockFilter}`;

  const hasMore = products.length < total;

  useEffect(() => {
    pageRef.current = 0;
    let cancelled = false;
    const loadInitial = async () => {
      if (!cancelled) setIsLoading(true);
      try {
        let result;
        if (debouncedSearch.trim() === "") {
          result = await getProducts(0, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
        } else {
          result = await searchProducts(debouncedSearch, 0, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
        }
        if (!cancelled) {
          setProducts(result.products);
          setTotal(result.total);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadInitial();
    return () => { cancelled = true; };
  }, [filtersKey, debouncedSearch, selectedCategory, branch, stockFilter]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setIsLoadingMore(true);
          const loadMore = async () => {
            try {
              let result;
              if (debouncedSearch.trim() === "") {
                result = await getProducts(nextPage, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
              } else {
                result = await searchProducts(debouncedSearch, nextPage, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
              }
              setProducts(prev => [...prev, ...result.products]);
              setTotal(result.total);
            } finally {
              setIsLoadingMore(false);
            }
          };
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, debouncedSearch, selectedCategory, branch, products.length, stockFilter]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map(p => p.brand));
    return Array.from(uniqueBrands);
  }, [products]);

  const processors = useMemo(() => Array.from(new Set(products.map(p => p.processor).filter(Boolean))).sort(), [products]);

  const rams = useMemo(() => Array.from(new Set(products.map(p => p.ram).filter(Boolean))).sort(), [products]);

  const storages = useMemo(() => Array.from(new Set(products.map(p => p.ssd).filter(Boolean))).sort(), [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.processor.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = selectedBrand === "todas" || product.brand === selectedBrand;
      const matchesProcessor = selectedProcessor === "todas" || product.processor === selectedProcessor;
      const matchesRam = selectedRam === "todas" || product.ram === selectedRam;
      const matchesStorage = selectedStorage === "todas" || product.ssd === selectedStorage;
      const matchesOffers = !showOnlyOffers || Boolean(product.originalPrice && product.originalPrice > product.price);
      const matchesTag = selectedTag === "todas" || product.tags.includes(selectedTag);
      const matchesCondition = selectedCondition === "todas" ||
        (selectedCondition === "Nuevo" && product.condition === "Nuevo") ||
        (selectedCondition === "Usado" && product.condition.includes("Usado"));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesProcessor && matchesRam && matchesStorage && matchesOffers && matchesCondition && matchesPrice && matchesTag;
    });
  }, [products, search, selectedBrand, selectedProcessor, selectedRam, selectedStorage, showOnlyOffers, selectedCondition, selectedTag, priceRange]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("todas");
    setSelectedBrand("todas");
    setSelectedProcessor("todas");
    setSelectedRam("todas");
    setSelectedStorage("todas");
    setShowOnlyOffers(false);
    setSelectedCondition("todas");
    setSelectedTag("todas");
    setPriceRange([0, 200000]);
    setStockFilter("IN_STOCK");
  };

  const activeFiltersCount = (selectedCategory !== "todas" ? 1 : 0) +
    (selectedBrand !== "todas" ? 1 : 0) +
    (selectedProcessor !== "todas" ? 1 : 0) +
    (selectedRam !== "todas" ? 1 : 0) +
    (selectedStorage !== "todas" ? 1 : 0) +
    (showOnlyOffers ? 1 : 0) +
    (selectedCondition !== "todas" ? 1 : 0) +
    (selectedTag !== "todas" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0);

  const categoryLabel = categories.find(category => category.id === selectedCategory)?.name;
  const appliedFilters = [
    search.trim() ? { label: `Búsqueda: ${search}`, remove: () => setSearch("") } : null,
    selectedCategory !== "todas" ? { label: `Categoría: ${categoryLabel || selectedCategory}`, remove: () => setSelectedCategory("todas") } : null,
    selectedBrand !== "todas" ? { label: `Marca: ${selectedBrand}`, remove: () => setSelectedBrand("todas") } : null,
    selectedProcessor !== "todas" ? { label: `Procesador: ${selectedProcessor}`, remove: () => setSelectedProcessor("todas") } : null,
    selectedRam !== "todas" ? { label: `RAM: ${selectedRam}`, remove: () => setSelectedRam("todas") } : null,
    selectedStorage !== "todas" ? { label: `Almacenamiento: ${selectedStorage}`, remove: () => setSelectedStorage("todas") } : null,
    showOnlyOffers ? { label: "Solo ofertas", remove: () => setShowOnlyOffers(false) } : null,
    selectedCondition !== "todas" ? { label: `Estado: ${selectedCondition}`, remove: () => setSelectedCondition("todas") } : null,
    selectedTag !== "todas" ? { label: `Uso: ${selectedTag}`, remove: () => setSelectedTag("todas") } : null,
    priceRange[0] > 0 || priceRange[1] < 200000
      ? { label: `Precio: RD$ ${priceRange[0].toLocaleString("es-DO")} - RD$ ${priceRange[1].toLocaleString("es-DO")}`, remove: () => setPriceRange([0, 200000]) }
      : null,
  ].filter((filter): filter is { label: string; remove: () => void } => filter !== null);

  const handleBranchChange = useCallback((newBranch: string | null) => {
    if (newBranch) {
      router.push(`/catalogo/${newBranch}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen pt-16 pb-6 bg-muted/20">
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-4 md:mb-12 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-5xl font-black tracking-tight">Laptops disponibles</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Share Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="rounded-xl h-10 w-10"
              aria-label="Compartir catálogo"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex items-center">
              <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 text-primary uppercase">
                {filteredProducts.length} <span className="hidden xs:inline">Equipos</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            <div className="sticky top-28 bg-card/80 border border-border/60 rounded-2xl p-5 shadow-sm">
              <ProductFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
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
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                brands={brands}
                processors={processors}
                rams={rams}
                storages={storages}
                tags={allTags}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-4 md:space-y-8">
            <div className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm md:p-4">
              <div className="flex flex-row items-center gap-2 md:gap-4">
              {/* Branch Selector */}
              <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl border border-border/50 bg-card px-3 md:h-14">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Select value={branch} onValueChange={handleBranchChange}>
                  <SelectTrigger className="h-auto w-[120px] border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus:ring-0 focus:ring-offset-0 md:w-[150px]">
                    <SelectValue>
                      <span className="font-semibold">{getBranchLabel(branch)}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative hidden flex-1 sm:block">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar equipo..."
                  className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-border/50 bg-card shadow-sm focus:ring-primary/20 text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {isSearchExpanded ? (
                <div className="relative min-w-0 flex-1 sm:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="Buscar equipo..."
                    className="h-12 w-full rounded-xl border-border/50 bg-card pl-10 pr-10 text-sm shadow-sm focus:ring-primary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Cerrar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsSearchExpanded(true)}
                  className="h-12 w-12 shrink-0 rounded-xl border-border/50 bg-card sm:hidden"
                  aria-label="Abrir búsqueda"
                  title="Buscar"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOnlyOffers(!showOnlyOffers)}
                className={cn(
                  "h-12 shrink-0 gap-2 rounded-xl border-red-200 px-2.5 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 md:h-14 md:px-4",
                  showOnlyOffers && "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:text-white"
                )}
                aria-pressed={showOnlyOffers}
                aria-label={showOnlyOffers ? "Quitar ofertas" : "Mostrar ofertas"}
                title={showOnlyOffers ? "Quitar ofertas" : "Mostrar ofertas"}
              >
                <BadgePercent className="h-4 w-4" />
                <span className="hidden sm:inline">{showOnlyOffers ? "Quitar ofertas" : "Mostrar ofertas"}</span>
              </Button>

              {/* Stock Filter Tabs */}
              <div className="flex h-12 shrink-0 items-center rounded-xl border border-border/50 bg-card overflow-hidden md:h-14">
                {[
                  { value: "IN_STOCK" as const, label: "Disponibles" },
                  { value: "OUT_OF_STOCK" as const, label: "Agotados" },
                  { value: "ALL" as const, label: "Todos" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStockFilter(tab.value)}
                    className={cn(
                      "px-3 text-xs font-semibold transition-colors md:px-4 md:text-sm",
                      stockFilter === tab.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Mobile Filters Trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl relative bg-card border-border/50 shrink-0",
                          activeFiltersCount > 0 && "border-primary/50 text-primary"
                        )}
                      />
                    }
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-primary/20">
                        {activeFiltersCount}
                      </span>
                    )}
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                    <SheetHeader className="p-6 border-b border-border/50">
                      <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Filtros
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-6 h-[calc(100vh-100px)] overflow-y-auto">
                      <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
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
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        maxPrice={maxPrice}
                        brands={brands}
                        processors={processors}
                        rams={rams}
                        storages={storages}
                        tags={allTags}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

              {appliedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <span className="mr-1 text-xs font-semibold text-muted-foreground">Filtros:</span>
                {appliedFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={filter.remove}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    aria-label={`Quitar ${filter.label}`}
                  >
                    <span className="truncate">{filter.label}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto h-8 shrink-0 px-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Limpiar todo
                </Button>
              </div>
              )}
            </div>

            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="relative" aria-busy={isLoading}>
                  <div className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}>
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-start justify-center pt-16">
                      <div className="sticky top-28 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/95 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Actualizando productos...
                      </div>
                    </div>
                  )}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="flex justify-center py-8">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Cargando más equipos...</span>
                    </div>
                  )}
                  {!hasMore && filteredProducts.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      Has visto todos los {filteredProducts.length} equipos
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 md:py-32 bg-card rounded-3xl border border-border/50">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted/50 rounded-full mb-6">
                  <Search className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">No encontramos equipos</h2>
                <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
                  {search
                    ? `No hay resultados para "${search}". Intenta con otro término.`
                    : "No hay equipos disponibles con los filtros seleccionados."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="rounded-xl h-11 px-6 text-sm"
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    onClick={() => setSearch("")}
                    variant="ghost"
                    className="rounded-xl h-11 px-6 text-sm text-muted-foreground"
                  >
                    Borrar búsqueda
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
