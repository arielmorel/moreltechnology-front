import { Metadata } from "next";
import { cache, Suspense } from "react";
import { getProductBySlug } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { ProductReviewsSection } from "@/components/product-detail/product-reviews-section";
import ProductDetailClient from "./product-detail-client";

const getProductBySlugCached = cache(getProductBySlug);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Morel Technology",
    };
  }

  const specs = [product.processor, product.ram, product.ssd].filter(s => s && s !== "N/A").join(", ");
  const shortDescription = product.description.length > 155
    ? product.description.substring(0, 152).trim() + "..."
    : product.description;

  const metaDescription = `${product.name} (${product.condition}) - ${product.brand}. ${specs}. Precio: RD$${product.price.toLocaleString("es-DO")}. Garantía certificada en República Dominicana. Morel Technology.`;

  return {
    title: `${product.name} | Morel Technology`,
    description: metaDescription.substring(0, 160),
    alternates: {
      canonical: productUrl(product.slug),
    },
    openGraph: {
      title: `${product.name} | Morel Technology RD`,
      description: shortDescription,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Morel Technology`,
      description: metaDescription.substring(0, 200),
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);

  let productId = NaN;
  if (product) {
    productId = parseInt(product.id, 10);
  }

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.images[0],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "DOP",
      availability: product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: product.condition === "Nuevo" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DO",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "350",
            currency: "DOP",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "DO",
            addressRegion: ["Distrito Nacional", "Santo Domingo"],
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "DAY",
            },
          },
        },
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "800",
            currency: "DOP",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "DO",
            addressRegion: [
              "Azua",
              "Baoruco",
              "Barahona",
              "Dajabón",
              "Duarte",
              "Elías Piña",
              "El Seibo",
              "Espaillat",
              "Independencia",
              "La Altagracia",
              "La Romana",
              "La Vega",
              "María Trinidad Sánchez",
              "Monte Cristi",
              "Monte Plata",
              "Pedernales",
              "Peravia",
              "Puerto Plata",
              "Samaná",
              "San Cristóbal",
              "San José de Ocoa",
              "San Juan",
              "San Pedro de Macorís",
              "Santiago",
              "Santiago Rodríguez",
              "Valverde",
              "Monseñor Nouel",
              "Hato Mayor",
            ],
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 2,
              maxValue: 7,
              unitCode: "DAY",
            },
          },
        },
      ],
    },
    category: product.category,
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://moreltechnologyrd.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: "https://moreltechnologyrd.com/catalogo",
      },
      ...(product ? [{
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://moreltechnologyrd.com${productUrl(product.slug)}`,
      }] : []),
    ],
  };

  return (
    <>
      {productSchema && (
        <script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient slug={slug} initialProduct={product}>
        {!isNaN(productId) && (
          <Suspense
            fallback={
              <div className="bg-card rounded-2xl p-4 mt-4 md:mt-6 shadow-sm animate-pulse">
                <div className="h-6 w-40 bg-muted rounded mb-4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            }
          >
            <ProductReviewsSection
              productId={productId}
              productName={product!.name}
              slug={slug}
            />
          </Suspense>
        )}
      </ProductDetailClient>
    </>
  );
}
