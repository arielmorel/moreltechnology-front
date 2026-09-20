"use client";

import { useCallback } from "react";
import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { ProductCarousel } from "@/components/product-carousel";

interface ModelCarouselProps {
  query: string;
  excludeSlug?: string;
}

export function ModelCarousel({ query, excludeSlug }: ModelCarouselProps) {
  const fetchPage = useCallback(
    async (page: number) => {
      const { products, total } = await getProducts(page, PAGE_SIZE_RAIL);
      const matched = products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .filter(p => p.slug !== excludeSlug);
      return { products: matched, total };
    },
    [query, excludeSlug]
  );

  if (!query) return null;

  return (
    <div className="mt-8 md:mt-12">
      <ProductCarousel
        type="same-model"
        products={[]}
        fetchPage={fetchPage}
        linkHref={`/catalogo?query=${encodeURIComponent(query)}`}
        linkText="Ver todos"
      />
    </div>
  );
}