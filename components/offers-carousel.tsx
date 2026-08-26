"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { BadgePercent, ArrowRight } from "lucide-react";
import { isMinioImage, productUrl } from "@/lib/utils";

interface OffersCarouselProps {
  products: Product[];
}

export function OffersCarousel({ products }: OffersCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (products.length === 0) return null;

  const duplicated = [...products, ...products];

  return (
    <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-500/20">
              <BadgePercent className="w-3.5 h-3.5" />
              Ofertas
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Ofertas <span className="text-red-600">Flash</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Los precios más bajos en laptops seleccionadas. ¡No te los pierdas!
            </p>
          </div>
          <Link
            href="/ofertas"
            className="group h-11 px-6 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-2 font-bold text-sm hover:bg-red-600 hover:text-white transition-all duration-300 shrink-0"
          >
            Ver ofertas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Auto-scrolling carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 overflow-hidden py-4">
          <div
            className="flex gap-5 shrink-0"
            style={{
              animation: "scrollOffers 30s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicated.map((product, index) => (
              <Link
                key={`${product.id}-${index}`}
                href={productUrl(product.slug)}
                className="shrink-0 w-[260px] sm:w-[300px] group"
              >
                <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-red-500/5 hover:border-red-500/20 transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      unoptimized={isMinioImage(product.images[0])}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="300px"
                    />
                    {/* Discount badge */}
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-600 text-white border-0 shadow-lg text-xs font-bold px-2.5 py-1">
                          <BadgePercent className="w-3 h-3 mr-1" />
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold rounded-full shadow-lg">
                        Ver detalles
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors mb-3 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          RD$ {product.originalPrice.toLocaleString("es-DO")}
                        </span>
                      )}
                      <span className="text-lg font-bold text-red-600">
                        RD$ {product.price.toLocaleString("es-DO")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollOffers {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 1.25rem));
          }
        }
      `}</style>
    </section>
  );
}
