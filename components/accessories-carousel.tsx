"use client";

import { useCallback } from "react";
import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { Product } from "@/lib/data";
import { ProductCarousel } from "@/components/product-carousel";

interface AccessoriesCarouselProps {
  currentProductId?: string;
  initialProducts?: Product[];
  branch?: string;
}

export function AccessoriesCarousel({ currentProductId, initialProducts, branch }: AccessoriesCarouselProps) {
  const fetchPage = useCallback(
    async (page: number) => {
      const { products, total } = await getProducts(page, PAGE_SIZE_RAIL, "Accesorios", branch);
      const filtered = products.filter(p =>
        p.category.toLowerCase().includes("accesorio") ||
        p.tags.some(t => t.toLowerCase().includes("accesorio"))
      );
      const excluded = filtered.filter(p => p.slug !== currentProductId);
      return { products: excluded, total };
    },
    [currentProductId, branch]
  );

  return (
    <div className="mt-12 md:mt-16">
      <ProductCarousel
        type="accessories"
        products={initialProducts ?? []}
        fetchPage={fetchPage}
        linkHref={`${branch ? `/catalogo/${branch}` : "/catalogo"}?categoria=accesorios`}
        linkText="Ver accesorios"
        branch={branch}
      />
    </div>
  );
}