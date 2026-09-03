import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/data/blog-categories";

const baseUrl = "https://moreltechnologyrd.com";

const brands = ["lenovo", "dell", "hp", "apple", "asus", "acer", "razer"];

const getValidDate = (date?: string | Date | null): Date => {
  if (!date) {
    return new Date();
  }

  const parsedDate = new Date(date);

  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    "/tienda/moreltechnology",
    "/tienda/mts",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-08-24T00:00:00Z"),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Brand pages
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/laptops/${brand}`,
    lastModified: new Date("2026-08-24T00:00:00Z"),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog pages
  const blogPages = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: getValidDate(post.updatedAt || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog category pages
  const blogCategoryPages = blogCategories.map((cat) => ({
    url: `${baseUrl}/blog?category=${cat.slug}`,
    lastModified: new Date("2026-08-24T00:00:00Z"),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Product pages
  try {
    const products = await getProducts();

    const productPages = (products as any).products.map((product: any) => ({
      url: `${baseUrl}${productUrl(product.slug)}`,
      lastModified: getValidDate(
        product.effectiveUpdatedAt || product.createdAt
      ),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...brandPages,
      ...blogPages,
      ...blogCategoryPages,
      ...productPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap products:", error);

    return [
      ...staticPages,
      ...brandPages,
      ...blogPages,
      ...blogCategoryPages,
    ];
  }
}