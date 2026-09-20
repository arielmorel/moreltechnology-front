"use client";

import { type ComponentType } from "react";
import { BadgePercent, Star, Gamepad2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const skeletonConfig: Record<
  string,
  { title: string; icon: ComponentType<{ className?: string }>; accent: string }
> = {
  offers: { title: "Ofertas Flash", icon: BadgePercent, accent: "text-red-600" },
  gaming: { title: "Laptops Gaming", icon: Gamepad2, accent: "text-purple-600" },
  featured: { title: "Destacados", icon: Star, accent: "text-primary" },
  "new-arrivals": { title: "Recién Llegados", icon: Clock, accent: "text-blue-600" },
};

interface ProductCarouselSkeletonProps {
  type: string;
}

export function ProductCarouselSkeleton({ type }: ProductCarouselSkeletonProps) {
  const config = skeletonConfig[type] ?? skeletonConfig.featured;
  const Icon = config.icon;

  return (
    <section className="relative overflow-hidden py-6 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-4 md:mb-10">
          <div className="min-w-0 space-y-1.5 md:space-y-2">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest md:gap-2 md:px-3 md:py-1.5 md:text-xs border-border/50 ${config.accent}`}>
              <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
              {config.title}
            </div>
            <Skeleton className="h-7 w-48 md:h-10 md:w-64" />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="mt-3 h-2.5 w-16" />
              <Skeleton className="mt-2 h-3.5 w-full" />
              <Skeleton className="mt-1.5 h-3.5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>

        <div className="md:hidden flex gap-3 overflow-hidden pb-4 -mx-4 px-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[75%] rounded-xl border border-border bg-card p-3">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="mt-3 h-2.5 w-16" />
              <Skeleton className="mt-2 h-3.5 w-full" />
              <Skeleton className="mt-1.5 h-3.5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}