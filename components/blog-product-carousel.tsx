"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BlogProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  ctaHref?: string;
}

export function BlogProductCarousel({
  products,
  title = "Producto mencionado",
  subtitle = "Disponible ahora en Morel Technology",
  ctaHref,
}: BlogProductCarouselProps) {
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
        <div className="mt-4 w-full sm:w-[48%] lg:w-[31%]">
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
      {ctaHref && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Ver todos los resultados
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}