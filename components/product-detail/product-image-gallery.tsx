"use client";

import * as React from "react";
import { useRef, useCallback } from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isMinioImage } from "@/lib/utils";
import { DialogContent, Dialog, DialogTitle } from "@/components/ui/dialog";

interface ProductImageGalleryProps {
  product: Product;
  activeImage: number;
  onActiveImageChange: (index: number) => void;
  isImageViewerOpen: boolean;
  onImageViewerOpenChange: (open: boolean) => void;
}

export function ProductImageGallery({
  product,
  activeImage,
  onActiveImageChange,
  isImageViewerOpen,
  onImageViewerOpenChange,
}: ProductImageGalleryProps) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0 && activeImage < product.images.length - 1) {
          onActiveImageChange(activeImage + 1);
        } else if (deltaX > 0 && activeImage > 0) {
          onActiveImageChange(activeImage - 1);
        }
      }
    },
    [activeImage, product.images.length, onActiveImageChange]
  );

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onImageViewerOpenChange(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onImageViewerOpenChange(true);
          }
        }}
        aria-label="Abrir imagen en pantalla completa"
        className="relative aspect-square cursor-zoom-in rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-muted border border-border/50 touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

        {product.quantity > 5 ? (
          <span className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            EN STOCK
          </span>
        ) : product.quantity > 0 ? (
          <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ULTIMOS {product.quantity}
          </span>
        ) : null}

        {product.images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
            {activeImage + 1}/{product.images.length}
          </div>
        )}

        {product.images.length > 1 && (
          <>
            {activeImage > 0 && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onActiveImageChange(activeImage - 1);
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
                  onActiveImageChange(activeImage + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md md:hidden transition-transform active:scale-95"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            )}
          </>
        )}

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

      <Dialog open={isImageViewerOpen} onOpenChange={onImageViewerOpenChange}>
        <DialogContent
          showCloseButton
          className="flex h-screen w-screen max-w-none items-center justify-center rounded-none border-0 bg-black/95 p-0 text-white sm:p-4 sm:max-w-none [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:bg-white/10"
        >
          <DialogTitle className="sr-only">Imagen de {product.name}</DialogTitle>
          <div
            className="absolute inset-0 flex items-center justify-center"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" && activeImage > 0) {
                onActiveImageChange(activeImage - 1);
              }
              if (event.key === "ArrowRight" && activeImage < product.images.length - 1) {
                onActiveImageChange(activeImage + 1);
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
                  onClick={() => onActiveImageChange(activeImage - 1)}
                  disabled={activeImage === 0}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30 sm:left-6"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => onActiveImageChange(activeImage + 1)}
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
              onClick={() => onActiveImageChange(idx)}
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
  );
}
