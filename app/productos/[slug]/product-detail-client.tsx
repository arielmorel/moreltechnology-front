"use client";

import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Truck,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2
} from "lucide-react";
import { WhatsAppDropdown } from "@/components/whatsapp-dropdown";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage } from "@/lib/utils";
import { ProductCarousel } from "@/components/product-carousel";
import { AccessoriesCarousel } from "@/components/accessories-carousel";
import { ConditionGuide } from "@/components/condition-guide";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductDetailClientProps {
  slug: string;
  initialProduct: Product | null;
}

export default function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const { addItem } = useCart();

  const warrantyLabel = product?.warranty
    ? `${Math.round(product.warranty / 30)} ${Math.round(product.warranty / 30) === 1 ? "mes" : "meses"}`
    : "Certificada";

  const handleShare = async () => {
    if (!product) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${product.name} - ${product.brand}`;
    const text = `${product.name} por ${product.brand} - Disponible en Morel Technology`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        await navigator.clipboard.writeText(url);
        toast.success("¡Enlace copiado!");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("¡Enlace copiado!");
    }
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!product) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0 && activeImage < product.images.length - 1) {
        setActiveImage(prev => prev + 1);
      } else if (deltaX > 0 && activeImage > 0) {
        setActiveImage(prev => prev - 1);
      }
    }
  }, [activeImage, product]);

  useEffect(() => {
    async function loadData() {
      try {
        const currentProduct = initialProduct || await getProductBySlug(slug);

        if (!initialProduct) {
          setProduct(currentProduct);
        }

        const { products: allProducts } = await getProducts();
        const related = currentProduct
          ? allProducts.filter(p =>
              p.slug !== slug && (p.category === currentProduct.category || p.brand === currentProduct.brand)
            ).slice(0, 8)
          : [];
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug, initialProduct]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success("Producto añadido al carrito", {
        description: `${product.name} se ha agregado correctamente.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-muted rounded" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-3xl" />
              <div className="space-y-6">
                <div className="h-12 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/4 bg-muted rounded" />
                <div className="h-32 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground text-lg">Lo sentimos, el producto que buscas no existe o fue retirado.</p>
          <Button
            nativeButton={false}
            render={<Link href="/catalogo" />}
            className="rounded-full px-8"
          >
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button
            onClick={() => window.history.back()}
            className="md:hidden flex items-center gap-1 hover:text-primary transition-colors -ml-1 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo/moreltechnology" className="hover:text-primary transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsImageViewerOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsImageViewerOpen(true);
                }
              }}
              aria-label="Abrir imagen en pantalla completa"
              className="relative aspect-square cursor-zoom-in rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-muted border border-border/50 touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isMinioImage(product.images[activeImage])}
                className="object-contain p-1 sm:p-8 md:p-12"
                priority
              />


              {/* Stock Urgency Badge */}
              <div className="absolute top-6 right-6">
                {product.quantity > 5 ? (
                  <Badge className="bg-green-600/95 text-white border-green-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-900/20">
                    <span className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
                    En Stock
                  </Badge>
                ) : product.quantity > 0 ? (
                  <Badge className="bg-orange-600/95 text-white border-orange-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20">
                    <span className="w-2 h-2 bg-orange-200 rounded-full animate-pulse" />
                    ¡Solo {product.quantity} disponibles!
                  </Badge>
                ) : (
                  <Badge className="bg-red-600/95 text-white border-red-400/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-900/20">
                    <span className="w-2 h-2 bg-red-200 rounded-full" />
                    Agotado
                  </Badge>
                )}
              </div>

              {/* Navigation Arrows - Mobile */}
              {product.images.length > 1 && (
                <>
                  {activeImage > 0 && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveImage(prev => prev - 1);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg md:hidden"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {activeImage < product.images.length - 1 && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveImage(prev => prev + 1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg md:hidden"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}

              {/* Swipe Indicator - Mobile */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                  {product.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        activeImage === idx ? "bg-primary w-4" : "bg-primary/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
              <DialogContent
                showCloseButton
                className="flex h-screen w-screen max-w-none items-center justify-center rounded-none border-0 bg-black/95 p-0 text-white sm:p-4 [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/10"
              >
                <DialogTitle className="sr-only">Imagen de {product.name}</DialogTitle>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft" && activeImage > 0) {
                      setActiveImage(prev => prev - 1);
                    }
                    if (event.key === "ArrowRight" && activeImage < product.images.length - 1) {
                      setActiveImage(prev => prev + 1);
                    }
                  }}
                  tabIndex={0}
                >
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    unoptimized={isMinioImage(product.images[activeImage])}
                    className="object-contain p-8 sm:p-12"
                    sizes="100vw"
                    priority
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveImage(prev => prev - 1)}
                        disabled={activeImage === 0}
                        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30 sm:left-6"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImage(prev => prev + 1)}
                        disabled={activeImage === product.images.length - 1}
                        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30 sm:right-6"
                        aria-label="Imagen siguiente"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
                    {activeImage + 1} / {product.images.length}
                  </span>
                </div>
              </DialogContent>
            </Dialog>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                      activeImage === idx ? "border-primary shadow-lg scale-95" : "border-border/50 hover:border-primary/50"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill unoptimized={isMinioImage(img)} sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col gap-6 pb-28 md:pb-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="hidden sm:flex bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {product.condition}
                  </Badge>
                  <span className="hidden sm:inline-flex">
                    <ConditionGuide />
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Prices */}
              <div className="flex flex-col gap-1">
                {(product.prices || []).filter(p => p.priceOut > 0).map((p) => {
                  const symbol = p.currency === "USD" ? "US$" : "RD$";
                  const hasDiscount = p.offerPrice != null && p.offerPrice > 0;
                  const displayPrice = hasDiscount ? p.offerPrice! : p.priceOut;
                  return (
                    <div key={p.currency} className="flex items-baseline gap-2">
                      <span className={cn(
                        "font-bold whitespace-nowrap",
                        p.currency === "USD" ? "text-base sm:text-lg text-muted-foreground" : "text-2xl sm:text-3xl md:text-4xl text-foreground",
                        hasDiscount && "text-red-600"
                      )}>
                        {symbol} {displayPrice.toLocaleString("es-DO")}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {symbol} {p.priceOut.toLocaleString("es-DO")}
                        </span>
                      )}
                      {p.currency === "USD" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">USD</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors sm:px-2.5 sm:py-1 sm:text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Procesador</p>
                  <p className="font-bold text-xs md:text-sm break-words">{product.processor}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                  <MemoryStick className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">RAM</p>
                  <p className="font-bold text-xs md:text-sm">{product.ram}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                  <HardDrive className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Almacenamiento</p>
                  <p className="font-bold text-xs md:text-sm">{product.ssd}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-3 md:p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Garantía</p>
                  <p className="font-bold text-xs md:text-sm">{warrantyLabel}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Descripción
                <span className="w-8 h-1 bg-primary/20 rounded-full" />
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {product.description}
              </p>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-row gap-2 border-t border-border/60 bg-background/95 px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:relative md:inset-auto md:z-auto md:flex-col md:w-full md:gap-3 md:border-0 md:bg-transparent md:px-0 md:py-6 md:shadow-none">
              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2 md:gap-3"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="md:hidden">Comprar</span>
                <span className="hidden md:inline">Añadir al carrito</span>
              </Button>
              <WhatsAppDropdown
                message={`Hola, estoy interesado en la laptop ${product.name}.`}
                className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base font-semibold border-2"
                variant="outline"
              >
                <span className="md:hidden">Contactar</span>
                <span className="hidden md:inline">Contactar por WhatsApp</span>
              </WhatsAppDropdown>
              <Button
                type="button"
                variant="outline"
                onClick={handleShare}
                className="hidden h-12 flex-1 gap-2 rounded-xl border-blue-200 text-sm font-semibold text-blue-700 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white md:flex md:h-14 md:rounded-2xl md:text-base"
                aria-label="Compartir producto"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="flex h-12 w-12 shrink-0 rounded-xl border-blue-200 text-blue-700 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white md:hidden"
                aria-label="Compartir producto"
                title="Compartir"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Envío Express Disponible</p>
                <p className="text-sm text-muted-foreground">Recibe tu equipo hoy mismo en Santo Domingo y Santiago.</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-32">
            <ProductCarousel
              type="related"
              products={relatedProducts}
              linkHref="/catalogo"
              linkText="Ver todo el catálogo"
              autoRotate
            />
          </div>
        )}

        <AccessoriesCarousel currentProductId={product.slug} />
      </div>
    </div>
  );
}
