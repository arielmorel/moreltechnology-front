import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { RelatedCarousel } from "@/components/product-detail/related-carousel";

interface RelatedSectionProps {
  category: string;
  excludeSlug?: string;
}

export async function RelatedSection({ category, excludeSlug }: RelatedSectionProps) {
  if (!category) return null;

  const { products } = await getProducts(0, PAGE_SIZE_RAIL, category);
  const excluded = products.filter(p => p.slug !== excludeSlug);

  if (excluded.length === 0) return null;

  return <RelatedCarousel category={category} excludeSlug={excludeSlug} initialProducts={excluded} />;
}