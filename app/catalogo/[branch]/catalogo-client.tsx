"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts, searchProducts, AvailabilityFilter } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
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
  const [stockCounts, setStockCounts] = useState({ available: 0, outOfStock: 0, total: 0 });
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

  // Fetch stock counts for all categories (IN_STOCK, OUT_OF_STOCK, ALL)
  useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      const categoryParam = selectedCategory !== "todas" ? selectedCategory : undefined;
      try {
        const [available, outOfStock, all] = await Promise.all([
          getProducts(0, 1, categoryParam, branch, undefined, "IN_STOCK"),
          getProducts(0, 1, categoryParam, branch, undefined, "OUT_OF_STOCK"),
          getProducts(0, 1, categoryParam, branch, undefined, "ALL"),
        ]);
        if (!cancelled) {
          setStockCounts({
            available: available.total,
            outOfStock: outOfStock.total,
            total: all.total,
          });
        }
      } catch {
        // Silently fail - counts will stay at 0
      }
    };
    loadCounts();
    return () => { cancelled = true; };
  }, [selectedCategory, branch]);

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
        <div className="flex justify-between items-center w-full mb-6">
          <h1 className="font-sans text-2xl font-bold text-slate-900 tracking-tight">Laptops disponibles</h1>

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors flex items-center justify-center"
            aria-label="Compartir catálogo"
          >
            <Share2 className="h-5 w-5" />
          </button>
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
            <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border border-border/60">
              {/* Top Controls Row */}
              <div className="flex flex-row items-center gap-2 md:gap-3">
                {/* Branch Selector */}
                <div className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border/50 bg-background px-3">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Select value={branch} onValueChange={handleBranchChange}>
                    <SelectTrigger className="h-auto w-[120px] border-0 bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0 focus:ring-offset-0 md:w-[150px]">
                      <SelectValue>
                        <span className="font-medium">{getBranchLabel(branch)}</span>
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

                {/* Offers Toggle */}
                <button
                  type="button"
                  onClick={() => setShowOnlyOffers(!showOnlyOffers)}
                  className={cn(
                    "h-10 shrink-0 gap-2 rounded-lg text-sm px-3 py-2 font-medium transition-colors flex items-center",
                    showOnlyOffers
                      ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                      : "bg-background border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-pressed={showOnlyOffers}
                  aria-label={showOnlyOffers ? "Quitar ofertas" : "Mostrar ofertas"}
                  title={showOnlyOffers ? "Quitar ofertas" : "Mostrar ofertas"}
                >
                  <BadgePercent className="h-4 w-4" />
                  <span className="hidden sm:inline">{showOnlyOffers ? "Ofertas" : "Ofertas"}</span>
                </button>

                {/* Stock Filter Tabs - Segmented Control */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 inline-flex">
                  {[
                    { value: "IN_STOCK" as const, label: "Disponibles", count: stockCounts.available },
                    { value: "OUT_OF_STOCK" as const, label: "Agotados", count: stockCounts.outOfStock },
                    { value: "ALL" as const, label: "Todos", count: stockCounts.total },
                  ].filter(tab => tab.count > 0 || tab.value === "ALL").map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setStockFilter(tab.value)}
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5",
                        stockFilter === tab.value
                          ? "bg-white text-slate-900 shadow-sm font-semibold"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                      )}
                    >
                      {tab.label}
                      <span className={cn(
                        "text-[10px]",
                        tab.count === 0 ? "text-slate-400" : "text-inherit opacity-70"
                      )}>
                        ({tab.count})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Mobile Filters Trigger */}
                <div className="lg:hidden ml-auto">
                  <Sheet>
                    <SheetTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            "h-10 w-10 p-0 rounded-lg relative bg-background border-border/50 shrink-0",
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

              {/* Active Filters Section */}
              {appliedFilters.length > 0 && (
                <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {appliedFilters.map((filter) => (
                      <button
                        key={filter.label}
                        type="button"
                        onClick={filter.remove}
                        className="inline-flex max-w-full items-center gap-1.5 bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full transition-colors hover:text-foreground"
                        aria-label={`Quitar ${filter.label}`}
                      >
                        <span className="truncate">{filter.label}</span>
                        <X className="h-3 w-3 shrink-0" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium underline shrink-0 ml-3"
                  >
                    Limpiar todo
                  </button>
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
                <Button
                  onClick={clearFilters}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-lg transition-all"
                >
                  Restablecer todos los filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
