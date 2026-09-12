"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
import { ProductCarousel } from "@/components/product-carousel";

interface ModelCarouselProps {
  query: string;
  excludeSlug?: string;
}

export function ModelCarousel({ query, excludeSlug }: ModelCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products: allProducts } = await getProducts(0, PAGE_SIZE_ALL);
        const matched = allProducts
          .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
          .filter(p => p.slug !== excludeSlug)
          .slice(0, 8);
        setProducts(matched);
      } catch (error) {
        console.error("Error loading model products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [query, excludeSlug]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-8 md:mt-12">
      <ProductCarousel
        type="same-model"
        products={products}
        linkHref={`/catalogo?query=${encodeURIComponent(query)}`}
        linkText="Ver todos"
      />
    </div>
  );
}
