"use client";

import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/api";
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
  Share2,
  MessageCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage } from "@/lib/utils";
import { ProductCarousel } from "@/components/product-carousel";
import { AccessoriesCarousel } from "@/components/accessories-carousel";
import { ConditionGuide } from "@/components/condition-guide";
import { ProductReviewForm } from "@/components/product-review-form";
import { getApprovedReviews } from "@/app/actions/reviews";
import { DialogContent } from "@/components/ui/dialog";
import {
  Dialog,
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
  const [reviewsData, setReviewsData] = useState({
    reviews: [] as Array<{
      id: string;
      customerName: string;
      rating: number;
      title: string | null;
      comment: string;
      verifiedPurchase: boolean;
      createdAt: Date;
    }>,
    averageRating: 0,
    totalReviews: 0,
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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

        if (currentProduct) {
          const productId = parseInt(currentProduct.id, 10);
          if (!isNaN(productId)) {
            const reviews = await getApprovedReviews(productId);
            setReviewsData(reviews);
          }
        }
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
      <div className="container mx-auto px-3 md:px-6">
        {/* Breadcrumbs - Ultra Compact */}
        <nav className="flex items-center gap-1 text-[10px] text-slate-400 mb-3 md:mb-4">
          <button
            onClick={() => window.history.back()}
            className="md:hidden flex items-center hover:text-slate-900 transition-colors -ml-1 shrink-0"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <Link href="/" className="hover:text-slate-900 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo/moreltechnology" className="hover:text-slate-900 transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-[120px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
          {/* Left Column: Image */}
          <div className="space-y-2">
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
              // className="relative w-full aspect-[4/3] md:aspect-square max-h-[300px] md:max-h-none rounded-2xl overflow-hidden bg-white shadow-sm touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isMinioImage(product.images[activeImage])}
                className="object-contain p-4"
                priority
              />

              {/* Stock Badge */}
              {product.quantity > 5 ? (
                <span className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  EN STOCK
                </span>
              ) : product.quantity > 0 ? (
                <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  ULTIMOS {product.quantity}
                </span>
              ) : null}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {activeImage + 1}/{product.images.length}
                </div>
              )}

              {/* Navigation Arrows - Mobile */}
              {product.images.length > 1 && (
                <>
                  {activeImage > 0 && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveImage(prev => prev - 1);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md md:hidden transition-transform active:scale-95"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-700" />
                    </button>
                  )}
                  {activeImage < product.images.length - 1 && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveImage(prev => prev + 1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md md:hidden transition-transform active:scale-95"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-700" />
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
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white",
                      activeImage === idx ? "border-slate-900 shadow-sm" : "border-slate-100 hover:border-slate-300"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill unoptimized={isMinioImage(img)} sizes="48px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info Card */}
          <div className="px-3 md:px-0 mt-3 md:mt-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-sm space-y-4">
              {/* Title & Condition */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {product.condition}
                  </span>
                  <span className="hidden sm:inline-flex">
                    <ConditionGuide />
                  </span>
                </div>
                <h1 className="font-sans text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-2 flex-wrap">
                {(product.prices || []).filter(p => p.priceOut > 0).map((p) => {
                  const symbol = p.currency === "USD" ? "US$" : "RD$";
                  const hasDiscount = p.offerPrice != null && p.offerPrice > 0;
                  const displayPrice = hasDiscount ? p.offerPrice! : p.priceOut;
                  const discountPercent = hasDiscount ? Math.round(((p.priceOut - p.offerPrice!) / p.priceOut) * 100) : 0;
                  return (
                    <div key={p.currency} className="flex items-baseline gap-1.5 flex-wrap">
                      <span className={cn(
                        "font-bold whitespace-nowrap",
                        p.currency === "USD" ? "text-xs text-slate-500" : "text-xl font-bold text-slate-900",
                      )}>
                        {symbol} {displayPrice.toLocaleString("es-DO")}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {symbol} {p.priceOut.toLocaleString("es-DO")}
                        </span>
                      )}
                      {hasDiscount && p.currency !== "USD" && (
                        <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">CPU</p>
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{product.processor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <MemoryStick className="w-3.5 h-3.5 text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">RAM</p>
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{product.ram}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">SSD</p>
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{product.ssd}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">GARANTÍA</p>
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{warrantyLabel}</p>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-2.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-[11px] font-semibold text-emerald-800">Envío Express Disponible</p>
                  <p className="text-[9px] text-emerald-600">Recibe tu equipo hoy en Santo Domingo y Santiago</p>
                </div>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.quantity === 0 ? "Agotado" : "Añadir al carrito"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors flex items-center justify-center"
                    aria-label="Compartir"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <a
                  href={`https://wa.me/18095551234?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contactar por WhatsApp
                </a>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mt-3 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Descripción</h3>
              <p className={cn(
                "font-sans text-[11px] text-slate-600 leading-relaxed whitespace-pre-line",
                !isDescriptionExpanded && "line-clamp-3"
              )}>
                {product.description}
              </p>
              {product.description.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-[10px] font-semibold text-slate-900 mt-2 hover:underline"
                >
                  {isDescriptionExpanded ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accessories Carousel */}
        <div className="mt-8 md:mt-12">
          <AccessoriesCarousel currentProductId={product.slug} />
        </div>

        {/* Reviews Summary Card */}
        {reviewsData.totalReviews > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reseñas</h3>
              <span className="text-[10px] text-slate-500">{reviewsData.totalReviews} opiniones</span>
            </div>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{reviewsData.averageRating.toFixed(1)}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3 h-3",
                        star <= Math.round(reviewsData.averageRating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviewsData.reviews.filter(r => Math.round(r.rating) === rating).length;
                  const percentage = (count / reviewsData.totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-400 w-2">{rating}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keyword Filters */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["Pantalla", "Batería", "Rápido", "Calidad", "precio"].map((keyword) => (
                <button
                  key={keyword}
                  className="text-[9px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors capitalize"
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* Key Reviews Preview */}
            <div className="space-y-3">
              {reviewsData.reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                      {review.customerName?.charAt(0) || "?"}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">{review.customerName || "Anónimo"}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-2.5 h-2.5",
                            star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Write Review CTA */}
            <button
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Escribir una reseña
            </button>
          </div>
        )}

        {/* Review Form */}
        <div id="review-form" className="mt-6 scroll-mt-20">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <ProductReviewForm productId={parseInt(product.id, 10)} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 md:mt-12">
            <ProductCarousel
              type="related"
              products={relatedProducts}
              linkHref="/catalogo"
              linkText="Ver catálogo"
            />
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 py-2 px-3 shadow-lg flex items-center justify-between gap-2 md:hidden">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">Precio</span>
          <span className="text-sm font-bold text-slate-900">
            RD$ {(product.prices?.[0]?.offerPrice || product.prices?.[0]?.priceOut || product.price).toLocaleString("es-DO")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {product.quantity === 0 ? "Agotado" : "Agregar"}
          </button>
          <a
            href={`https://wa.me/18095551234?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
