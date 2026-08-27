"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
import { ProductCarousel } from "@/components/product-carousel";

export function OffersCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const { products: allProducts } = await getProducts(0, PAGE_SIZE_ALL);
        const offers = allProducts
          .filter(p => p.originalPrice && p.originalPrice > p.price)
          .slice(0, 12);
        setProducts(offers);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  if (loading || products.length === 0) return null;

  return <ProductCarousel type="offers" products={products} linkHref="/ofertas" linkText="Ver ofertas" />;
}
