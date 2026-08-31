"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, Star, Sparkles, Gamepad2, Cable } from "lucide-react";
import { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type ProductCarouselType = "offers" | "featured" | "related" | "gaming" | "accessories";

interface ProductCarouselProps {
  type: ProductCarouselType;
  products: Product[];
  linkHref?: string;
  linkText?: string;
  autoRotate?: boolean | number;
}

const carouselConfig: Record<ProductCarouselType, {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  accentColor: string;
}> = {
  offers: {
    title: "Ofertas Flash",
    subtitle: "Los precios más bajos en laptops seleccionadas. ¡No te los pierdas!",
    icon: BadgePercent,
    iconColor: "text-red-600",
    accentColor: "text-red-600",
  },
  featured: {
    title: "Destacados",
    subtitle: "Nuestras recomendaciones por excelente relación calidad-precio.",
    icon: Star,
    iconColor: "text-amber-500",
    accentColor: "text-primary",
  },
  related: {
    title: "Equipos relacionados",
    subtitle: "Otras opciones que podrían interesarte.",
    icon: Sparkles,
    iconColor: "text-primary",
    accentColor: "text-primary",
  },
  gaming: {
    title: "Laptops Gaming",
    subtitle: "Alto rendimiento para gamers. GPU dedicada, pantallas 144Hz y cooling premium.",
    icon: Gamepad2,
    iconColor: "text-purple-600",
    accentColor: "text-purple-600",
  },
  accessories: {
    title: "Accesorios recomendados",
    subtitle: "Complementa tu laptop con los accesorios que necesitas.",
    icon: Cable,
    iconColor: "text-teal-600",
    accentColor: "text-teal-600",
  },
};

export function ProductCarousel({
  type,
  products,
  linkHref = "/catalogo",
  linkText = "Ver catálogo",
  autoRotate = false,
}: ProductCarouselProps) {
  const config = carouselConfig[type];
  const Icon = config.icon;
  const carouselApiRef = useRef<{ canScrollNext: () => boolean; scrollNext: () => void; scrollTo: (index: number) => void } | null | undefined>(null);
  const [isPaused, setIsPaused] = useState(false);
  const rotationInterval = typeof autoRotate === "number" ? autoRotate : 5000;

  useEffect(() => {
    if (!autoRotate || products.length < 2 || isPaused) return;

    const interval = window.setInterval(() => {
      const api = carouselApiRef.current;
      if (!api) return;
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, rotationInterval);

    return () => window.clearInterval(interval);
  }, [autoRotate, isPaused, products.length, rotationInterval]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${type === "offers" ? "bg-red-500/5" : type === "gaming" ? "bg-purple-500/5" : type === "accessories" ? "bg-teal-500/5" : "bg-primary/5"} blur-[120px] rounded-full`} />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${type === "offers" ? "bg-red-500/10 border-red-500/20" : type === "gaming" ? "bg-purple-500/10 border-purple-500/20" : type === "accessories" ? "bg-teal-500/10 border-teal-500/20" : "bg-primary/10 border-primary/20"} ${config.accentColor} text-xs font-bold uppercase tracking-widest border`}>
              <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
              {config.title}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {type === "offers" ? <>Ofertas <span className="text-red-600">Flash</span></> : type === "gaming" ? <>Laptops <span className="text-purple-600">Gaming</span></> : type === "accessories" ? <>Accesorios <span className="text-teal-600">recomendados</span></> : config.title}
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">{config.subtitle}</p>
          </div>
          <Link
            href={linkHref}
            className="group h-11 px-6 rounded-xl bg-card border border-border/50 shadow-sm flex items-center gap-2 font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 shrink-0"
          >
            {linkText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Carousel
          opts={{ align: "start", dragFree: true, loop: Boolean(autoRotate) }}
          setApi={(api) => {
            carouselApiRef.current = api;
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="relative"
        >
          <CarouselContent className="-ml-5">
            {products.slice(0, 12).map((product) => (
              <CarouselItem
                key={product.id}
                className={`pl-5 ${type === "related" ? "basis-full" : "basis-[85%]"} sm:basis-[48%] lg:basis-[31%] xl:basis-[24%]`}
              >
                <ProductCard product={product} variant="compact" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-auto right-14 -top-16 translate-y-0 bg-card border-border/50 hover:bg-primary hover:text-primary-foreground" aria-label="Anterior" />
          <CarouselNext className="right-0 -top-16 translate-y-0 bg-card border-border/50 hover:bg-primary hover:text-primary-foreground" aria-label="Siguiente" />
        </Carousel>
      </div>
    </section>
  );
}
