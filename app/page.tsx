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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Morel Technology",
            url: "https://moreltechnologyrd.com",
            logo: "https://moreltechnologyrd.com/morel_technology_logo.png",
            description: "Tienda de laptops nuevas y usadas en República Dominicana con garantía certificada",
            address: [
              {
                "@type": "PostalAddress",
                streetAddress: "El Edén de Villa Mella, Calle Ceuta frente a la Calle 7",
                addressLocality: "Santo Domingo",
                addressCountry: "DO",
              },
              {
                "@type": "PostalAddress",
                streetAddress: "Plaza Pamela 3, Carr. Buena Vista",
                addressLocality: "Santiago",
                addressCountry: "DO",
              },
            ],
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+1-809-617-5517",
                contactType: "customer service",
                areaServed: "DO",
                availableLanguage: "Spanish",
              },
              {
                "@type": "ContactPoint",
                telephone: "+1-809-421-5517",
                contactType: "customer service",
                areaServed: "DO",
                availableLanguage: "Spanish",
              },
            ],
            sameAs: [
              "https://instagram.com/moreltechnology",
              "https://facebook.com/moreltechnology",
              "https://tiktok.com/@moreltechnology8",
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Morel Technology",
            url: "https://moreltechnologyrd.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://moreltechnologyrd.com/catalogo?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
