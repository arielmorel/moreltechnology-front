"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { ShoppingCart, Eye, Heart, Share2, ArrowRightLeft } from "lucide-react";
import { useCart } from "@/lib/store";
import { useFavorites } from "@/lib/favorites-store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl } from "@/lib/utils";
import { ProductQuickView } from "@/components/product-quick-view";

export type ProductCardView = "grid" | "list";

interface ProductCardProps {
  product: Product;
  view?: ProductCardView;
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const { addItem, compareItems, addToCompare, removeFromCompare } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isOutOfStock = product.quantity <= 0;
  const isWishlisted = isFavorite(product.id);
  const isComparing = compareItems.some(item => item.id === product.id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const stockLabel = isOutOfStock
    ? null
    : product.quantity > 10
      ? null
      : product.quantity > 0
        ? `Últimas ${product.quantity} unidades`
        : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    toast.success(isWishlisted ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}${productUrl(product.slug)}`;
    const title = product.name;
    const text = `Mira este producto: ${product.name} - RD$ ${product.price.toLocaleString("es-DO")}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        await navigator.clipboard.writeText(url);
        toast.success("Enlace copiado al portapapeles");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(product.id);
      toast.success("Eliminado de comparación");
    } else if (compareItems.length >= 3) {
      toast.error("Máximo 3 productos para comparar");
    } else {
      addToCompare(product);
      toast.success("Agregado a comparación", {
        description: product.name,
      });
    }
  };

  const discountBadge = hasDiscount ? (
    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-wide flex items-center gap-1 animate-pulse hover:animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" width="16" height="16">
        <path d="M11.251 0a.5.5 0 0 1 .416.777L9.273 4H13.5a.5.5 0 0 1 .39.812l-7.5 9.5A.5.5 0 0 1 5 13.5V8H2.5a.5.5 0 0 1-.416-.777l5.5-7.5A.5.5 0 0 1 8.5 0h2.751z"/>
      </svg>
      -{discountPercent}%
    </span>
  ) : null;

  const newBadge = !hasDiscount && product.createdAt && isNewProduct(product.createdAt) ? (
    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-wide flex items-center gap-1">
      <span className="text-xs">✨</span>
      NUEVO
    </span>
  ) : null;

  const badge = (
    <div className="absolute top-4 left-4 z-20">
      {discountBadge || newBadge}
    </div>
  );

  const wishlistButton = (
    <button
      type="button"
      onClick={handleWishlist}
      className={cn(
        "p-2 rounded-full shadow-lg transition-all duration-300",
        isWishlisted
          ? "bg-blue-600 text-white"
          : "bg-card text-foreground hover:bg-blue-600 hover:text-white"
      )}
      aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
    >
      <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
    </button>
  );

  const shareButton = (
    <button
      type="button"
      onClick={handleShare}
      className="p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-card hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Compartir producto"
    >
      <Share2 className="w-4 h-4 text-muted-foreground" />
    </button>
  );

  const compareButton = (
    <button
      type="button"
      onClick={handleCompare}
      className={cn(
        "p-2 rounded-full shadow-lg transition-all duration-300",
        isComparing
          ? "bg-violet-600 text-white"
          : "bg-card text-foreground hover:bg-violet-600 hover:text-white"
      )}
      aria-label={isComparing ? "Quitar de comparación" : "Agregar a comparación"}
      title={isComparing ? "Quitar de comparación" : "Agregar a comparación"}
    >
      <ArrowRightLeft className="w-4 h-4" />
    </button>
  );

  const quickViewButton = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-card hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Vista rápida"
      title="Vista rápida"
    >
      <Eye className="w-4 h-4 text-muted-foreground" />
    </button>
  );

  const stockLabelElement = stockLabel ? (
    <span className="absolute bottom-3 left-3 bg-amber-400 text-black text-[9px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
      {stockLabel}
    </span>
  ) : null;

  const addToCartButton = !isOutOfStock ? (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        toast.success("Agregado al carrito", {
          description: product.name,
        });
      }}
      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
      title="Agregar al carrito"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  ) : (
    <p className="text-sm text-muted-foreground font-medium text-center py-2">Agotado</p>
  );

  const specsChips = (
    <div className="flex flex-wrap gap-1.5">
      {product.processor && product.processor !== "N/A" && (
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-foreground bg-muted rounded-full">
          {product.processor}
        </span>
      )}
      {product.ram && product.ram !== "N/A" && (
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-foreground bg-muted rounded-full">
          {product.ram}
        </span>
      )}
      {product.ssd && product.ssd !== "N/A" && (
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-foreground bg-muted rounded-full">
          {product.ssd}
        </span>
      )}
    </div>
  );

  if (view === "list") {
    return (
      <Link
        href={productUrl(product.slug)}
        className={cn(
          "product-card group relative flex flex-col sm:flex-row bg-card dark:bg-card rounded-3xl shadow-sm border border-border dark:border-border overflow-hidden",
          "hover:shadow-[0_8px_30px_-5px_rgba(0,102,204,0.3)] hover:border-blue-600 cursor-pointer hover:scale-[1.01]",
          "transition-all duration-500 ease-out transform-gpu",
          isOutOfStock && "opacity-70"
        )}
      >
        {/* Image Container */}
        <div className="relative shrink-0 w-full sm:w-[220px] md:w-[260px] h-[200px] sm:h-auto bg-muted dark:bg-muted overflow-hidden rounded-t-3xl sm:rounded-t-3xl sm:rounded-l-3xl">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized={isMinioImage(product.images[0])}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 260px"
          />

          <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
            <span className="text-white text-sm font-semibold flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90">
              <Eye className="w-4 h-4 text-white" />
              Ver detalle
            </span>
          </div>

          {badge}
          {stockLabelElement}

          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            {wishlistButton}
            {shareButton}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  {product.brand}
                </span>
                {product.condition && (
                  <span className="text-[10px] font-semibold text-muted-foreground">{product.condition}</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h3>
            </div>
            <div className="flex items-baseline gap-2 shrink-0">
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through font-normal">
                  RD$ {product.originalPrice!.toLocaleString("es-DO")}
                </span>
              )}
              <span className={cn(
                "font-bold",
                hasDiscount ? "text-xl text-emerald-600" : "text-lg text-foreground dark:text-foreground"
              )}>
                RD$ {product.price.toLocaleString("es-DO")}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2 mt-2">
            {product.description || `${product.brand} - ${product.processor}`}
          </p>

          <div className="mt-3">{specsChips}</div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-[10px] font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className={cn(
                "px-2 py-0.5 rounded font-medium border",
                product.quantity > 10 && "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
                product.quantity > 0 && product.quantity <= 10 && "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30",
                product.quantity === 0 && "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
              )}>
                {isOutOfStock ? "Agotado" : `${product.quantity.toLocaleString()} disponibles`}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ProductQuickView product={product}>{quickViewButton}</ProductQuickView>
              {compareButton}
              {addToCartButton}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={productUrl(product.slug)}
      className={cn(
        "product-card group relative flex flex-col bg-card dark:bg-card rounded-3xl shadow-sm border border-border dark:border-border overflow-hidden h-full",
        "hover:shadow-[0_8px_30px_-5px_rgba(0,102,204,0.3)] hover:border-blue-600 cursor-pointer hover:scale-[1.02] hover:-translate-y-1",
        "transition-all duration-500 ease-out transform-gpu min-h-[320px]",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image Container */}
      <div className="relative shrink-0 overflow-hidden bg-muted dark:bg-muted w-full h-[200px] rounded-t-3xl">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized={isMinioImage(product.images[0])}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        />

        {/* Hover Overlay - Ver detalle */}
        <div className="absolute inset-0 bg-blue-900/80 flex flex-col items-center justify-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out z-10 gap-3">
          <span className="text-white text-lg font-semibold flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100">
            <Eye className="w-5 h-5 text-white" />
            Ver detalle
          </span>
        </div>

        {/* Discount badge - top left */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-wide flex items-center gap-1 animate-pulse hover:animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" width="16" height="16">
                <path d="M11.251 0a.5.5 0 0 1 .416.777L9.273 4H13.5a.5.5 0 0 1 .39.812l-7.5 9.5A.5.5 0 0 1 5 13.5V8H2.5a.5.5 0 0 1-.416-.777l5.5-7.5A.5.5 0 0 1 8.5 0h2.751z"/>
              </svg>
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* New product badge */}
        {!hasDiscount && product.createdAt && isNewProduct(product.createdAt) && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-wide flex items-center gap-1">
              <span className="text-xs">✨</span>
              NUEVO
            </span>
          </div>
        )}

        {/* Wishlist button - top right */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-12 z-20 p-2 rounded-full shadow-lg transition-all duration-300",
            isWishlisted
              ? "bg-blue-600 text-white"
              : "bg-card text-foreground hover:bg-blue-600 hover:text-white"
          )}
          aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>

        {/* Share button - top right */}
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-3 right-3 z-20 p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-md hover:bg-card hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Compartir producto"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Stock indicator */}
        {stockLabel && (
          <span className="absolute bottom-3 left-3 bg-amber-400 text-black text-[9px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
            {stockLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-5">
        {/* Top section */}
        <div>
          {/* Title with quantity */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </h3>
            {product.quantity !== null && product.quantity !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn(
                  "px-2 py-0.5 rounded font-medium border",
                  product.quantity > 10 && "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
                  product.quantity > 0 && product.quantity <= 10 && "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30",
                  product.quantity === 0 && "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
                )}>
                  {product.quantity.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-base text-muted-foreground dark:text-gray-300 line-clamp-2 mt-1">
            {product.description || `${product.brand} - ${product.processor}`}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-muted-foreground dark:text-gray-300 bg-muted dark:bg-muted rounded-full">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through font-normal">
                RD$ {product.originalPrice!.toLocaleString("es-DO")}
              </span>
            )}
            <span className={cn(
              "font-bold",
              hasDiscount ? "text-xl text-emerald-600" : "text-lg text-foreground dark:text-foreground"
            )}>
              RD$ {product.price.toLocaleString("es-DO")}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 opacity-90 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ProductQuickView product={product}>{quickViewButton}</ProductQuickView>
              {compareButton}
            </div>
            {!isOutOfStock ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem(product);
                  toast.success("Agregado al carrito", {
                    description: product.name,
                  });
                }}
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                title="Agregar al carrito"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            ) : (
              <p className="text-sm text-muted-foreground font-medium py-2">Agotado</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function isNewProduct(createdAt: string | Date): boolean {
  if (!createdAt) return false;
  const date = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
}
