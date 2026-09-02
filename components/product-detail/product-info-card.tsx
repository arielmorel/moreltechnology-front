"use client";

import * as React from "react";
import { Product } from "@/lib/data";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Truck,
  ShoppingCart,
  Share2,
  MessageCircle,
  Monitor,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConditionGuide } from "@/components/condition-guide";
import { NotifyWhenAvailable } from "@/components/notify-when-available";

interface ProductInfoCardProps {
  product: Product;
  warrantyLabel: string;
  onAddToCart: () => void;
  onShare: () => void;
}

export function ProductInfoCard({
  product,
  warrantyLabel,
  onAddToCart,
  onShare,
}: ProductInfoCardProps) {
  return (
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
          {product.gpu && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
              <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
              <div className="min-w-0">
                <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">GPU</p>
                <p className="text-[11px] font-semibold text-slate-800 truncate">{product.gpu}</p>
              </div>
            </div>
          )}
          {product.screenSize && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              <div className="min-w-0">
                <p className="text-[8px] text-slate-400 uppercase font-bold leading-none">PANTALLA</p>
                <p className="text-[11px] font-semibold text-slate-800 truncate">{product.screenSize}</p>
              </div>
            </div>
          )}
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
          {product.quantity === 0 ? (
            <NotifyWhenAvailable productId={product.id} productName={product.name} />
          ) : (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al carrito
                </button>
                <button
                  type="button"
                  onClick={onShare}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
