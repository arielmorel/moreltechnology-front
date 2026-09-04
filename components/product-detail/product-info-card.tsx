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
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-sm space-y-5">
        {/* Title & Condition */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200/50">
              {product.condition}
            </span>
            <span className="hidden sm:inline-flex">
              <ConditionGuide />
            </span>
          </div>
          <h1 className="font-sans text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Price Block */}
        <div className="space-y-1">
          {(product.prices || []).filter(p => p.priceOut > 0).map((p) => {
            const symbol = p.currency === "USD" ? "US$" : "RD$";
            const hasDiscount = p.offerPrice != null && p.offerPrice > 0;
            const displayPrice = hasDiscount ? p.offerPrice! : p.priceOut;
            const discountPercent = hasDiscount ? Math.round(((p.priceOut - p.offerPrice!) / p.priceOut) * 100) : 0;
            return (
              <div key={p.currency} className="flex items-center gap-3 flex-wrap">
                <span className={cn(
                  "font-extrabold whitespace-nowrap",
                  p.currency === "USD" ? "text-lg text-slate-600" : "text-3xl text-slate-900",
                )}>
                  {symbol} {displayPrice.toLocaleString("es-DO")}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-normal">
                    {symbol} {p.priceOut.toLocaleString("es-DO")}
                  </span>
                )}
                {hasDiscount && p.currency !== "USD" && (
                  <span className="inline-flex items-center bg-rose-100 text-rose-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200/50">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Specs Grid */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Especificaciones</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                <Cpu className="w-4 h-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">CPU</p>
                <p className="text-xs font-semibold text-slate-800 truncate">{product.processor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                <MemoryStick className="w-4 h-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">RAM</p>
                <p className="text-xs font-semibold text-slate-800 truncate">{product.ram}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                <HardDrive className="w-4 h-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">SSD</p>
                <p className="text-xs font-semibold text-slate-800 truncate">{product.ssd}</p>
              </div>
            </div>
            {product.gpu && (
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                  <Gamepad2 className="w-4 h-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">GPU</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{product.gpu}</p>
                </div>
              </div>
            )}
            {product.screenSize && (
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                  <Monitor className="w-4 h-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">PANTALLA</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{product.screenSize}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col gap-2">
          {/* Warranty */}
          <div className="flex items-center gap-2.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Garantía de {warrantyLabel}</span>
          </div>
          {/* Shipping */}
          <div className="flex items-center gap-2.5 text-emerald-700">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium">Envío express disponible</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Desktop Buttons */}
        <div className="hidden md:flex flex-col gap-3">
          {product.quantity === 0 ? (
            <NotifyWhenAvailable productId={product.id} productName={product.name} />
          ) : (
            <>
              <button
                type="button"
                onClick={onAddToCart}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir al carrito
              </button>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/18095551234?text=${encodeURIComponent(`Hola, estoy interesado en ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onShare}
                  className="h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors flex items-center justify-center"
                  aria-label="Compartir"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
