"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/store";
import { useFavorites } from "@/lib/favorites-store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl, rememberOrigin } from "@/lib/utils";

interface ProductCardCarouselProps {
  product: Product;
}

export function ProductCardCarousel({ product }: ProductCardCarouselProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isOutOfStock = product.quantity <= 0;
  const isWishlisted = isFavorite(product.id);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      href={productUrl(product.slug)}
      onClick={rememberOrigin}
      className={cn(
        "relative flex flex-col bg-card rounded-xl border border-border transition-all duration-200",
        "hover:shadow-lg hover:border-border hover:-translate-y-0.5",
        "p-3 gap-3",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative shrink-0 overflow-hidden bg-muted rounded-lg w-full aspect-square",
        isOutOfStock && "grayscale"
      )}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized={isMinioImage(product.images[0])}
          className="object-contain p-[8%]"
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 48vw, 31vw"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
            toast.success(isWishlisted ? "Eliminado de favoritos" : "Agregado a favoritos");
          }}
          className={cn(
            "absolute top-2 right-2 z-10 p-1.5 rounded-full shadow-md transition-all duration-200",
            isWishlisted
              ? "bg-rose-500 text-white"
              : "bg-card text-muted-foreground hover:bg-rose-500 hover:text-white"
          )}
          aria-label={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
        >
          <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide font-sans">
          {product.brand}
        </p>

        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight font-sans">
          {product.name}
        </h3>

        <div className="flex flex-wrap gap-1 font-sans">
          {product.processor && product.processor !== "N/A" && (
            <span className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {product.processor}
            </span>
          )}
          {product.ram && product.ram !== "N/A" && (
            <span className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {product.ram}
            </span>
          )}
          {product.ssd && product.ssd !== "N/A" && (
            <span className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {product.ssd}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through font-sans">
                RD$ {product.originalPrice!.toLocaleString("es-DO")}
              </span>
            )}
            <span className={cn(
              "font-bold font-sans",
              hasDiscount ? "text-base text-emerald-600" : "text-sm text-foreground"
            )}>
              RD$ {product.price.toLocaleString("es-DO")}
            </span>
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
              className="mt-2 w-full h-8 bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold font-sans rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-none">Agregar</span>
            </button>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground font-medium font-sans">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}
