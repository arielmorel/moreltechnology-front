import { Metadata } from "next";
import { getProductById } from "@/lib/api";
import ProductDetailClient from "./product-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado | Morel Technology",
    };
  }

  return {
    title: `${product.name} | Morel Technology`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Laptops en RD`,
      description: `Compra la laptop ${product.name} (${product.condition}) en Morel Technology. Calidad garantizada en República Dominicana.`,
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
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  return <ProductDetailClient id={id} initialProduct={product} />;
}
