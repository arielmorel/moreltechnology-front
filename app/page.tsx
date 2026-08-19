import { HeroSection } from "@/components/hero-section";
import dynamic from "next/dynamic";
import Script from "next/script";

const HowItWorks = dynamic(() => import("@/components/how-it-works").then(m => m.HowItWorks));
const BenefitsSection = dynamic(() => import("@/components/benefits-section").then(m => m.BenefitsSection));
const TrustSection = dynamic(() => import("@/components/trust-section").then(m => m.TrustSection));
const CategoriesSection = dynamic(() => import("@/components/categories-section").then(m => m.CategoriesSection));
const HappyClients = dynamic(() => import("@/components/happy-clients").then(m => m.HappyClients));
const HomeFAQ = dynamic(() => import("@/components/home-faq").then(m => m.HomeFAQ));
const BranchesSection = dynamic(() => import("@/components/branches-section").then(m => m.BranchesSection));
const ReviewsSection = dynamic(() => import("@/components/reviews-section").then(m => m.ReviewsSection));

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Morel Technology",
  url: "https://moreltechnologyrd.com",
  logo: "https://moreltechnologyrd.com/logo/moreltechnology.png",
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
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Morel Technology",
  url: "https://moreltechnologyrd.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://moreltechnologyrd.com/catalogo?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
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
};

export default function Home() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <TrustSection />
      <CategoriesSection />
      <HappyClients />
      <HomeFAQ />
      <BranchesSection />
      <ReviewsSection />
    </>
  );
}
