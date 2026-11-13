import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/data/types";
import { productUrl } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { blogCategories } from "@/lib/data/blog-categories";
import { homeCategories, needsCategories } from "@/lib/data";
import { branches } from "@/lib/data/branches";
import { BLACK_FRIDAY_CAMPAIGN } from "@/lib/black-friday";

const baseUrl = "https://moreltechnologyrd.com";

// Regenerate hourly so new inventory shows up without a redeploy.
export const revalidate = 3600;

const brands = ["lenovo", "dell", "hp", "apple", "asus", "acer", "razer"];

// Landing pages by use (/laptops/gaming, /laptops/estudiantes, ...).
const useLandingPaths = Array.from(
  new Set([...homeCategories, ...needsCategories].map((c) => c.href).filter((href) => href.startsWith("/laptops/")))
);

const SITEMAP_PAGE_SIZE = 100;
// Safety cap so a misbehaving API can't make the sitemap loop forever.
const MAX_PAGES = 50;

const getValidDate = (date?: string | Date | null): Date | undefined => {
  if (!date) return undefined;
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

async function getAllBranchProducts(branchId?: string): Promise<Product[]> {
  const all: Product[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const { products, total } = await getProducts(page, SITEMAP_PAGE_SIZE, undefined, branchId);
    all.push(...products);
    if (products.length < SITEMAP_PAGE_SIZE || all.length >= total) break;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/laptops", priority: 0.9, changeFrequency: "daily" },
    { path: "/ofertas", priority: 0.9, changeFrequency: "daily" },
    ...branches.map((b) => ({ path: `/catalogo/${b.id}`, priority: 0.8, changeFrequency: "daily" as const })),
    ...branches.map((b) => ({ path: `/tienda/${b.id}`, priority: 0.8, changeFrequency: "weekly" as const })),
    { path: "/financiamiento", priority: 0.7, changeFrequency: "monthly" },
    { path: "/recomendador", priority: 0.6, changeFrequency: "monthly" },
    { path: "/envios", priority: 0.6, changeFrequency: "monthly" },
    { path: "/metodos-de-pago", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/soporte", priority: 0.5, changeFrequency: "monthly" },
    { path: "/servicios", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.5, changeFrequency: "monthly" },
    { path: "/nosotros", priority: 0.5, changeFrequency: "monthly" },
    { path: "/politicas/garantia", priority: 0.4, changeFrequency: "monthly" },
    { path: "/politicas/envios", priority: 0.3, changeFrequency: "monthly" },
    { path: "/politicas/devoluciones", priority: 0.3, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  ];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    changeFrequency,
    priority,
  }));

  const blackFridayPage: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}${BLACK_FRIDAY_CAMPAIGN.slug}`,
    lastModified: new Date(BLACK_FRIDAY_CAMPAIGN.startIso),
    changeFrequency: "daily",
    priority: 0.9,
  };

  const landingPages: MetadataRoute.Sitemap = [
    ...useLandingPaths,
    ...brands.map((brand) => `/laptops/${brand}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: getValidDate(post.updatedAt || post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // Products: every page of every branch. A product listed in more than one branch is
  // only emitted once (default branch first), so we never list duplicate URLs.
  const productPages: MetadataRoute.Sitemap = [];
  const seenSlugs = new Set<string>();
  for (const [index, branch] of branches.entries()) {
    try {
      const branchId = index === 0 ? undefined : branch.id;
      const products = await getAllBranchProducts(branchId);
      for (const product of products) {
        if (!product.slug || seenSlugs.has(product.slug)) continue;
        seenSlugs.add(product.slug);
        productPages.push({
          url: `${baseUrl}${productUrl(product.slug, branchId)}`,
          lastModified: getValidDate(product.createdAt),
          changeFrequency: "weekly",
          priority: product.quantity > 0 ? 0.7 : 0.4,
        });
      }
    } catch (error) {
      console.error(`Error generating sitemap products for branch ${branch.id}:`, error);
    }
  }

  return [
    ...staticPages,
    blackFridayPage,
    ...landingPages,
    ...blogPages,
    ...blogCategoryPages,
    ...productPages,
  ];
}
