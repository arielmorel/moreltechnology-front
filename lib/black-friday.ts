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

/**
 * One Black Friday landing per branch. Santo Domingo keeps the original
 * /black-friday URL; product links there carry no ?branch param (default catalog).
 */
export type BlackFridayBranch = {
  /** Catalog branch id (see lib/data/branches.ts). */
  branchId: string;
  /** Value for ?branch= on product/image links; undefined for the default catalog. */
  linkBranch?: string;
  path: string;
  /** Short label for the branch switcher. */
  label: string;
  city: string;
  /** Region phrase used in copy, e.g. "Santiago y el Cibao". */
  region: string;
  title: string;
  description: string;
  h1Lead: string;
  h1Tail: string;
  keywords: string[];
};

export const BLACK_FRIDAY_BRANCHES = {
  santoDomingo: {
    branchId: "moreltechnology",
    linkBranch: undefined,
    path: BLACK_FRIDAY_CAMPAIGN.slug,
    label: "Santo Domingo",
    city: "Santo Domingo",
    region: "República Dominicana",
    title: BLACK_FRIDAY_CAMPAIGN.title,
    description:
      "Descubre laptops en oferta para Black Friday 2026 en República Dominicana. Precios especiales, garantía local, financiamiento y envío a todo el país.",
    h1Lead: "Ofertas",
    h1Tail: "en Laptops",
    keywords: [
      "black friday 2026 republica dominicana",
      "black friday laptops RD",
      "laptops en oferta republica dominicana",
      "ofertas black friday santo domingo",
      "laptops baratas black friday",
      "comprar laptop black friday RD",
    ],
  },
  santiago: {
    branchId: "mts",
    linkBranch: "mts",
    path: `${BLACK_FRIDAY_CAMPAIGN.slug}/santiago`,
    label: "Santiago",
    city: "Santiago",
    region: "Santiago y el Cibao",
    title: "Black Friday 2026 en Santiago | Laptops en oferta | MorelTechnology",
    description:
      "Laptops en oferta para Black Friday 2026 en Santiago de los Caballeros. Precios especiales en nuestra sucursal de Santiago, garantía local, financiamiento y envío a todo el Cibao.",
    h1Lead: "Ofertas",
    h1Tail: "en Santiago",
    keywords: [
      "black friday santiago",
      "black friday santiago republica dominicana",
      "laptops en oferta santiago",
      "ofertas laptops santiago de los caballeros",
      "comprar laptop santiago RD",
      "laptops baratas cibao",
    ],
  },
} as const satisfies Record<string, BlackFridayBranch>;

export const BLACK_FRIDAY_BRANCH_LIST: BlackFridayBranch[] = Object.values(BLACK_FRIDAY_BRANCHES);

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
