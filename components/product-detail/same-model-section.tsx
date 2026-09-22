import { getProducts, PAGE_SIZE_RAIL } from "@/lib/api";
import { ModelCarousel } from "@/components/model-carousel";

interface SameModelSectionProps {
  query: string;
  excludeSlug?: string;
}

export async function SameModelSection({ query, excludeSlug }: SameModelSectionProps) {
  if (!query) return null;

  const { products } = await getProducts(0, PAGE_SIZE_RAIL);
  const matched = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => p.slug !== excludeSlug);

  if (matched.length === 0) return null;

  return <ModelCarousel query={query} excludeSlug={excludeSlug} initialProducts={matched} />;
}