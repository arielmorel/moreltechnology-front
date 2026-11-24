import { BLACK_FRIDAY_BRANCHES } from "@/lib/black-friday";
import { OG_CONTENT_TYPE, OG_SIZE, renderBlackFridayOg } from "@/lib/og-black-friday";

export const alt = "Black Friday 2026 en Morel Technology Santiago: laptops en oferta";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Offers and prices change during the campaign; regenerate at most every 30 minutes.
export const revalidate = 1800;

export default function Image() {
  return renderBlackFridayOg(BLACK_FRIDAY_BRANCHES.santiago);
}
