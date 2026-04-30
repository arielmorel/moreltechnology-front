"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/data";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { BadgePercent, Sparkles } from "lucide-react";

export default function OfertasPage() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true);
      try {
        const { products } = await getProducts(0, 100);
        // Filtramos solo los que tienen precio original (están en oferta)
        const filteredDeals = products.filter(p => p.originalPrice && p.originalPrice > p.price);
        setDeals(filteredDeals);
      } catch (error) {
        console.error("Error loading deals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDeals();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-4 rounded-3xl text-white shadow-xl shadow-red-600/20">
              <BadgePercent className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Ofertas Flash</h1>
              <p className="text-muted-foreground font-medium">Los precios más bajos de RD, validados hoy.</p>
            </div>
          </div>
          
          {deals.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 text-red-600 border border-red-100 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-widest">{deals.length} Ofertas Activas</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {deals.length === 0 && (
              <div className="text-center py-32 bg-card rounded-[3rem] border border-border/50 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <BadgePercent className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">No hay ofertas flash en este momento</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Estamos negociando nuevos precios. ¡Vuelve pronto o revisa nuestro catálogo completo!
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
