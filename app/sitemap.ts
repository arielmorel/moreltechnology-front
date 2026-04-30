import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://moreltechnologyrd.com/";

  // Base pages
  const staticPages = [
    "",
    "/catalogo",
    "/ofertas",
    "/financiamiento",
    "/soporte",
    "/contacto",
    "/nosotros",
    "/envios",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Product pages
  try {
    const products = await getProducts();
    const productPages = (products as any).products.map((product: any) => ({
      url: `${baseUrl}/productos/${product.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap products:", error);
    return staticPages;
  }
}
