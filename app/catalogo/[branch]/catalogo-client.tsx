"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Product } from "@/lib/data";
import { getProducts, searchProducts } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, MapPin, Share2, Loader2 } from "lucide-react";
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

const PAGE_SIZE = 20;

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
  const [selectedCondition, setSelectedCondition] = useState<string>("todas");
  const [selectedTag, setSelectedTag] = useState<string>("todas");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const pageRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const filtersKey = `${debouncedSearch}-${selectedCategory}-${branch}`;

  const hasMore = products.length < total;

  useEffect(() => {
    pageRef.current = 0;
    let cancelled = false;
    const loadInitial = async () => {
      if (!cancelled) setIsLoading(true);
      try {
        let result;
        if (debouncedSearch.trim() === "") {
          result = await getProducts(0, PAGE_SIZE, selectedCategory, branch);
        } else {
          result = await searchProducts(debouncedSearch, 0, PAGE_SIZE, selectedCategory, branch);
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
  }, [filtersKey, debouncedSearch, selectedCategory, branch]);

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
                result = await getProducts(nextPage, PAGE_SIZE, selectedCategory, branch);
              } else {
                result = await searchProducts(debouncedSearch, nextPage, PAGE_SIZE, selectedCategory, branch);
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
  }, [hasMore, isLoadingMore, debouncedSearch, selectedCategory, branch, products.length]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map(p => p.brand));
    return Array.from(uniqueBrands);
  }, [products]);

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
      const matchesTag = selectedTag === "todas" || product.tags.includes(selectedTag);
      const matchesCondition = selectedCondition === "todas" ||
        (selectedCondition === "Nuevo" && product.condition === "Nuevo") ||
        (selectedCondition === "Usado" && product.condition.includes("Usado"));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesBrand && matchesCondition && matchesPrice && matchesTag;
    });
  }, [products, search, selectedBrand, selectedCondition, selectedTag, priceRange]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("todas");
    setSelectedBrand("todas");
    setSelectedCondition("todas");
    setSelectedTag("todas");
    setPriceRange([0, 200000]);
  };

  const activeFiltersCount = (selectedCategory !== "todas" ? 1 : 0) +
    (selectedBrand !== "todas" ? 1 : 0) +
    (selectedCondition !== "todas" ? 1 : 0) +
    (selectedTag !== "todas" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0);

  const handleBranchChange = useCallback((newBranch: string | null) => {
    if (newBranch) {
      router.push(`/catalogo/${newBranch}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen pt-16 pb-6 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-4 md:mb-12 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-5xl font-black tracking-tight">Catálogo</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Branch Selector */}
            <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <Select value={branch} onValueChange={handleBranchChange}>
                <SelectTrigger className="w-auto h-auto border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0 shadow-none">
                  <SelectValue>
                    <span className="text-sm font-semibold">{getBranchLabel(branch)}</span>
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

        <div className="flex flex-col lg:flex-row gap-4 md:gap-10">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28 bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <ProductFilters
                search={search}
                setSearch={setSearch}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCondition={selectedCondition}
                setSelectedCondition={setSelectedCondition}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                brands={brands}
                tags={allTags}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-4 md:space-y-8">
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar equipo..."
                  className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-border/50 bg-card shadow-sm focus:ring-primary/20 text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                    <SheetHeader className="p-8 border-b border-border/50">
                      <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        Filtros
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-8 h-[calc(100vh-100px)] overflow-y-auto">
                      <ProductFilters
                        search={search}
                        setSearch={setSearch}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        selectedCondition={selectedCondition}
                        setSelectedCondition={setSelectedCondition}
                        selectedTag={selectedTag}
                        setSelectedTag={setSelectedTag}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        maxPrice={maxPrice}
                        brands={brands}
                        tags={allTags}
                        clearFilters={clearFilters}
                        activeFiltersCount={activeFiltersCount}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
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
