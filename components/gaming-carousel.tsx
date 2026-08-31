"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
import { ProductCarousel } from "@/components/product-carousel";

export function GamingCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGaming = async () => {
      try {
        const { products: allProducts } = await getProducts(0, PAGE_SIZE_ALL);
        const gaming = allProducts
          .filter(p =>
            p.category.toLowerCase().includes("gaming") ||
            p.tags.some(t => t.toLowerCase().includes("gaming"))
          )
          .slice(0, 12);
        setProducts(gaming);
      } catch (error) {
        console.error("Error loading gaming products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGaming();
  }, []);

  if (loading || products.length === 0) return null;

  return <ProductCarousel type="gaming" products={products} linkHref="/laptops/gaming" linkText="Ver laptops gaming" />;
}
