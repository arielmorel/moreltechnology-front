import axios from "axios";
import { Product, ProductCondition, ProductPrice, ProductVariant } from "../data";
import { ApiProduct, ApiResponse } from "./types";
import { getCatalogUrl } from "./config";

export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_SEARCH = 10;
export const PAGE_SIZE_ALL = 30;
export const PAGE_SIZE_RAIL = 8;

type CachedProductDetail = { product: Product; timestamp: number };

const PRODUCT_DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;
const productDetailCache = new Map<string, CachedProductDetail>();

function getCachedProductDetail(key: string): Product | null {
  const hit = productDetailCache.get(key);
  if (hit && Date.now() - hit.timestamp < PRODUCT_DETAIL_CACHE_TTL_MS) return hit.product;
  return null;
}

function setCachedProductDetail(key: string, product: Product): void {
  if (productDetailCache.size > 300) {
    const oldest = productDetailCache.entries().next().value;
    if (oldest) productDetailCache.delete(oldest[0]);
  }
  productDetailCache.set(key, { product, timestamp: Date.now() });
}

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const desc = apiProduct.description || "";
  const name = apiProduct.name.toLowerCase();

  // Try to extract specs from description (Pattern: "Processor | RAM | SSD")
  const parts = desc.split("|").map(p => p.trim());

  // Brand extraction logic
  let brand = "Morel";
  if (name.includes("lenovo")) brand = "Lenovo";
  else if (name.includes("dell")) brand = "Dell";
  else if (name.includes("hp")) brand = "HP";
  else if (name.includes("apple") || name.includes("macbook")) brand = "Apple";
  else if (name.includes("asus")) brand = "ASUS";
  else if (name.includes("acer")) brand = "Acer";
  else if (name.includes("razer")) brand = "Razer";
  else if (name.includes("msi")) brand = "MSI";

  const productPrices: ProductPrice[] = (apiProduct.prices || [])
    .filter(p => p.active)
    .map(p => ({
      currency: p.currency,
      priceOut: p.priceOut,
      offerPrice: p.offerPrice,
    }));

  const dopPrice = productPrices.find(p => p.currency === "DOP");
  const usdPrice = productPrices.find(p => p.currency === "USD");
  const primaryPrice = dopPrice || usdPrice;

  const price = primaryPrice ? (primaryPrice.offerPrice && primaryPrice.offerPrice > 0 ? primaryPrice.offerPrice : primaryPrice.priceOut) : apiProduct.priceOut;
  const originalPrice = primaryPrice && primaryPrice.offerPrice && primaryPrice.offerPrice > 0 ? primaryPrice.priceOut : undefined;

  // Condition detection
  let condition: ProductCondition = "Nuevo";
  if (desc.toLowerCase().includes("usado") || apiProduct.name.toLowerCase().includes("usado")) {
    condition = "Usado - Buen Estado";
  } else if (apiProduct.categoryName.toLowerCase() === "laptop" && price < 25000) {
    // Heuristic: cheap laptops (in RD$) are usually used
    condition = "Usado - Como Nuevo";
  }

  const mappedVariants: ProductVariant[] | undefined = apiProduct.variants
    ?.filter(v => v.active)
    .map(v => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      prices: (v.prices || [])
        .filter(p => p.active)
        .map(p => ({
          currency: p.currency,
          priceOut: p.priceOut,
          offerPrice: p.offerPrice,
        })),
      defaultVariant: v.defaultVariant,
      active: v.active,
    }));

  return {
    id: apiProduct.id.toString(),
    slug: apiProduct.slug,
    name: apiProduct.name,
    brand: brand,
    category: apiProduct.categoryName.toLowerCase() === "electronica" ? "accesorios" : apiProduct.categoryName.toLowerCase(),
    processor: parts[0] || "Consultar",
    ram: parts[1] || "N/A",
    ssd: parts[2] || "N/A",
    gpu: parts[3] || undefined,
    screenSize: parts[4] || undefined,
    price: price,
    originalPrice: originalPrice,
    prices: productPrices,
    condition: condition,
    images: apiProduct.imageUrls && apiProduct.imageUrls.length > 0
      ? apiProduct.imageUrls
      : [apiProduct.imageUrl || "/images/placeholder-laptop.png"],
    description: apiProduct.description || apiProduct.name,
    featured: apiProduct.pinned || false,
    pinned: apiProduct.pinned || false,
    tags: apiProduct.tags || [],
    quantity: apiProduct.quantity || 0,
    warranty: apiProduct.warranty,
    createdAt: apiProduct.createdAt,
    variants: mappedVariants && mappedVariants.length > 0 ? mappedVariants : undefined,
  };
};

export type AvailabilityFilter = "IN_STOCK" | "OUT_OF_STOCK" | "ALL";
export type SortFilter = "price_asc" | "price_desc" | "newest";

type CachedPage = { products: Product[]; total: number; timestamp: number };

const CACHE_TTL_MS = 5 * 60 * 1000;
const pageCache = new Map<string, CachedPage>();

function pageCacheKey(prefix: string, page: number, size: number, category?: string, branchId?: string, tags?: string, availability?: AvailabilityFilter, sort?: SortFilter, query?: string): string {
  return [prefix, page, size, category ?? "", branchId ?? "", tags ?? "", availability ?? "", sort ?? "", query ?? ""].join("|");
}

