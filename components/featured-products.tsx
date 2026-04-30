"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/data";
import { getProducts } from "@/lib/api";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) return;

    const loadFeatured = async () => {
      setIsLoading(true);
      try {
        const { products } = await getProducts(0, 20);
        // Filter for pinned/featured or just take the first 4 if none are featured
        const filtered = products.filter(p => p.featured).slice(0, 4);
        setFeatured(filtered.length > 0 ? filtered : products.slice(0, 4));
      } finally {
        setIsLoading(false);
        isInitialMount.current = false;
      }
    };
    loadFeatured();
  }, []);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Selección Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Equipos <span className="text-primary">Destacados</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Nuestras mejores recomendaciones del mes. Equipos seleccionados por su excelente relación calidad-precio y rendimiento garantizado.
            </p>
          </div>
          <Link href="/catalogo" className="group h-14 px-8 rounded-2xl bg-white border border-border/50 shadow-sm flex items-center gap-3 font-bold hover:bg-primary hover:text-white transition-all duration-300">
            Ver catálogo completo 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
