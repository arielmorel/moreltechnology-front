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
        "relative flex bg-white rounded-xl border border-slate-200 transition-all duration-200",
        "hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5",
        "p-3 gap-3",
        "lg:p-0 lg:gap-0",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image - Left side */}
      <div className={cn(
        "relative shrink-0 overflow-hidden bg-slate-50",
        "w-[110px] h-[110px] rounded-lg",
        "sm:w-[130px] sm:h-[130px]",
        "lg:w-[240px] lg:h-[240px] lg:rounded-l-xl lg:rounded-tr-none",
        isOutOfStock && "grayscale"
      )}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized={isMinioImage(product.images[0])}
          className="object-contain p-[6%]"
          sizes="(max-width: 640px) 110px, (max-width: 1024px) 130px, 170px"
        />
        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content - Right side */}
      <div className="flex-1 min-w-0 flex flex-col justify-between lg:py-6 lg:pr-5 lg:pl-6">
        {/* Top section */}
        <div>
          {/* Brand */}
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide font-sans">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-tight mt-0.5 font-sans">
            {product.name}
          </h3>

          {/* Specs as pills */}
          <div className="flex flex-wrap gap-1 mt-2 font-sans">
            {product.processor && product.processor !== "N/A" && (
              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.processor}
              </span>
            )}
            {product.ram && product.ram !== "N/A" && (
              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.ram}
              </span>
            )}
            {product.ssd && product.ssd !== "N/A" && (
              <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.ssd}
              </span>
            )}
          </div>

          {/* Badges row - only stock */}
          {stockLabel && (
            <div className="mt-2">
              <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200/50">
                {stockLabel}
              </span>
            </div>
          )}
        </div>

        {/* Bottom section - Price + CTA */}
        <div className="mt-2">
          {/* Price with shipping badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through font-normal font-sans">
                  RD$ {product.originalPrice!.toLocaleString("es-DO")}
                </span>
              )}
              <span className={cn(
                "font-bold font-sans",
                hasDiscount ? "text-lg text-emerald-600" : "text-base text-slate-900"
              )}>
                RD$ {product.price.toLocaleString("es-DO")}
              </span>
            </div>
            <span className="text-[9px] text-emerald-600 font-medium font-sans hidden sm:inline">
              Envío gratis
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
              className="mt-2 w-full h-8 bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold font-sans rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-none border-none outline-none"
              style={{ textShadow: 'none', fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-none">Agregar al carrito</span>
            </button>
          ) : (
            <p className="mt-2 text-xs text-slate-400 font-medium font-sans">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}
