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
  const [imageTransitionKey, setImageTransitionKey] = React.useState(0);

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
          setImageTransitionKey(prev => prev + 1);
        } else if (deltaX > 0 && activeImage > 0) {
          onActiveImageChange(activeImage - 1);
          setImageTransitionKey(prev => prev + 1);
        }
      }
    },
    [activeImage, product.images.length, onActiveImageChange]
  );

  const handleImageChange = useCallback((index: number) => {
    onActiveImageChange(index);
    setImageTransitionKey(prev => prev + 1);
  }, [onActiveImageChange]);

  return (
    <div className="space-y-3">
      {/* Main Image Container */}
      <div className="group relative">
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
          className="relative aspect-[4/3] cursor-zoom-in rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={`main-${imageTransitionKey}`}
            src={product.images[activeImage]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={isMinioImage(product.images[activeImage])}
            className="object-contain p-4 animate-fade-in hover:scale-105 transition-transform duration-300"
            priority
          />

          {/* Stock Badge - Subtle floating pill */}
          {product.quantity > 5 ? (
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md text-slate-700 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm border border-white/50">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              disponible
            </span>
          ) : product.quantity > 0 ? (
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md text-slate-700 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-sm border border-white/50">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              últimos {product.quantity}
            </span>
          ) : null}

          {/* Page Counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
              {activeImage + 1}/{product.images.length}
            </div>
          )}

          {/* Desktop Navigation Arrows - Visible on hover */}
          {product.images.length > 1 && (
            <>
              {activeImage > 0 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleImageChange(activeImage - 1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
              )}
              {activeImage < product.images.length - 1 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleImageChange(activeImage + 1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              )}
            </>
          )}

          {/* Mobile Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              {activeImage > 0 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleImageChange(activeImage - 1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md md:hidden transition-transform active:scale-95"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
              )}
              {activeImage < product.images.length - 1 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleImageChange(activeImage + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md md:hidden transition-transform active:scale-95"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              )}
            </>
          )}

          {/* Mobile Dots Indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    activeImage === idx ? "bg-white w-4" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Dialog */}
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
                handleImageChange(activeImage - 1);
              }
              if (event.key === "ArrowRight" && activeImage < product.images.length - 1) {
                handleImageChange(activeImage + 1);
              }
            }}
            tabIndex={0}
          >
            <Image
              key={`viewer-${imageTransitionKey}`}
              src={product.images[activeImage]}
              alt={product.name}
              fill
              unoptimized={isMinioImage(product.images[activeImage])}
              className={cn(
                product.images[activeImage].toLowerCase().endsWith(".png")
                  ? "object-contain bg-black/90"
                  : "object-cover",
                "p-8 sm:p-12 animate-fade-in"
              )}
              sizes="100vw"
              priority
            />
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => handleImageChange(activeImage - 1)}
                  disabled={activeImage === 0}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white transition hover:bg-white/20 disabled:opacity-30 sm:left-6"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => handleImageChange(activeImage + 1)}
                  disabled={activeImage === product.images.length - 1}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white transition hover:bg-white/20 disabled:opacity-30 sm:right-6"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white/80">
              {activeImage + 1} / {product.images.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleImageChange(idx)}
              className={cn(
                "relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white transition-all duration-200",
                activeImage === idx
                  ? "ring-2 ring-slate-900 ring-offset-2 opacity-100"
                  : "opacity-70 hover:opacity-100 border border-slate-100"
              )}
            >
              <Image
                src={img}
                alt={`${product.name} ${idx + 1}`}
                fill
                unoptimized={isMinioImage(img)}
                sizes="64px"
                className={cn(
                  img.toLowerCase().endsWith(".png")
                    ? "object-contain bg-slate-50"
                    : "object-cover"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
