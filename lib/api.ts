import axios from "axios";
import { Product, ProductCondition, ProductPrice } from "./data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";
const DEFAULT_BRANCH = "moreltechnology";

export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_SEARCH = 10;
export const PAGE_SIZE_ALL = 30;

function getCatalogUrl(branchId?: string): string {
  const branch = branchId || DEFAULT_BRANCH;
  return `${API_BASE_URL}/api/catalogs/${branch}/products`;
}

function getFinancingUrl(): string {
  return `${API_BASE_URL}/api/company/${DEFAULT_BRANCH}/financing/requests`;
}


export interface ApiProduct {
  id: number;
  sku: string;
  slug: string;
  imageUrl: string | null;
  imageUrls: string[] | null;
  name: string;
  description: string | null;
  priceOut: number;
  offerPrice: number;
  categoryName: string;
  details: string | null;
  quantity: number;
  warranty?: number;
  tags: string[];
  pinned: boolean;
  createdAt?: string;
  prices: {
    id: string;
    currency: string;
    priceOut: number;
    offerPrice: number | null;
    isPrimary: boolean;
    active: boolean;
  }[];
}

export interface ApiResponse {
  content: ApiProduct[];
  totalElements: number;
  totalPages: number;
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

  return {
    id: apiProduct.id.toString(),
    slug: apiProduct.slug,
    name: apiProduct.name,
    brand: brand,
    category: apiProduct.categoryName.toLowerCase() === "electronica" ? "accesorios" : apiProduct.categoryName.toLowerCase(),
    processor: parts[0] || "Consultar",
    ram: parts[1] || "N/A",
    ssd: parts[2] || "N/A",
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
  };
};

export const getProducts = async (page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string): Promise<{ products: Product[], total: number }> => {
  try {
    const params: Record<string, string | number> = { page, size };
    if (category && category !== "todas") {
      params.category = category;
    }
    if (tags) {
      params.tags = tags;
    }
    const response = await axios.get<ApiResponse>(getCatalogUrl(branchId), { params });

    return {
      products: response.data.content.map(mapApiProductToProduct),
      total: response.data.totalElements
    };
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
  try {
    const catalogUrl = getCatalogUrl(branchId);
    const response = await axios.get<ApiProduct>(`${catalogUrl}/slug/${slug}`);
    return mapApiProductToProduct(response.data);
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

export const searchProducts = async (query: string, page = 0, size = PAGE_SIZE_DEFAULT, category?: string, branchId?: string, tags?: string): Promise<{ products: Product[], total: number }> => {
  try {
    const params: Record<string, string | number> = { query, page, size };
    if (category && category !== "todas") {
      params.category = category;
    }
    if (tags) {
      params.tags = tags;
    }
    const response = await axios.get<ApiResponse>(`${getCatalogUrl(branchId)}/search`, { params });

    return {
      products: response.data.content.map(mapApiProductToProduct),
      total: response.data.totalElements
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return { products: [], total: 0 };
  }
};

export interface HomeProducts {
  offers: Product[];
  newArrivals: Product[];
  featured: Product[];
}

export const getHomeProducts = async (branchId?: string): Promise<HomeProducts> => {
  try {
    const { products } = await getProducts(0, PAGE_SIZE_ALL, undefined, branchId);

    const offers = products
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 8);

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

    return { offers, newArrivals, featured };
  } catch (error) {
    console.error("Error fetching home products:", error);
    return { offers: [], newArrivals: [], featured: [] };
  }
};

const FINANCING_API_URL = getFinancingUrl();
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN || "smartbusiness-public-web-key-2026";

export interface FinancingRequest {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  monthlyIncome: number;
  workplaceName: string;
  workplaceAddress: string;
  monthlyExpenses: number;
  productId: string;
  productName: string;
  productPrice: number;
  downPayment: number;
  termMonths: number;
}

export const createFinancingRequest = async (request: FinancingRequest): Promise<{ success: boolean; message: string }> => {
  try {
    await axios.post(FINANCING_API_URL, request, {
      headers: {
        "X-Public-App-Token": APP_TOKEN,
      },
    });
    return { success: true, message: "Solicitud enviada correctamente" };
  } catch (error) {
    console.error("Error creating financing request:", error);
    return { success: false, message: "Error al enviar la solicitud" };
  }
};
