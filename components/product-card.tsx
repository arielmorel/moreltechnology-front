"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.quantity <= 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const stockLabel = isOutOfStock
    ? null
    : product.quantity > 5
      ? null
      : `Últimas ${product.quantity} unidades`;

  return (
    <Link
      href={productUrl(product.slug)}
      className={cn(
        "flex bg-white rounded-xl border border-slate-200 transition-all duration-200",
        "hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5",
        "p-3 gap-3",
        "lg:p-0 lg:gap-0",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image - Left side */}
      <div className={cn(
        "relative shrink-0 overflow-hidden bg-slate-100",
        "w-[110px] h-[110px] rounded-lg",
        "sm:w-[130px] sm:h-[130px]",
        "lg:w-[170px] lg:h-full lg:rounded-l-xl lg:rounded-tr-none",
        isOutOfStock && "grayscale"
      )}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized={isMinioImage(product.images[0])}
          className="object-contain p-1"
          sizes="(max-width: 640px) 110px, (max-width: 1024px) 130px, 170px"
        />
        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content - Right side */}
      <div className="flex-1 min-w-0 flex flex-col justify-between lg:py-3 lg:pr-3 lg:pl-4">
        {/* Top section */}
        <div>
          {/* Brand */}
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-tight mt-0.5">
            {product.name}
          </h3>

          {/* Specs inline */}
          <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mt-1.5 text-[10px] text-slate-500">
            {product.processor && product.processor !== "N/A" && (
              <span>{product.processor}</span>
            )}
            {product.ram && product.ram !== "N/A" && (
              <>
                <span className="text-slate-300">|</span>
                <span>{product.ram}</span>
              </>
            )}
            {product.ssd && product.ssd !== "N/A" && (
              <>
                <span className="text-slate-300">|</span>
                <span>{product.ssd}</span>
              </>
            )}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {/* Stock badge */}
            {stockLabel && (
              <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200/50">
                {stockLabel}
              </span>
            )}
            {/* Offer badge */}
            {hasDiscount && (
              <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium border border-rose-200/50">
                Oferta
              </span>
            )}
            {/* Shipping badge */}
            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200/50">
              Envío gratis
            </span>
            {/* Condition badge */}
            {product.condition === "Nuevo" && (
              <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200/50">
                Nuevo
              </span>
            )}
          </div>
        </div>

        {/* Bottom section - Price + CTA */}
        <div className="mt-2">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-normal">
                RD$ {product.originalPrice!.toLocaleString("es-DO")}
              </span>
            )}
            <span className="text-base font-bold text-slate-900">
              RD$ {product.price.toLocaleString("es-DO")}
            </span>
          </div>

          {/* Add to cart button */}
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
              className="mt-2 w-full h-8 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Agregar al carrito
            </button>
          ) : (
            <p className="mt-2 text-xs text-slate-400 font-medium">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}
