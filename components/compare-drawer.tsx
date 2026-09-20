"use client";

import { useCart, useCartHydrated } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { isMinioImage } from "@/lib/utils";

export function CompareDrawer() {
  const { compareItems, removeFromCompare, clearCompare } = useCart();
  const hydrated = useCartHydrated();

  if (!hydrated || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-2xl animate-slide-up">
        <div 
          className="bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-3xl p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary hidden md:block">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">Comparador</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">{compareItems.length} de 3 seleccionados</p>
              </div>
              <div className="flex -space-x-3 ml-2">
                {compareItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-background overflow-hidden bg-muted">
                      <Image src={item.images[0]} alt={item.name} fill unoptimized={isMinioImage(item.images[0])} className="object-cover" />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

<div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompare}
                className="text-muted-foreground hover:text-destructive hidden md:flex"
              >
                Limpiar
              </Button>
              
              <Link href="/comparar" className="flex-1 md:flex-none">
                <Button className="w-full md:w-auto rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20 gap-2">
                  Comparar ahora
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
