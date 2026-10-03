"use client";

import { useCallback } from "react";
import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { Product } from "@/lib/data";
import { ProductCarousel } from "@/components/product-carousel";

interface RelatedCarouselProps {
  category: string;
  excludeSlug?: string;
  initialProducts?: Product[];
  branch?: string;
}

export function RelatedCarousel({ category, excludeSlug, initialProducts, branch }: RelatedCarouselProps) {
  const fetchPage = useCallback(
    async (page: number) => {
      if (!category) return { products: [], total: 0 };
      const { products, total } = await getProducts(page, PAGE_SIZE_RAIL, category, branch);
      const excluded = products.filter(p => p.slug !== excludeSlug);
      return { products: excluded, total: Math.max(0, total - (products.length - excluded.length)) };
    },
    [category, excludeSlug, branch]
  );

  return (
    <div className="mt-6 md:mt-10">
      <ProductCarousel
        type="related"
        products={initialProducts ?? []}
        fetchPage={fetchPage}
        linkHref={branch ? `/catalogo/${branch}` : "/catalogo"}
        linkText="Ver catálogo"
        branch={branch}
      />
    </div>
  );
}