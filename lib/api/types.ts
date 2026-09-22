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
  variants?: {
    id: string;
    name: string;
    sku: string;
    priceOut: number;
    offerPrice: number | null;
    defaultVariant: boolean;
    active: boolean;
    prices: {
      id: string;
      currency: string;
      priceOut: number;
      offerPrice: number | null;
      isPrimary: boolean;
      active: boolean;
    }[];
  }[];
}

export interface ApiResponse {
  content: ApiProduct[];
  totalElements: number;
  totalPages: number;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: "STRING" | "INTEGER" | "DECIMAL" | "BOOLEAN" | "JSON";
  category: "APPEARANCE" | "SEO" | "ANALYTICS" | "CATALOG" | "COMMERCE" | "SYSTEM" | "GENERAL";
  description: string | null;
  createdAt: string;
  updatedAt: string;
}