function getCachedPage(key: string): CachedPage | null {
  const hit = pageCache.get(key);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL_MS) return hit;
  return null;
}

function setCachedPage(key: string, result: { products: Product[]; total: number }): void {
  if (pageCache.size > 500) {
    const oldest = pageCache.entries().next().value;
    if (oldest) pageCache.delete(oldest[0]);
  }
  pageCache.set(key, { ...result, timestamp: Date.now() });
}

export function getCachedProducts(page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string, availability?: AvailabilityFilter, sort?: SortFilter): { products: Product[]; total: number } | null {
  return getCachedPage(pageCacheKey("p", page, size, category, branchId, tags, availability, sort));
}

export function getCachedSearch(query: string, page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string, availability?: AvailabilityFilter, sort?: SortFilter): { products: Product[]; total: number } | null {
  return getCachedPage(pageCacheKey("s", page, size, category, branchId, tags, availability, sort, query));
}

export const getProducts = async (page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string, availability?: AvailabilityFilter, sort?: SortFilter): Promise<{ products: Product[], total: number }> => {
  const key = pageCacheKey("p", page, size, category, branchId, tags, availability, sort);
  const cached = getCachedPage(key);
  if (cached) {
    return { products: cached.products, total: cached.total };
  }
  try {
    const params: Record<string, string | number> = { page, size };
    if (category && category !== "todas") {
      params.category = category;
    }
    if (tags) {
      params.tags = tags;
    }
    if (availability) {
      params.availability = availability;
    }
    if (sort) {
      params.sort = sort;
    }
    const response = await axios.get<ApiResponse>(getCatalogUrl(branchId), { params });

    const result = {
      products: response.data.content.map(mapApiProductToProduct),
      total: response.data.totalElements
    };
    setCachedPage(key, result);
    return result;
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return { products: [], total: 0 };
  }
};

export const getProductById = async (id: string, branchId?: string): Promise<Product | null> => {
  try {
    const catalogUrl = getCatalogUrl(branchId);
    const response = await axios.get<ApiProduct>(`${catalogUrl}/${id}`);
    return mapApiProductToProduct(response.data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const getProductBySlug = async (slug: string, branchId?: string): Promise<Product | null> => {
  const key = `${branchId ?? ""}|${slug}`;
  const cached = getCachedProductDetail(key);
  if (cached) return cached;
  try {
    const catalogUrl = getCatalogUrl(branchId);
    const response = await axios.get<ApiProduct>(`${catalogUrl}/slug/${slug}`);
    const product = mapApiProductToProduct(response.data);
    setCachedProductDetail(key, product);
    return product;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
};

export const getProductsByBrand = async (brand: string, branchId?: string): Promise<Product[]> => {
  try {
    const catalogUrl = getCatalogUrl(branchId);
    const response = await axios.get<ApiResponse>(`${catalogUrl}/search`, {
      params: { page: 0, size: PAGE_SIZE_DEFAULT, query: brand }
    });

    return response.data.content
      .map(mapApiProductToProduct)
      .filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  } catch (error) {
    console.error(`Error fetching products for brand ${brand}:`, error);
    return [];
  }
};

export const searchProducts = async (query: string, page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string, availability?: AvailabilityFilter, sort?: SortFilter): Promise<{ products: Product[], total: number }> => {
  const key = pageCacheKey("s", page, size, category, branchId, tags, availability, sort, query);
  const cached = getCachedPage(key);
  if (cached) {
    return { products: cached.products, total: cached.total };
  }
  try {
    const params: Record<string, string | number> = { query, page, size };
    if (category && category !== "todas") {
      params.category = category;
    }
    if (tags) {
      params.tags = tags;
    }
    if (availability) {
      params.availability = availability;
    }
    if (sort) {
      params.sort = sort;
    }
    const response = await axios.get<ApiResponse>(`${getCatalogUrl(branchId)}/search`, { params });

    const result = {
      products: response.data.content.map(mapApiProductToProduct),
      total: response.data.totalElements
    };
    setCachedPage(key, result);
    return result;
  } catch (error) {
    console.error("Error searching products:", error);
    return { products: [], total: 0 };
  }
};

export interface HomeProducts {
  offers: Product[];
  gaming: Product[];
  newArrivals: Product[];
  featured: Product[];
}

export const getHomeProducts = async (branchId?: string): Promise<HomeProducts> => {
  try {
    const { products } = await getProducts(0, PAGE_SIZE_ALL, undefined, branchId);

    const offers = products
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 12);

    const gaming = products
      .filter(p =>
        p.category.toLowerCase().includes("gaming") ||
        p.tags.some(t => t.toLowerCase().includes("gaming"))
      )
      .slice(0, 12);

    const featured = products
      .filter(p => p.pinned === true)
      .slice(0, 8);

    const newArrivals = [...products]
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      })
      .slice(0, 8);

    return { offers, gaming, newArrivals, featured };
  } catch (error) {
    console.error("Error fetching home products:", error);
    return { offers: [], gaming: [], newArrivals: [], featured: [] };
  }
};