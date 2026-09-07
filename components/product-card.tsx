"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { ShoppingCart, Eye } from "lucide-react";
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
        "group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:border-slate-300 hover:-translate-y-1",
        "lg:flex-row lg:rounded-2xl",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative shrink-0 overflow-hidden bg-slate-100",
        "w-full h-[180px]",
        "sm:h-[200px]",
        "lg:w-[260px] lg:h-[260px] lg:rounded-l-2xl lg:rounded-tr-none"
      )}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized={isMinioImage(product.images[0])}
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
        />

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md z-10">
            -{discountPercent}%
          </span>
        )}

        {/* Tags badges - top right */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 gap-3">
          <span className="text-white text-sm font-semibold flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <Eye className="w-4 h-4" />
            Ver detalle
          </span>
        </div>

        {/* Stock indicator */}
        {stockLabel && (
          <span className="absolute bottom-3 left-3 bg-amber-400 text-black text-[9px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
            {stockLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4 lg:p-5">
        {/* Top section */}
        <div>
          {/* Brand */}
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans mb-1">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug font-sans group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Specs pills */}
          <div className="flex flex-wrap gap-1 mt-2 font-sans">
            {product.processor && product.processor !== "N/A" && (
              <span className="text-[9px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.processor}
              </span>
            )}
            {product.ram && product.ram !== "N/A" && (
              <span className="text-[9px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.ram}
              </span>
            )}
            {product.ssd && product.ssd !== "N/A" && (
              <span className="text-[9px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.ssd}
              </span>
            )}
          </div>
        </div>

        {/* Bottom section - Price + CTA */}
        <div className="mt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
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
              className="w-full h-10 bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold font-sans rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4 flex-shrink-0" />
              <span>Agregar al carrito</span>
            </button>
          ) : (
            <p className="text-xs text-slate-400 font-medium font-sans text-center py-2">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}
