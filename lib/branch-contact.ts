import { branches } from "@/lib/data/branches";
import { DEFAULT_BRANCH } from "@/lib/api/config";
import { productUrl } from "@/lib/utils";

const SITE_URL = "https://moreltechnologyrd.com";

export type Branch = (typeof branches)[number];

/** The branch a product belongs to (default branch when none is given). */
export function getBranch(branchId?: string): Branch {
  return branches.find((b) => b.id === (branchId || DEFAULT_BRANCH)) ?? branches[0];
}

/** City name for display, e.g. "Santo Domingo" / "Santiago". */
export function branchCity(branch: Branch): string {
  return branch.name.replace("Sucursal ", "");
}

/**
 * WhatsApp link to the branch that has the product (not always Santo Domingo), with the
 * product name, price and link so the seller knows exactly which unit it is.
 */
export function productWhatsAppUrl(
  product: { name: string; slug: string },
  branchId?: string,
  options: { variantName?: string; price?: number } = {}
): string {
  const branch = getBranch(branchId);
  const name = options.variantName ? `${product.name} (${options.variantName})` : product.name;
  const price = options.price ? ` de RD$ ${options.price.toLocaleString("es-DO")}` : "";
  const link = `${SITE_URL}${productUrl(product.slug, branchId)}`;
  const text = `Hola, estoy interesado en la ${name}${price}. ${link}`;
  return `https://wa.me/${branch.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
