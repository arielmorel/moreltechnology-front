import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { RelatedCarousel } from "@/components/product-detail/related-carousel";

interface RelatedSectionProps {
  category: string;
  excludeSlug?: string;
  branch?: string;
}

export async function RelatedSection({ category, excludeSlug, branch }: RelatedSectionProps) {
  if (!category) return null;

  const { products } = await getProducts(0, PAGE_SIZE_RAIL, category, branch);
  const excluded = products.filter(p => p.slug !== excludeSlug);

  if (excluded.length === 0) return null;

  return <RelatedCarousel category={category} excludeSlug={excludeSlug} initialProducts={excluded} branch={branch} />;
}