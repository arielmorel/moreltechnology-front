"use client";

import { useCallback } from "react";
import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { Product } from "@/lib/data";
import { ProductCarousel } from "@/components/product-carousel";

interface ModelCarouselProps {
  query: string;
  excludeSlug?: string;
  initialProducts?: Product[];
  branch?: string;
}

export function ModelCarousel({ query, excludeSlug, initialProducts, branch }: ModelCarouselProps) {
  const fetchPage = useCallback(
    async (page: number) => {
      const { products, total } = await getProducts(page, PAGE_SIZE_RAIL, undefined, branch);
      const matched = products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .filter(p => p.slug !== excludeSlug);
      return { products: matched, total };
    },
    [query, excludeSlug, branch]
  );

  if (!query) return null;

  return (
    <div className="mt-8 md:mt-12">
      <ProductCarousel
        type="same-model"
        products={initialProducts ?? []}
        fetchPage={fetchPage}
        linkHref={`${branch ? `/catalogo/${branch}` : "/catalogo"}?query=${encodeURIComponent(query)}`}
        linkText="Ver todos"
        branch={branch}
      />
    </div>
  );
}