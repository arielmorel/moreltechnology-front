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
    title: "Ofertas",
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
    title: "Laptops",
    subtitle: "Alto rendimiento para gamers. GPU dedicada, pantallas 144Hz y cooling premium.",
    icon: Gamepad2,
    iconColor: "text-purple-600",
    accentColor: "text-purple-600",
  },
  accessories: {
    title: "Accesorios",
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

  const carouselApiRef = useRef<{
    canScrollNext: () => boolean;
    scrollNext: () => void;
    scrollTo: (index: number) => void;
  } | null | undefined>(null);

  const [isPaused, setIsPaused] = useState(false);

  const rotationInterval =
    typeof autoRotate === "number" ? autoRotate : 5000;

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

  const accentStyles =
    type === "offers"
      ? {
          badge: "bg-red-500/10 border-red-500/20",
          icon: "text-red-600",
          title: "text-red-600",
          glow: "bg-red-500/5",
        }
      : type === "gaming"
        ? {
            badge: "bg-purple-500/10 border-purple-500/20",
            icon: "text-purple-600",
            title: "text-purple-600",
            glow: "bg-purple-500/5",
          }
        : type === "accessories"
          ? {
              badge: "bg-teal-500/10 border-teal-500/20",
              icon: "text-teal-600",
              title: "text-teal-600",
              glow: "bg-teal-500/5",
            }
          : {
              badge: "bg-primary/10 border-primary/20",
              icon: "text-primary",
              title: "text-primary",
              glow: "bg-primary/5",
            };

  return (
    <section className="relative overflow-hidden bg-muted/30 py-8 md:py-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] md:h-[800px] md:w-[800px] md:blur-[120px] ${accentStyles.glow}`}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
            loop: Boolean(autoRotate),
          }}
          setApi={(api) => {
            carouselApiRef.current = api;
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="relative"
        >
          {/* Header */}
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-10">
            <div className="min-w-0 space-y-1.5 md:space-y-2">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest md:gap-2 md:px-3 md:py-1.5 md:text-xs ${accentStyles.badge} ${config.accentColor}`}
              >
                <Icon
                  className={`h-3 w-3 md:h-3.5 md:w-3.5 ${accentStyles.icon}`}
                />

                {config.title}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-black leading-tight tracking-tight md:text-4xl">
                {type === "offers" ? (
                  <>
                    Ofertas{" "}
                    <span className={accentStyles.title}>Flash</span>
                  </>
                ) : type === "gaming" ? (
                  <>
                    Laptops{" "}
                    <span className={accentStyles.title}>Gaming</span>
                  </>
                ) : type === "accessories" ? (
                  <>
                    Accesorios{" "}
                    <span className={accentStyles.title}>recomendados</span>
                  </>
                ) : (
                  config.title
                )}
              </h2>

              {/* Subtitle */}
              <p className="max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm">
                {config.subtitle}
              </p>
            </div>

            {/* Navigation - Button + Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={linkHref}
                className="group flex h-9 items-center gap-1.5 rounded-lg border border-border/50 bg-card px-4 text-xs font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground md:h-10 md:gap-2 md:rounded-xl md:px-5 md:text-sm"
              >
                {linkText}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
              </Link>

              <div className="flex items-center gap-1">
                <CarouselPrevious
                  className="!static !translate-y-0 !-translate-x-0 h-9 w-9 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground md:h-10 md:w-10"
                  aria-label="Anterior"
                />
                <CarouselNext
                  className="!static !translate-y-0 !-translate-x-0 h-9 w-9 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground md:h-10 md:w-10"
                  aria-label="Siguiente"
                />
              </div>
            </div>
          </div>

          <CarouselContent className="-ml-3 md:-ml-5">
            {products.slice(0, 12).map((product) => (
              <CarouselItem
                key={product.id}
                className={`pl-3 md:pl-5 ${
                  type === "related"
                    ? "basis-full"
                    : "basis-[72%]"
                } sm:basis-[48%] lg:basis-[31%] xl:basis-[24%]`}
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}