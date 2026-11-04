import type { Product } from "@/lib/data";

export const BLACK_FRIDAY_CAMPAIGN = {
  slug: "/black-friday",
  year: 2026,
  name: "Black Friday 2026",
  title: "Black Friday 2026 en República Dominicana | MorelTechnology",
  h1: "Ofertas Black Friday 2026 en Laptops",
  startIso: "2026-11-01T00:00:00-04:00",
  endIso: "2026-11-27T23:59:59-04:00",
  startLabel: "1 de noviembre de 2026",
  endLabel: "27 de noviembre de 2026",
  timeZone: "America/Santo_Domingo",
} as const;

export type BlackFridayState = "upcoming" | "active" | "ended";

const campaignStart = new Date(BLACK_FRIDAY_CAMPAIGN.startIso).getTime();
const campaignEnd = new Date(BLACK_FRIDAY_CAMPAIGN.endIso).getTime();

export function getBlackFridayState(now: Date = new Date()): BlackFridayState {
  const timestamp = now.getTime();

  if (timestamp < campaignStart) return "upcoming";
  if (timestamp > campaignEnd) return "ended";
  return "active";
}

export function isBlackFridayActive(now: Date = new Date()): boolean {
  return getBlackFridayState(now) === "active";
}

export function getBlackFridayTargetIso(state: BlackFridayState): string | null {
  if (state === "upcoming") return BLACK_FRIDAY_CAMPAIGN.startIso;
  if (state === "active") return BLACK_FRIDAY_CAMPAIGN.endIso;
  return null;
}

export function getBlackFridayDeals(products: Product[]): Product[] {
  return products
    .filter(
      (product) =>
        product.quantity > 0 &&
        product.originalPrice !== undefined &&
        product.originalPrice > product.price
    )
    .sort(
      (a, b) =>
        (b.originalPrice! - b.price) - (a.originalPrice! - a.price)
    );
}
