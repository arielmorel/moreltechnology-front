"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts, searchProducts, AvailabilityFilter } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Search, SlidersHorizontal, MapPin, Share2, Loader2, X, BadgePercent, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/ui/filter-chip";
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
        {/* Header */}
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="font-sans text-xl font-bold text-slate-900 tracking-tight">Laptops disponibles</h1>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
            aria-label="Compartir catálogo"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar laptops por nombre, marca o procesador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Branch Selector + Filter Trigger Row */}
        <div className="flex items-center gap-2 mb-3">
          {/* Branch Selector */}
          <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <Select value={branch} onValueChange={handleBranchChange}>
              <SelectTrigger className="h-auto w-[100px] border-0 bg-transparent p-0 text-xs font-medium shadow-none focus:ring-0 focus:ring-offset-0 md:w-[130px]">
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

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden ml-auto">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 px-3 gap-1.5 rounded-lg text-xs font-medium bg-white border-slate-200 shrink-0",
                      activeFiltersCount > 0 && "border-slate-900 text-slate-900"
                    )}
                  />
                }
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="h-4 w-4 bg-slate-900 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-4 border-b border-slate-200">
                  <SheetTitle className="text-lg font-bold flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
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

        {/* Horizontal Scrollable Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 mb-2">
          <FilterChip
            active={showOnlyOffers}
            onClick={() => setShowOnlyOffers(!showOnlyOffers)}
          >
            <BadgePercent className="w-3 h-3" />
            Ofertas
          </FilterChip>

          <FilterChip
            active={stockFilter === "IN_STOCK"}
            onClick={() => setStockFilter("IN_STOCK")}
          >
            Disponibles ({stockCounts.available})
          </FilterChip>

          <FilterChip
            active={stockFilter === "ALL"}
            onClick={() => setStockFilter("ALL")}
          >
            Todos ({stockCounts.total})
          </FilterChip>

          {brands.slice(0, 3).map(brand => (
            <FilterChip
              key={brand}
              active={selectedBrand === brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? "todas" : brand)}
            >
              {brand}
            </FilterChip>
          ))}

          <FilterChip
            active={selectedCondition !== "todas"}
            onClick={() => {
              if (selectedCondition === "todas") {
                setSelectedCondition("Nuevo");
              } else if (selectedCondition === "Nuevo") {
                setSelectedCondition("Usado");
              } else {
                setSelectedCondition("todas");
              }
            }}
          >
            {selectedCondition === "todas" ? "Condición" : selectedCondition}
            <ChevronDown className="w-3 h-3" />
          </FilterChip>

          <FilterChip
            active={selectedRam !== "todas"}
            onClick={() => {
              if (selectedRam === "todas") {
                setSelectedRam(rams[0] || "8GB");
              } else {
                const idx = rams.indexOf(selectedRam);
                setSelectedRam(idx < rams.length - 1 ? rams[idx + 1] : "todas");
              }
            }}
          >
            RAM
            {selectedRam !== "todas" && `: ${selectedRam}`}
            <ChevronDown className="w-3 h-3" />
          </FilterChip>
        </div>

        {/* Active Filters */}
        {appliedFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {appliedFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={filter.remove}
                className="inline-flex shrink-0 items-center gap-1 bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <span className="truncate max-w-[120px]">{filter.label}</span>
                <X className="h-3 w-3 shrink-0" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] text-slate-500 hover:text-slate-700 font-medium shrink-0"
            >
              Limpiar
            </button>
          </div>
        )}

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
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? "equipo" : "equipos"} encontrados
              </p>
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-0.5">
                {[
                  { value: "IN_STOCK" as const, label: "Disponibles" },
                  { value: "ALL" as const, label: "Todos" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStockFilter(tab.value)}
                    className={cn(
                      "text-[10px] font-medium px-2.5 py-1 rounded-md transition-all",
                      stockFilter === tab.value
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading && products.length === 0 ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="space-y-3" aria-busy={isLoading}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="flex justify-center py-8">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Cargando más equipos...</span>
                    </div>
                  )}
                  {!hasMore && filteredProducts.length > 0 && (
                    <p className="text-slate-400 text-xs">
                      Has visto todos los {filteredProducts.length} equipos
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h2 className="text-lg font-bold mb-1">No encontramos equipos</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                  {search
                    ? `No hay resultados para "${search}". Intenta con otro término.`
                    : "No hay equipos disponibles con los filtros seleccionados."}
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
