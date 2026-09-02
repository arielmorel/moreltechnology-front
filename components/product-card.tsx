"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { Cpu, HardDrive, MemoryStick, ShoppingCart, ArrowRightLeft, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { cn, isMinioImage, productUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, addToCompare, removeFromCompare, compareItems } = useCart();
  const whatsappMessage = `Hola, me interesa la laptop ${product.name} que vi en la página web.`;
  const isOutOfStock = product.quantity <= 0;

  const fullName = `${product.name} ${product.description || ""}`.trim();

  const stockLabel = isOutOfStock
    ? null
    : product.quantity > 5
      ? "Stock disponible"
      : `Últimas ${product.quantity} unidades`;

  return (
    <div className={cn(
      "group/card bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col justify-between h-full",
      "hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1 hover:scale-[1.01]",
      "border-blue-100/50 bg-gradient-to-br from-white via-blue-50/10 to-white",
      isOutOfStock && "opacity-75"
    )}>
      <Link href={productUrl(product.slug)} className="flex-1 flex flex-col">
        {/* Image */}
        <div className={cn(
          "relative aspect-square w-full overflow-hidden bg-slate-100",
          isOutOfStock && "grayscale"
        )}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            unoptimized={isMinioImage(product.images[0])}
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Stock Badge */}
          {stockLabel && (
            <span className={cn(
              "absolute top-2.5 left-2.5 z-10 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm",
              product.quantity > 5
                ? "bg-emerald-50/90 text-emerald-700 border border-emerald-200/80"
                : "bg-amber-50/90 text-amber-700 border border-amber-200/80"
            )}>
              {stockLabel}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-snug h-10 mb-2" title={fullName}>
            {fullName}
          </h3>

          {/* Specs */}
          <div className="flex flex-col gap-1.5 mt-2 mb-3">
            {product.processor && product.processor !== "N/A" && (
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{product.processor}</span>
              </div>
            )}
            {product.ram && product.ram !== "N/A" && (
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <MemoryStick className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{product.ram}</span>
              </div>
            )}
            {product.ssd && product.ssd !== "N/A" && (
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{product.ssd}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Price & Actions Footer */}
      <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex flex-col gap-0.5">
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-normal">
              RD$ {product.originalPrice.toLocaleString("es-DO")}
            </span>
          )}
          <span className="font-sans text-base font-bold text-slate-900">
            RD$ {product.price.toLocaleString("es-DO")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Compare */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (compareItems.find(item => item.id === product.id)) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
                if (compareItems.length >= 3) {
                  toast.error("Máximo 3 productos para comparar");
                } else {
                  toast.success(`${product.name} añadido para comparar`);
                }
              }
            }}
            title="Comparar"
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
              "group-hover/card:shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]",
              compareItems.find(item => item.id === product.id)
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
            )}
            aria-label="Comparar producto"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Cart */}
          {!isOutOfStock && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
                toast.success(`${product.name} añadido al carrito`);
              }}
              title="Añadir al carrito"
              className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                "group-hover/card:shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]",
                "bg-slate-900 hover:bg-sky-500 text-white shadow-sm"
              )}
              aria-label="Agregar al carrito"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}

          {/* WhatsApp Contact */}
          <a
            href={`https://wa.me/18095551234?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Contactar por WhatsApp"
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
              "group-hover/card:shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]",
              "bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600"
            )}
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
