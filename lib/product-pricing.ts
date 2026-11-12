import type { Product, ProductPrice, ProductVariant } from "@/lib/data";

export const DEFAULT_PRODUCT_CURRENCY = "DOP";

export interface ResolvedPrice {
  currency: string;
  price: number;
  originalPrice?: number;
}

export function resolvePriceFromList(prices: ProductPrice[] | undefined, fallback = 0): ResolvedPrice {
  const activePrices = (prices ?? []).filter((price) => price.priceOut > 0);
  const primary = activePrices.find((price) => price.currency === DEFAULT_PRODUCT_CURRENCY) ?? activePrices[0];

  if (!primary) {
    return {
      currency: DEFAULT_PRODUCT_CURRENCY,
      price: fallback,
    };
  }

  const hasOffer = primary.offerPrice != null && primary.offerPrice > 0;

  return {
    currency: primary.currency || DEFAULT_PRODUCT_CURRENCY,
    price: hasOffer ? primary.offerPrice! : primary.priceOut,
    originalPrice: hasOffer ? primary.priceOut : undefined,
  };
}

export function resolveProductPrice(product: Product, variant?: ProductVariant): ResolvedPrice {
  const prices = variant?.prices?.length ? variant.prices : product.prices;
  const resolved = resolvePriceFromList(prices, product.price);

  return {
    ...resolved,
    price: resolved.price > 0 ? resolved.price : product.price,
  };
}

export function getCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}::${variantId}` : productId;
}
