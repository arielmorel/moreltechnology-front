import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { AccessoriesCarousel } from "@/components/accessories-carousel";

interface AccessoriesSectionProps {
  currentProductId?: string;
}

export async function AccessoriesSection({ currentProductId }: AccessoriesSectionProps) {
  const { products } = await getProducts(0, PAGE_SIZE_RAIL, "Accesorios");
  const filtered = products.filter(p =>
    p.category.toLowerCase().includes("accesorio") ||
    p.tags.some(t => t.toLowerCase().includes("accesorio"))
  );
  const excluded = filtered.filter(p => p.slug !== currentProductId);

  if (excluded.length === 0) return null;

  return <AccessoriesCarousel currentProductId={currentProductId} initialProducts={excluded} />;
}