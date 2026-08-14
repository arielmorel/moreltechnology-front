import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { BenefitsSection } from "@/components/benefits-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProducts } from "@/components/featured-products";
import { HomeFAQ } from "@/components/home-faq";
import { BranchesSection } from "@/components/branches-section";
import { ReviewsSection } from "@/components/reviews-section";
import { CTASection } from "@/components/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
      <BenefitsSection />
      <CategoriesSection />
      <HomeFAQ />
      <BranchesSection />
      <ReviewsSection />
      <CTASection />

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué garantía tienen las laptops?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ofrecemos 6 meses de garantía en laptops usadas certificadas y 1 año en laptops nuevas. Toda garantía es por escrito y cubre defectos de hardware.",
                },
              },
              {
                "@type": "Question",
                name: "¿Puedo pagar con tarjeta de crédito o débito?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, aceptamos todas las tarjetas de crédito y débito (Visa, MasterCard, American Express). También puedes pagar en efectivo o por transferencia bancaria.",
                },
              },
              {
                "@type": "Question",
                name: "¿Hacen envíos a todo el país?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, realizamos envíos a todas las provincias de la República Dominicana a través de MetroPac, Caribe Pack y BM Cargo. En Santo Domingo y Santiago también contamos con delivery por motorizado privado.",
                },
              },
              {
                "@type": "Question",
                name: "¿Puedo financiar mi compra?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, contamos con opciones de financiamiento flexibles a través de varias entidades financieras. Solo necesitas tu cédula y comprobante de ingresos.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
