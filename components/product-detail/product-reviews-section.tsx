import { getApprovedReviewsCached } from "@/lib/reviews";
import { ProductReviewsSummary } from "@/components/product-detail/product-reviews-summary";

interface ProductReviewsSectionProps {
  productId: number;
}

// Review JSON-LD (aggregateRating + review) lives in the page's single Product schema,
// see app/productos/[slug]/page.tsx; this section only renders the visible summary.
export async function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { reviews, averageRating, totalReviews } = await getApprovedReviewsCached(productId);

  if (totalReviews === 0 || reviews.length === 0) return null;

  return <ProductReviewsSummary reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />;
}
