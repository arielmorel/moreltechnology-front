import { Metadata } from "next";
import Script from "next/script";
import { getProducts, PAGE_SIZE_DEFAULT } from "@/lib/api";
import { TiendaSantoDomingoClient } from "@/components/tienda-santo-domingo-client";

export const metadata: Metadata = {
  title: "Tienda de Laptops en Santo Domingo | Morel Technology",
  description: "Laptops nuevas y usadas en Santo Domingo con garantía. Lenovo, Dell, HP, ASUS. Financiamiento y envío express.",
  alternates: {
    canonical: "/tienda-laptops-santo-domingo",
  },
  openGraph: {
    title: "Tienda de Laptops en Santo Domingo | Morel Technology",
    description: "Laptops nuevas y usadas con garantía en Santo Domingo. Financiamiento y envío express.",
  },
};

export default async function TiendaSantoDomingoPage() {
        const { products } = await getProducts(0, PAGE_SIZE_DEFAULT);

  return (
    <>
      <TiendaSantoDomingoClient products={products} />

      {/* LocalBusiness Schema */}
      <Script
        id="sd-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Morel Technology - Santo Domingo",
            description: "Tienda de laptops nuevas y usadas en Santo Domingo con garantía certificada",
            url: "https://moreltechnologyrd.com/tienda-laptops-santo-domingo",
            telephone: "+1-809-617-5517",
            address: {
              "@type": "PostalAddress",
              streetAddress: "El Edén de Villa Mella, Calle Ceuta frente a la Calle 7",
              addressLocality: "Santo Domingo",
              addressCountry: "DO",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 18.5354915,
              longitude: -69.8955395,
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              opens: "09:00",
              closes: "19:00",
            },
            brand: {
              "@type": "Brand",
              name: "Morel Technology",
            },
            priceRange: "$$",
          }),
        }}
      />
    </>
  );
}
