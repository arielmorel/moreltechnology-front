import { Product } from "@/lib/data";
import { ProductCarousel } from "@/components/product-carousel";

interface GamingCarouselProps {
  products: Product[];
}

export function GamingCarousel({ products }: GamingCarouselProps) {
  if (products.length === 0) return null;

  return <ProductCarousel type="gaming" products={products} linkHref="/laptops/gaming" linkText="Ver laptops gaming" autoRotate />;
}