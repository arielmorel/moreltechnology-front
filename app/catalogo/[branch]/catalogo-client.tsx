"use client";

import { useState, useMemo, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts, searchProducts, AvailabilityFilter, SortFilter, getSettingWithDefault } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard, type ProductCardView } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Search, SlidersHorizontal, MapPin, Share2, X, BadgePercent, ChevronDown, ChevronRight, LayoutGrid, List } from "lucide-react";
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
import Link from "next/link";
import { CatalogTheme, themeConfigs } from "@/lib/themes";
import { motion, type Variants } from "framer-motion";

const PAGE_SIZE = 6;

const TAG_OPTIONS = ["gamer", "touch"];

function getBranchLabel(branchId: string): string {
  const branch = branches.find(b => b.id === branchId);
  return branch ? branch.name.replace("Sucursal ", "") : branchId;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const productListVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const productItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const VIEW_MODE_KEY = "catalog-view-mode";

function viewModeGetServerSnapshot(): ProductCardView {
  return "grid";
}

function viewModeGetSnapshot(): ProductCardView {
  if (typeof window === "undefined") return "grid";
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  return stored === "list" ? "list" : "grid";
}

function viewModeSubscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function setViewMode(next: ProductCardView): void {
  window.localStorage.setItem(VIEW_MODE_KEY, next);
  window.dispatchEvent(new Event("storage"));
}

export default function CatalogoBranchClient({ branch: initialBranch }: { branch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [branch] = useState<string>(initialBranch);
  const [currentTheme, setCurrentTheme] = useState<CatalogTheme>("theme-novus");
  const viewMode = useSyncExternalStore(viewModeSubscribe, viewModeGetSnapshot, viewModeGetServerSnapshot);

  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get("category") || "todas");
  const [selectedBrand, setSelectedBrand] = useState<string>(() => searchParams.get("brand") || "todas");
  const [selectedProcessor, setSelectedProcessor] = useState<string>(() => searchParams.get("processor") || "todas");
  const [selectedRam, setSelectedRam] = useState<string>(() => searchParams.get("ram") || "todas");
  const [selectedStorage, setSelectedStorage] = useState<string>(() => searchParams.get("storage") || "todas");
  const [showOnlyOffers, setShowOnlyOffers] = useState(() => searchParams.get("offers") === "true");
  const [selectedCondition, setSelectedCondition] = useState<string>(() => searchParams.get("condition") || "todas");
  const [selectedTag, setSelectedTag] = useState<string>(() => searchParams.get("tags") || "todas");
  const [priceRange, setPriceRange] = useState<number[]>(() => {
    const min = parseInt(searchParams.get("priceMin") || "0", 10);
    const max = parseInt(searchParams.get("priceMax") || "200000", 10);
    return [isNaN(min) ? 0 : min, isNaN(max) ? 200000 : max];
  });
  const [stockFilter, setStockFilter] = useState<AvailabilityFilter>(
    () => (searchParams.get("availability") as AvailabilityFilter) || "IN_STOCK"
  );
  const [sortBy, setSortBy] = useState<SortFilter>(
    () => (searchParams.get("sort") as SortFilter) || "newest"
  );

  // Load theme from settings
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await getSettingWithDefault("appearance.theme", "theme-novus");
        setCurrentTheme(theme as CatalogTheme);
      } catch {
        // Use default theme
      }
    };
    loadTheme();
  }, []);

  const buildShareUrl = useCallback(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (selectedCategory !== "todas") params.set("category", selectedCategory);
    if (selectedBrand !== "todas") params.set("brand", selectedBrand);
    if (selectedProcessor !== "todas") params.set("processor", selectedProcessor);
    if (selectedRam !== "todas") params.set("ram", selectedRam);
    if (selectedStorage !== "todas") params.set("storage", selectedStorage);
    if (showOnlyOffers) params.set("offers", "true");
    if (selectedCondition !== "todas") params.set("condition", selectedCondition);
    if (selectedTag !== "todas") params.set("tags", selectedTag);
    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      params.set("priceMin", priceRange[0].toString());
      params.set("priceMax", priceRange[1].toString());
    }
    if (stockFilter !== "IN_STOCK") params.set("availability", stockFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    return `${baseUrl}/catalogo/${branch}?${params.toString()}`;
  }, [branch, debouncedSearch, selectedCategory, selectedBrand, selectedProcessor, selectedRam, selectedStorage, showOnlyOffers, selectedCondition, selectedTag, priceRange, stockFilter, sortBy]);

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (selectedCategory !== "todas") params.set("category", selectedCategory);
    if (selectedBrand !== "todas") params.set("brand", selectedBrand);
    if (selectedProcessor !== "todas") params.set("processor", selectedProcessor);
    if (selectedRam !== "todas") params.set("ram", selectedRam);
    if (selectedStorage !== "todas") params.set("storage", selectedStorage);
    if (showOnlyOffers) params.set("offers", "true");
    if (selectedCondition !== "todas") params.set("condition", selectedCondition);
    if (selectedTag !== "todas") params.set("tags", selectedTag);
    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      params.set("priceMin", priceRange[0].toString());
      params.set("priceMax", priceRange[1].toString());
    }
    if (stockFilter !== "IN_STOCK") params.set("availability", stockFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    const queryString = params.toString();
    const newUrl = `/catalogo/${branch}${queryString ? `?${queryString}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [debouncedSearch, selectedCategory, selectedBrand, selectedProcessor, selectedRam, selectedStorage, showOnlyOffers, selectedCondition, selectedTag, priceRange, stockFilter, sortBy, branch, router]);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stockCounts, setStockCounts] = useState({ available: 0, outOfStock: 0, total: 0 });
  const filtersKey = `${debouncedSearch}-${selectedCategory}-${branch}-${stockFilter}`;

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const queryString = params.toString();
    const newUrl = `/catalogo/${branch}${queryString ? `?${queryString}` : ""}`;
    router.push(newUrl, { scroll: false });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let cancelled = false;
    const loadInitial = async () => {
      if (!cancelled) setIsLoading(true);
      try {
        const pageIndex = Math.min(currentPage - 1, Math.max(0, totalPages - 1));
        let result;
        if (debouncedSearch.trim() === "") {
          result = await getProducts(pageIndex, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
        } else {
          result = await searchProducts(debouncedSearch, pageIndex, PAGE_SIZE, selectedCategory, branch, undefined, stockFilter);
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
  }, [filtersKey, debouncedSearch, selectedCategory, branch, stockFilter, currentPage, totalPages]);

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

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [filteredProducts, sortBy]);

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
    <div 
      className="min-h-screen pt-16 pb-6"
      style={{ 
        backgroundColor: themeConfigs[currentTheme].colors.background,
        color: themeConfigs[currentTheme].colors.text,
        ...Object.fromEntries(
          Object.entries(themeConfigs[currentTheme].colors).map(([key, value]) => [`--theme-${key}`, value])
        )
      }}
    >
      <motion.div
        className="w-full px-4 md:px-6 lg:px-8 xl:px-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Breadcrumb */}
        <motion.nav
          variants={itemVariants}
          aria-label="Ruta de navegación"
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8"
        >
          <Link href="/" className="hover:text-foreground transition-colors font-medium">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/catalogo" className="hover:text-foreground transition-colors font-medium">
            Catálogo
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground font-semibold">{getBranchLabel(branch)}</span>
        </motion.nav>

        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center w-full mb-4">
          <h1 className="font-sans text-xl font-bold tracking-tight" style={{ color: themeConfigs[currentTheme].colors.text }}>
            Laptops disponibles en {getBranchLabel(branch)}
          </h1>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 border rounded-lg transition-colors"
            style={{ 
              borderColor: themeConfigs[currentTheme].colors.border,
              color: themeConfigs[currentTheme].colors.textSecondary
            }}
            aria-label="Compartir catálogo"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar laptops por nombre, marca o procesador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* Branch Selector + Filter Trigger Row */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
          {/* Branch Selector */}
          <div className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
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
          <div className="xl:hidden ml-auto">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 px-3 gap-1.5 rounded-lg text-xs font-medium bg-card border-border shrink-0",
                      activeFiltersCount > 0 && "border-slate-900 text-foreground"
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
                <SheetHeader className="p-4 border-b border-border">
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
                    tags={TAG_OPTIONS}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>

        {/* Horizontal Scrollable Filter Chips */}
        <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 mb-2">
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
            active={stockFilter === "OUT_OF_STOCK"}
            onClick={() => setStockFilter("OUT_OF_STOCK")}
          >
            Agotados ({stockCounts.outOfStock})
          </FilterChip>

          <FilterChip
            active={stockFilter === "ALL"}
            onClick={() => setStockFilter("ALL")}
          >
            Todos ({stockCounts.total})
          </FilterChip>

          <FilterChip
            active={sortBy === "price_asc"}
            onClick={() => setSortBy(sortBy === "price_asc" ? "newest" : "price_asc")}
          >
            Precio ↑
          </FilterChip>

          <FilterChip
            active={sortBy === "price_desc"}
            onClick={() => setSortBy(sortBy === "price_desc" ? "newest" : "price_desc")}
          >
            Precio ↓
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
        </motion.div>

        {/* Active Filters */}
        {appliedFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
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
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground font-medium shrink-0"
            >
              Limpiar
            </button>
          </div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col xl:flex-row gap-4 md:gap-6 xl:gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden xl:block w-72 shrink-0">
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
                tags={TAG_OPTIONS}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results count */}
            <div ref={resultsRef} className="flex items-center justify-between mb-3 gap-3">
              <p className="text-xs text-muted-foreground" aria-live="polite" role="status">
                {sortedProducts.length} {sortedProducts.length === 1 ? "equipo" : "equipos"} encontrados
              </p>
              <div className="flex items-center gap-2">
                {/* View mode toggle */}
                <div className="bg-muted p-0.5 rounded-lg flex items-center gap-0.5 shrink-0" role="group" aria-label="Cambiar vista">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === "grid"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Vista de cuadrícula"
                    aria-pressed={viewMode === "grid"}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-1.5 rounded-md transition-all",
                      viewMode === "list"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Vista de lista"
                    aria-pressed={viewMode === "list"}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-muted p-0.5 rounded-lg flex items-center gap-0.5">
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
                        "text-[10px] font-medium px-2.5 py-1 rounded-md transition-all",
                        stockFilter === tab.value
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoading && products.length === 0 ? (
              <div
                key={`skeleton-${filtersKey}-${viewMode}`}
                className={cn(
                  "grid gap-6",
                  viewMode === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                )}
              >
                {[...Array(viewMode === "list" ? 3 : 6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                {viewMode === "list" ? (
                  <motion.div
                    key={`list-${filtersKey}`}
                    variants={productListVariants}
                    initial="hidden"
                    animate="show"
                    aria-busy={isLoading}
                    className="flex flex-col gap-5"
                  >
                    {sortedProducts.map(product => (
                      <motion.div key={product.id} variants={productItemVariants}>
                        <ProductCard key={product.id} product={product} view="list" />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`grid-${filtersKey}`}
                    variants={productListVariants}
                    initial="hidden"
                    animate="show"
                    aria-busy={isLoading}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {sortedProducts.map(product => (
                      <motion.div key={product.id} variants={productItemVariants} className="h-full">
                        <ProductCard key={product.id} product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Paginación de resultados"
                    className="flex items-center justify-center gap-1.5 pt-6"
                  >
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-card border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const isPageActive = page === currentPage;
                      const isNearby =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      if (!isNearby) {
                        const isEllipsis = page === 2 || page === totalPages - 1;
                        return isEllipsis ? (
                          <span key={page} className="px-1 text-muted-foreground select-none">
                            …
                          </span>
                        ) : null;
                      }

                      return (
                        <button
                          key={page}
                          type="button"
                          aria-current={isPageActive ? "page" : undefined}
                          onClick={() => goToPage(page)}
                          className={cn(
                            "min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition-colors",
                            isPageActive
                              ? "bg-slate-900 text-white"
                              : "bg-card border border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-card border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      Siguiente
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-bold mb-1">No encontramos equipos</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  {search
                    ? `No hay resultados para "${search}". Intenta con otro término.`
                    : "No hay equipos disponibles con los filtros seleccionados."}
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Button
                    onClick={clearFilters}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm"
                  >
                    Limpiar filtros
                  </Button>
                  <Link
                    href={`/catalogo/${branch}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground bg-muted hover:bg-muted transition-colors"
                  >
                    Ver catálogo completo
                  </Link>
                </div>
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground mb-3">O explora por categoría:</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {categories.slice(0, 5).map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
