import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { getProductBySlug, resolveBranchId } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { productImageUrl } from "@/lib/product-images";
import { getApprovedReviewsCached } from "@/lib/reviews";
import { ProductReviewsSection } from "@/components/product-detail/product-reviews-section";
import { SameModelSection } from "@/components/product-detail/same-model-section";
import { AccessoriesSection } from "@/components/product-detail/accessories-section";
import { RelatedSection } from "@/components/product-detail/related-section";
import { CarouselSectionSkeleton } from "@/components/product-detail/carousel-section-skeleton";
import ProductDetailClient from "./product-detail-client";

const getProductBySlugCached = cache(getProductBySlug);

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ branch?: string | string[] }>;
}

async function resolveBranch(searchParams: PageProps["searchParams"]): Promise<string | undefined> {
  const { branch } = await searchParams;
  return resolveBranchId(typeof branch === "string" ? branch : undefined);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await resolveBranch(searchParams);
  const product = await getProductBySlugCached(slug, branch);

  if (!product) {
    // Renders app/not-found.tsx with noindex instead of an indexable "not found" page.
    notFound();
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
      canonical: productUrl(product.slug, branch),
    },
    // og:image comes from ./opengraph-image.tsx (served from our domain, 1200x630 JPEG).
    // X/Twitter falls back to og:image when twitter:image is absent.
    openGraph: {
      type: "website",
      locale: "es_DO",
      siteName: "Morel Technology",
      url: productUrl(product.slug, branch),
      title: `${product.name} | Morel Technology RD`,
      description: shortDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Morel Technology`,
      description: metaDescription.substring(0, 200),
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const branch = await resolveBranch(searchParams);
  const product = await getProductBySlugCached(slug, branch);

  if (!product) {
    notFound();
  }

  const productId = parseInt(product.id, 10);

  const modelQuery = product.name
    .replace(new RegExp(`^${product.brand}\\s+`, "i"), "")
    .trim();
  const category = product.category ?? "";

  const pageUrl = `https://moreltechnologyrd.com${productUrl(product.slug, branch)}`;

  const { reviews, averageRating, totalReviews } = !isNaN(productId)
    ? await getApprovedReviewsCached(productId)
    : { reviews: [], averageRating: 0, totalReviews: 0 };

  const reviewSchema = totalReviews > 0 && reviews.length > 0
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: totalReviews,
          bestRating: 5,
          worstRating: 1,
        },
        review: reviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.customerName },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          name: r.title || undefined,
          reviewBody: r.comment,
          datePublished: new Date(r.createdAt).toISOString().split("T")[0],
        })),
      }
    : {};

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    url: pageUrl,
    name: product.name,
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.images.map((src) => productImageUrl(product.slug, src, branch)),
    ...reviewSchema,
    offers: {
      "@type": "Offer",
      url: pageUrl,
      seller: {
        "@type": "Organization",
        name: "Morel Technology",
        url: "https://moreltechnologyrd.com",
      },
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
  };

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
        item: `https://moreltechnologyrd.com/catalogo/${branch ?? "moreltechnology"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        slug={slug}
        initialProduct={product}
        branch={branch}
        reviewsSlot={
          !isNaN(productId) ? (
            <Suspense
              fallback={
                <div className="bg-card rounded-2xl p-4 mt-4 md:mt-6 shadow-sm animate-pulse">
                  <div className="h-6 w-40 bg-muted rounded mb-4" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              }
            >
              <ProductReviewsSection productId={productId} />
            </Suspense>
          ) : null
        }
        sameModelSlot={
          <Suspense fallback={<CarouselSectionSkeleton title="Mismo modelo" />}>
            <SameModelSection query={modelQuery} excludeSlug={product.slug} branch={branch} />
          </Suspense>
        }
        accessoriesSlot={
          <Suspense fallback={<CarouselSectionSkeleton title="Accesorios" />}>
            <AccessoriesSection currentProductId={product.slug} branch={branch} />
          </Suspense>
        }
        relatedSlot={
          <Suspense fallback={<CarouselSectionSkeleton title="Relacionados" />}>
            <RelatedSection category={category} excludeSlug={product.slug} branch={branch} />
          </Suspense>
        }
      />
    </>
  );
}
