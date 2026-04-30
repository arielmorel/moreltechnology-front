"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { categories, Product } from "@/lib/data";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, LayoutGrid, Badge } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { ProductFilters } from "@/components/product-filters";

export default function CatalogoPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [selectedBrand, setSelectedBrand] = useState<string>("todas");
  const [selectedCondition, setSelectedCondition] = useState<string>("todas");
  const [selectedTag, setSelectedTag] = useState<string>("todas");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) return;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const { products: fetchedProducts } = await getProducts(0, 100);
        setProducts(fetchedProducts);
      } finally {
        setIsLoading(false);
        isInitialMount.current = false;
      }
    };
    loadProducts();
  }, []);

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
      const matchesCategory = selectedCategory === "todas" || product.category === selectedCategory;
      const matchesBrand = selectedBrand === "todas" || product.brand === selectedBrand;
      const matchesTag = selectedTag === "todas" || product.tags.includes(selectedTag);
      const matchesCondition = selectedCondition === "todas" ||
        (selectedCondition === "Nuevo" && product.condition === "Nuevo") ||
        (selectedCondition === "Usado" && product.condition.includes("Usado"));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesCondition && matchesPrice && matchesTag;
    });
  }, [products, search, selectedCategory, selectedBrand, selectedCondition, selectedTag, priceRange]);

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



  return (
    <div className="min-h-screen pt-2 md:pt-6 pb-6 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-row items-baseline justify-between mb-4 md:mb-12 gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-5xl font-black tracking-tight">Catálogo</h1>
          </div>
          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex items-center">
            <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 text-primary uppercase">
              {filteredProducts.length} <span className="hidden xs:inline">Equipos</span>
            </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-card rounded-3xl border border-dashed border-border/50">
                <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No encontramos equipos</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  Prueba ajustando los filtros o buscando otro modelo. ¡Tenemos mercancía nueva llegando cada semana!
                </p>
                <Button onClick={clearFilters} className="rounded-xl h-12 px-8">Limpiar todos los filtros</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
