export type ProductCondition = "Nuevo" | "Usado - Como Nuevo" | "Usado - Buen Estado";

export interface ProductPrice {
  currency: string;
  priceOut: number;
  offerPrice: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  processor: string;
  ram: string;
  ssd: string;
  price: number;
  originalPrice?: number;
  prices: ProductPrice[];
  condition: ProductCondition;
  images: string[];
  description: string;
  featured?: boolean;
  pinned?: boolean;
  tags: string[];
  quantity: number;
  createdAt?: string;
}

export type AppCondition = "Gratis" | "Pago";

export interface App {
  id: string;
  name: string;
  description: string;
  packageName: string;
  icon: string;
  screenshots: string[];
  category: string;
  condition: AppCondition;
  featured?: boolean;
  tags: string[];
  downloads: string;
  rating: number;
  url: string;
}
