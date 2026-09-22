import { Product } from "@/lib/data";
import { ProductCarousel } from "@/components/product-carousel";

interface OffersCarouselProps {
  products: Product[];
}

export function OffersCarousel({ products }: OffersCarouselProps) {
  if (products.length === 0) return null;

  return <ProductCarousel type="offers" products={products} linkHref="/ofertas" linkText="Ver ofertas" autoRotate />;
}