"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { ShoppingCart, Eye, Heart, Share2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.quantity <= 0;
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    setIsWishlisted(!isWishlisted);
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

  return (
    <Link
      href={productUrl(product.slug)}
      className={cn(
        "product-card group relative flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden",
        "hover:shadow-[0_8px_30px_-5px_rgba(0,102,204,0.3)] hover:border-blue-600 cursor-pointer hover:scale-[1.02] hover:-translate-y-1",
        "transition-all duration-500 ease-out transform-gpu min-h-[320px]",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image Container */}
      <div className="relative shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 w-full h-[200px] rounded-t-3xl">
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
              : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
          )}
          aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>

        {/* Share button - top right */}
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Compartir producto"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {product.name}
            </h3>
            {product.quantity !== null && product.quantity !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn(
                  "px-2 py-0.5 rounded font-medium border",
                  product.quantity > 10 && "bg-green-100 text-green-700 border-green-300",
                  product.quantity > 0 && product.quantity <= 10 && "bg-yellow-100 text-yellow-700 border-yellow-300",
                  product.quantity === 0 && "bg-red-100 text-red-700 border-red-300"
                )}>
                  {product.quantity.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
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
                <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
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
              <span className="text-sm text-gray-400 line-through font-normal">
                RD$ {product.originalPrice!.toLocaleString("es-DO")}
              </span>
            )}
            <span className={cn(
              "font-bold",
              hasDiscount ? "text-xl text-emerald-600" : "text-lg text-gray-900 dark:text-white"
            )}>
              RD$ {product.price.toLocaleString("es-DO")}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 opacity-90 hover:opacity-100 transition-opacity duration-300">
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
            <p className="text-sm text-gray-400 font-medium text-center py-2">Agotado</p>
          )}
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
