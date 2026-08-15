import { Metadata } from "next";
import Script from "next/script";
import { getProductById } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import ProductDetailClient from "./product-detail-client";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

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
      canonical: productUrl(product.id, product.name),
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
  const { id } = await params;
  const product = await getProductById(id);

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
        item: `https://moreltechnologyrd.com${productUrl(product.id, product.name)}`,
      }] : []),
    ],
  };

  return (
    <>
      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <Script
        id="product-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient id={id} initialProduct={product} />
    </>
  );
}
