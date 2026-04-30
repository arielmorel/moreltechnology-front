import axios from "axios";
import { Product, ProductCondition } from "./data";

//const API_URL = "https://sm.novuswise.com/api/catalogs/moreltechnology/products";
const API_URL = "http://localhost:8282/api/catalogs/moreltechnology/products";

export interface ApiProduct {
  id: number;
  sku: string;
  imageUrl: string | null;
  imageUrls: string[] | null;
  name: string;
  description: string | null;
  priceOut: number;
  offerPrice: number;
  categoryName: string;
  details: string | null;
  quantity: number;
  tags: string[];
  pinned: boolean;

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

  // Price logic: If offerPrice > 0, that's our main price and priceOut is the original
  const hasOffer = apiProduct.offerPrice > 0;
  const price = hasOffer ? apiProduct.offerPrice : apiProduct.priceOut;
  const originalPrice = hasOffer ? apiProduct.priceOut : undefined;

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
    name: apiProduct.name,
    brand: brand,
    category: apiProduct.categoryName.toLowerCase() === "electronica" ? "accesorios" : apiProduct.categoryName.toLowerCase(),
    processor: parts[0] || "Consultar",
    ram: parts[1] || "N/A",
    ssd: parts[2] || "N/A",
    price: price,
    originalPrice: originalPrice,
    condition: condition,
    images: apiProduct.imageUrls && apiProduct.imageUrls.length > 0
      ? apiProduct.imageUrls
      : [apiProduct.imageUrl || "/images/placeholder-laptop.png?q=80&w=2070&auto=format&fit=crop"],
    description: apiProduct.description || apiProduct.name,
    featured: apiProduct.pinned || false,
    tags: apiProduct.tags || [],
    quantity: apiProduct.quantity || 0,
  };
};

export const getProducts = async (page = 0, size = 20): Promise<{ products: Product[], total: number }> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      params: { page, size }
    });

    return {
      products: response.data.content.map(mapApiProductToProduct),
      total: response.data.totalElements
    };
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return { products: [], total: 0 };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      params: { page: 0, size: 200 }
    });

    const apiProduct = response.data.content.find(p => p.id.toString() === id);
    return apiProduct ? mapApiProductToProduct(apiProduct) : null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};
