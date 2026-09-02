"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { getProducts, PAGE_SIZE_ALL } from "@/lib/api";
import { ProductCarousel } from "@/components/product-carousel";

interface AccessoriesCarouselProps {
  currentProductId?: string;
}

export function AccessoriesCarousel({ currentProductId }: AccessoriesCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccessories = async () => {
      try {
        const { products: allProducts } = await getProducts(0, PAGE_SIZE_ALL);
        const accessories = allProducts
          .filter(p =>
            p.category.toLowerCase().includes("accesorio") ||
            p.tags.some(t => t.toLowerCase().includes("accesorio"))
          )
          .filter(p => p.slug !== currentProductId)
          .slice(0, 8);
        setProducts(accessories);
      } catch (error) {
        console.error("Error loading accessories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAccessories();
  }, [currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-12 md:mt-16">
      <ProductCarousel
        type="accessories"
        products={products}
        linkHref="/catalogo?categoria=accesorios"
        linkText="Ver accesorios"
        autoRotate
      />
    </div>
  );
}
