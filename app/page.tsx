import { HeroSection } from "@/components/hero-section";
import { OffersCarousel } from "@/components/offers-carousel";
import { GamingCarousel } from "@/components/gaming-carousel";
import { BlackFridayPromoBanner } from "@/components/black-friday/black-friday-promo-banner";
import { getHomeProducts } from "@/lib/api";
import { getBlackFridayState } from "@/lib/black-friday";
import { HomeSeoIntro } from "@/components/home-seo-intro";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

// Re-render at most every 30 minutes so offers, prices and the campaign banner stay
// current (without this the home was prerendered once per deploy and cached for a year).
export const revalidate = 1800;

const HOME_TITLE = "Laptops en República Dominicana con Garantía | Morel Technology";
const HOME_DESCRIPTION =
  "Laptops nuevas y usadas certificadas en RD: Lenovo, Dell y HP. Garantía escrita, financiamiento y envío a todo el país. Tiendas en Santo Domingo y Santiago.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://moreltechnologyrd.com",
    siteName: "Morel Technology",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

const HowItWorks = dynamic(() => import("@/components/how-it-works").then(m => m.HowItWorks));
const TrustSection = dynamic(() => import("@/components/trust-section").then(m => m.TrustSection));
const CategoriesSection = dynamic(() => import("@/components/categories-section").then(m => m.CategoriesSection));
const HappyClients = dynamic(() => import("@/components/happy-clients").then(m => m.HappyClients));
const HomeFAQ = dynamic(() => import("@/components/home-faq").then(m => m.HomeFAQ));
const BranchesSection = dynamic(() => import("@/components/branches-section").then(m => m.BranchesSection));
const ReviewsSection = dynamic(() => import("@/components/reviews-section").then(m => m.ReviewsSection));
const HomeProductSections = dynamic(() => import("@/components/home-product-sections").then(m => m.HomeProductSections));
const ShopByNeed = dynamic(() => import("@/components/shop-by-need").then(m => m.ShopByNeed));
const ShopByBrand = dynamic(() => import("@/components/shop-by-brand").then(m => m.ShopByBrand));
const FlashAnnouncement = dynamic(() => import("@/components/flash-announcement").then(m => m.FlashAnnouncement));

const SITE = "https://moreltechnologyrd.com";

// Shared opening hours (same as the store pages in app/tienda/[branch]).
const openingHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "09:00",
  closes: "19:00",
};

// Organization + one ElectronicsStore per branch (local SEO). The store @ids match the
// LocalBusiness schema on /tienda/<branch> so Google treats them as the same entity.
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Morel Technology",
      url: SITE,
      logo: `${SITE}/logo/moreltechnology.png`,
      description: "Tienda de laptops nuevas y usadas certificadas en República Dominicana, con garantía por escrito.",
      contactPoint: [
        { "@type": "ContactPoint", telephone: "+1-809-617-5517", contactType: "customer service", areaServed: "DO", availableLanguage: "Spanish" },
        { "@type": "ContactPoint", telephone: "+1-809-421-5517", contactType: "customer service", areaServed: "DO", availableLanguage: "Spanish" },
      ],
      sameAs: [
        "https://instagram.com/moreltechnology",
        "https://facebook.com/moreltechnology",
        "https://tiktok.com/@moreltechnology8",
      ],
    },
    {
      "@type": "ElectronicsStore",
      "@id": `${SITE}/tienda/moreltechnology#store`,
      name: "Morel Technology - Santo Domingo",
      url: `${SITE}/tienda/moreltechnology`,
      image: `${SITE}/logo/moreltechnology.png`,
      telephone: "+1-809-617-5517",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "El Edén de Villa Mella, Calle Ceuta frente a la Calle 7",
        addressLocality: "Santo Domingo",
        postalCode: "11207",
        addressCountry: "DO",
      },
      geo: { "@type": "GeoCoordinates", latitude: 18.5354915, longitude: -69.8955395 },
      openingHoursSpecification: openingHours,
      parentOrganization: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ElectronicsStore",
      "@id": `${SITE}/tienda/mts#store`,
      name: "Morel Technology - Santiago",
      url: `${SITE}/tienda/mts`,
      image: `${SITE}/logo/moreltechnology.png`,
      telephone: "+1-809-421-5517",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plaza Pamela 3, Carr. Buena Vista",
        addressLocality: "Santiago",
        postalCode: "91000",
        addressCountry: "DO",
      },
      geo: { "@type": "GeoCoordinates", latitude: 19.4804643, longitude: -70.6834893 },
      openingHoursSpecification: openingHours,
      parentOrganization: { "@id": `${SITE}/#organization` },
    },
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
        text: "La garantía de cada equipo se indica en su ficha. Por lo general, las laptops nuevas tienen 12 meses y las usadas certificadas 6 meses. Toda garantía es por escrito y cubre defectos de hardware.",
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://moreltechnologyrd.com" },
  ],
};

export default async function Home() {
  const { offers, gaming, newArrivals, featured } = await getHomeProducts();

  return (
    <>
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <FlashAnnouncement initialState={getBlackFridayState()} />
      <HeroSection />
      <OffersCarousel products={offers} />
      <div className="container mx-auto px-4 pb-2 md:px-6">
        <BlackFridayPromoBanner />
      </div>
      <GamingCarousel products={gaming} />
      <HomeProductSections
        newArrivals={newArrivals}
        featured={featured}
      />
      <CategoriesSection />
      <ShopByNeed />
      <ShopByBrand />
      <HowItWorks />
      <TrustSection />
      <HappyClients />
      <HomeFAQ />
      <HomeSeoIntro />
      <BranchesSection />
      <ReviewsSection />
    </>
  );
}
