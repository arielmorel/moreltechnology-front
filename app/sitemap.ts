import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { productUrl } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/data/blog-categories";

const baseUrl = "https://moreltechnologyrd.com";

const brands = ["lenovo", "dell", "hp", "apple", "asus", "acer", "razer"];

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
    lastModified: "2026-08-24",
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Brand pages
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/laptops/${brand}`,
    lastModified: "2026-08-24",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog pages
  const blogPages = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog category pages
  const blogCategoryPages = blogCategories.map((cat) => ({
    url: `${baseUrl}/blog?category=${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Product pages
  try {
    const products = await getProducts();
    const productPages = (products as any).products.map((product: any) => ({
      url: `${baseUrl}${productUrl(product.slug)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...brandPages, ...blogPages, ...blogCategoryPages, ...productPages];
  } catch (error) {
    console.error("Error generating sitemap products:", error);
    return [...staticPages, ...brandPages, ...blogPages, ...blogCategoryPages];
  }
}
