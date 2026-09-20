"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, Star, Sparkles, Gamepad2, Cable, Clock, Laptop, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Product } from "@/lib/data";
import { ProductCardCarousel } from "@/components/product-card-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type ProductCarouselType = "offers" | "featured" | "related" | "gaming" | "accessories" | "new-arrivals" | "same-model";

interface ProductCarouselProps {
  type: ProductCarouselType;
  products: Product[];
  linkHref?: string;
  linkText?: string;
  autoRotate?: boolean | number;
  fetchPage?: (page: number) => Promise<{ products: Product[]; total: number }>;
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
  "new-arrivals": {
    title: "Recién Llegados",
    subtitle: "Los últimos equipos que agregamos a nuestro inventario.",
    icon: Clock,
    iconColor: "text-blue-500",
    accentColor: "text-blue-600",
  },
  "same-model": {
    title: "Mismo modelo",
    subtitle: "Otras unidades disponibles de este modelo.",
    icon: Laptop,
    iconColor: "text-muted-foreground",
    accentColor: "text-foreground",
  },
};

export function ProductCarousel({
  type,
  products,
  linkHref = "/catalogo",
  linkText = "Ver catálogo",
  autoRotate = false,
  fetchPage,
}: ProductCarouselProps) {
  const config = carouselConfig[type];
  const Icon = config.icon;

  const carouselApiRef = useRef<{
    canScrollNext: () => boolean;
    scrollNext: () => void;
    scrollTo: (index: number) => void;
  } | null | undefined>(null);

  const [isPaused, setIsPaused] = useState(false);

  const [items, setItems] = useState<Product[]>(products);
  const [total, setTotal] = useState(products.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const pageRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const rotationInterval =
    typeof autoRotate === "number" ? autoRotate : 5000;

  useEffect(() => {
    if (!fetchPage) return;
    let cancelled = false;
    pageRef.current = 0;
    fetchPage(0).then((res) => {
      if (cancelled) return;
      setItems(res.products);
      setTotal(res.total);
      setExhausted(res.products.length === 0);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  useEffect(() => {
    if (fetchPage || !autoRotate || items.length < 2 || isPaused) return;

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
  }, [fetchPage, autoRotate, isPaused, items.length, rotationInterval]);

  useEffect(() => {
    if (!fetchPage) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const load = async () => {
      if (isLoadingMore || exhausted) return;
      const page = pageRef.current + 1;
      pageRef.current = page;
      setIsLoadingMore(true);
      try {
        const res = await fetchPage(page);
        setItems((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...res.products.filter((p) => !seen.has(p.id))];
        });
        setTotal(res.total);
        if (res.products.length === 0) {
          setExhausted(true);
        }
      } finally {
        setIsLoadingMore(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void load();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPage, isLoadingMore, exhausted, items.length]);

  const displayProducts = fetchPage ? items : products;
  if (!fetchPage && products.length === 0) return null;
  if (fetchPage && items.length === 0 && exhausted) return null;

  const hasMore = fetchPage ? !exhausted && items.length < total : false;
  const showInitialLoader = Boolean(fetchPage) && items.length === 0 && !exhausted;

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
          : type === "new-arrivals"
            ? {
                badge: "bg-blue-500/10 border-blue-500/20",
                icon: "text-blue-500",
                title: "text-blue-600",
                glow: "bg-blue-500/5",
              }
            : type === "same-model"
              ? {
                  badge: "bg-slate-500/10 border-slate-500/20",
                  icon: "text-muted-foreground",
                  title: "text-foreground",
                  glow: "bg-slate-500/5",
                }
              : {
                badge: "bg-primary/10 border-primary/20",
                icon: "text-primary",
                title: "text-primary",
                glow: "bg-primary/5",
              };

  return (
    <section className="relative overflow-hidden py-6 md:py-16">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] md:h-[800px] md:w-[800px] md:blur-[120px] ${accentStyles.glow}`}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-4 md:mb-10">
          <div className="min-w-0 space-y-1.5 md:space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest md:gap-2 md:px-3 md:py-1.5 md:text-xs ${accentStyles.badge} ${config.accentColor}`}
            >
              <Icon className={`h-3 w-3 md:h-3.5 md:w-3.5 ${accentStyles.icon}`} />
              {config.title}
            </div>

            <div className="flex items-end justify-between gap-4">
              <h2 className="text-xl md:text-4xl font-black leading-tight tracking-tight">
                {type === "offers" ? (
                  <>Ofertas <span className={accentStyles.title}>Flash</span></>
                ) : type === "gaming" ? (
                  <>Laptops <span className={accentStyles.title}>Gaming</span></>
                ) : type === "accessories" ? (
                  <>Accesorios <span className={accentStyles.title}>recomendados</span></>
                ) : type === "new-arrivals" ? (
                  <>Recién <span className={accentStyles.title}>Llegados</span></>
                ) : type === "same-model" ? (
                  <>Otras <span className={accentStyles.title}>unidades</span></>
                ) : (
                  config.title
                )}
              </h2>

              <Link
                href={linkHref}
                className="group hidden md:flex h-9 items-center gap-1.5 rounded-lg border border-border/50 bg-card px-4 text-xs font-bold shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground md:h-10 md:gap-2 md:rounded-xl md:px-5 md:text-sm shrink-0"
              >
                {linkText}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
              </Link>
            </div>

            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm hidden md:block">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Infinite edge-triggered rail */}
        {fetchPage ? (
          <>
            {showInitialLoader ? (
              <div className="flex gap-3 overflow-hidden pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[75%] sm:w-[45%] md:w-[31%] xl:w-[24%]"
                  >
                    <div className="rounded-xl border border-border bg-muted aspect-[4/5] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:snap-none"
              >
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 w-[75%] sm:w-[45%] md:w-[31%] xl:w-[24%] snap-center md:snap-start"
                  >
                    <ProductCardCarousel product={product} />
                  </div>
                ))}
                {displayProducts.length > 0 && !hasMore && !isLoadingMore && (
                  <div className="shrink-0 flex items-center px-3">
                    <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
                      Has visto todos los resultados
                    </span>
                  </div>
                )}
                {hasMore && (
                  <div
                    ref={sentinelRef}
                    className="shrink-0 flex items-center justify-center w-10"
                  >
                    {isLoadingMore && (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            )}
            {!showInitialLoader && (
              <div className="hidden md:flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() =>
                    scrollRef.current?.scrollBy({
                      left: -scrollRef.current.clientWidth * 0.8,
                      behavior: "smooth",
                    })
                  }
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-border/50 bg-card text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scrollRef.current?.scrollBy({
                      left: scrollRef.current.clientWidth * 0.8,
                      behavior: "smooth",
                    })
                  }
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-border/50 bg-card text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="md:hidden mt-4">
              <Link
                href={linkHref}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {linkText}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Mobile: Horizontal Scroll with Peek */}
            <div className="md:hidden flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {displayProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 w-[75%] snap-center"
                >
                  <ProductCardCarousel product={product} />
                </div>
              ))}
            </div>

            {/* Desktop: Carousel */}
            <div className="hidden md:block">
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
                <CarouselContent className="-ml-5">
                  {displayProducts.slice(0, 12).map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-5 basis-[31%] xl:basis-[24%]"
                    >
                      <ProductCardCarousel product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="!static !translate-y-0 !-translate-x-0 h-10 w-10 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground" />
                <CarouselNext className="!static !translate-y-0 !-translate-x-0 h-10 w-10 border-border/50 bg-card hover:bg-primary hover:text-primary-foreground" />
              </Carousel>
            </div>

            {/* Mobile: See all link */}
            <div className="md:hidden mt-4">
              <Link
                href={linkHref}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {linkText}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
