import { Metadata } from "next";
import { branches } from "@/lib/data";
import { getProducts } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import CatalogoBranchClient from "./catalogo-client";

interface PageProps {
  params: Promise<{ branch: string }>;
}

const SITE_URL = "https://moreltechnologyrd.com";

function absoluteUrl(path: string): string {
  if (!path) return `${SITE_URL}/`;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { branch } = await params;
  const branchData = branches.find(b => b.id === branch);
  const branchName = branchData ? branchData.name.replace("Sucursal ", "") : branch;

  return {
    title: `Catálogo de Laptops ${branchName} | Morel Technology`,
    description: `Explora el catálogo completo de laptops disponibles en la sucursal ${branchName} de Morel Technology. Equipos nuevos y usados con garantía.`,
    alternates: {
      canonical: `/catalogo/${branch}`,
    },
    openGraph: {
      title: `Catálogo de Laptops ${branchName} | Morel Technology`,
      description: `Explora el catálogo completo de laptops disponibles en la sucursal ${branchName} de Morel Technology.`,
    },
  };
}

export default async function CatalogoBranchPage({ params }: PageProps) {
  const { branch } = await params;
  const branchData = branches.find(b => b.id === branch);
  const branchName = branchData ? branchData.name.replace("Sucursal ", "") : branch;

  const { products, total } = await getProducts(0, 12, undefined, branch);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Catálogo de Laptops ${branchName}`,
    numberOfItems: total,
    itemListElement: products.map((product, index) => {
      const lowestOfferPrice = product.prices.length > 0
        ? Math.min(...product.prices.map(p => (p.offerPrice && p.offerPrice > 0 ? p.offerPrice : p.priceOut)))
        : product.price;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: absoluteUrl(product.images[0]),
          description: product.description,
          brand: { "@type": "Brand", name: product.brand },
          sku: product.id,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: product.prices[0]?.currency || "DOP",
            lowPrice: lowestOfferPrice,
            highPrice: product.price,
            availability: product.quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: absoluteUrl(productUrl(product.slug)),
          },
        },
      };
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/catalogo` },
      { "@type": "ListItem", position: 3, name: branchName, item: `${SITE_URL}/catalogo/${branch}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CatalogoBranchClient branch={branch} />
    </>
  );
}