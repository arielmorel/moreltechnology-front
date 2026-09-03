"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/data";
import { searchProducts, mapApiProductToProduct, ApiProduct, ApiResponse } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BlogProductCarouselProps {
  query: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function BlogProductCarousel({
  query,
  title = "Producto mencionado",
  subtitle = "Disponible ahora en Morel Technology",
  limit = 4,
}: BlogProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";
        const response = await fetch(
          `${API_BASE_URL}/api/catalogs/moreltechnology/products/search?query=${encodeURIComponent(query)}&page=0&size=${limit}&availability=IN_STOCK`
        );
        const data: ApiResponse = await response.json();
        setProducts(data.content.map(mapApiProductToProduct));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query, limit]);

  if (loading) {
    return (
      <div className="my-8 rounded-2xl border border-border/50 bg-muted/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-5 w-5 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Products */}
      {products.length === 1 ? (
        <div className="mt-4">
          <ProductCard product={products[0]} />
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="relative"
        >
          <CarouselContent className="-ml-3">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-full sm:basis-[48%] lg:basis-[31%]"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="!static !translate-y-0 !-translate-x-0 h-9 w-9 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="!static !translate-y-0 !-translate-x-0 h-9 w-9 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground" />
        </Carousel>
      )}

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <a
          href={`/catalogo?search=${encodeURIComponent(query)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Ver todos los resultados
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
