"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/data";
import { getProducts, searchProducts } from "@/lib/api";
import { BlogProductCarousel } from "@/components/blog-product-carousel";

interface BlogCatalogProductsProps {
  query?: string;
  tags?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function BlogCatalogProducts({
  query,
  tags,
  title,
  subtitle,
  limit = 4,
}: BlogCatalogProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        let result;
        if (tags) {
          result = await getProducts(0, limit, undefined, "moreltechnology", tags, "IN_STOCK");
        } else {
          result = await searchProducts(query || "", 0, limit, undefined, "moreltechnology", undefined, "IN_STOCK");
        }
        if (!cancelled) {
          setProducts(result.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [query, tags, limit]);

  if (loading) {
    return (
      <div className="my-8 rounded-2xl border border-border/50 bg-muted/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-5 w-5 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const ctaHref = tags
    ? `/catalogo/moreltechnology?tags=${encodeURIComponent(tags)}`
    : `/catalogo?search=${encodeURIComponent(query || "")}`;

  return <BlogProductCarousel products={products} title={title} subtitle={subtitle} ctaHref={ctaHref} />;
}