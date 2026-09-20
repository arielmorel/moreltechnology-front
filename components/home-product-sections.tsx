"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import { ProductCarousel } from "./product-carousel";
import { Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeProductSectionsProps {
  newArrivals: Product[];
  featured: Product[];
}

type Tab = "featured" | "new-arrivals";

export function HomeProductSections({
  newArrivals,
  featured,
}: HomeProductSectionsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("featured");

  return (
    <div>
      <div className="flex justify-center gap-2 pt-8 md:pt-14">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold transition-all",
            activeTab === "featured"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
          )}
        >
          <Star className={cn("w-4 h-4", activeTab === "featured" ? "fill-current" : "")} />
          Destacados
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("new-arrivals")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold transition-all",
            activeTab === "new-arrivals"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
          )}
        >
          <Clock className="w-4 h-4" />
          Recién Llegados
        </button>
      </div>

      {activeTab === "featured" && (
        <ProductCarousel type="featured" products={featured} autoRotate />
      )}
      {activeTab === "new-arrivals" && (
        <ProductCarousel type="new-arrivals" products={newArrivals} autoRotate />
      )}
    </div>
  );
}