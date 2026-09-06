"use client";

import { Product } from "@/lib/data";
import { ProductCarousel } from "./product-carousel";

interface HomeProductSectionsProps {
  newArrivals: Product[];
  featured: Product[];
}

export function HomeProductSections({
  newArrivals,
  featured,
}: HomeProductSectionsProps) {
  return (
    <>
      <ProductCarousel type="featured" products={featured} autoRotate />
      <ProductCarousel type="new-arrivals" products={newArrivals} autoRotate />
    </>
  );
}
