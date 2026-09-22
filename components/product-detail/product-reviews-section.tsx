import { getApprovedReviews } from "@/app/actions/reviews";
import { ProductReviewsSummary } from "@/components/product-detail/product-reviews-summary";
import { productUrl } from "@/lib/utils";

interface ProductReviewsSectionProps {
  productId: number;
  productName: string;
  slug: string;
}

export async function ProductReviewsSection({ productId, productName, slug }: ProductReviewsSectionProps) {
  const { reviews, averageRating, totalReviews } = await getApprovedReviews(productId);

  if (totalReviews === 0 || reviews.length === 0) return null;

  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: averageRating,
    reviewCount: totalReviews,
    bestRating: 5,
    worstRating: 1,
  };

  const jsonLdReviews = reviews.map((r) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: r.customerName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: r.title || undefined,
    reviewBody: r.comment,
    datePublished: new Date(r.createdAt).toISOString().split("T")[0],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: productName,
            aggregateRating,
            review: jsonLdReviews,
            url: `https://moreltechnologyrd.com${productUrl(slug)}`,
          }),
        }}
      />
      <ProductReviewsSummary reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
    </>
  );
}