import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProducts } from "@/components/featured-products";
import { ReviewsSection } from "@/components/reviews-section";
import { BranchesSection } from "@/components/branches-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <BranchesSection />
      <ReviewsSection />
    </>
  );
}
