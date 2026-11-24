import axios from "axios";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Product } from "@/lib/data";

/**
 * Shared helpers for Open Graph images rendered with `next/og` (ImageResponse).
 *
 * Assets live in `public/og/` because the production Docker image only ships
 * `public/`, `.next/`, `content/` and `prisma/`.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
// JPEG keeps photo-based cards well under WhatsApp's ~300KB preview limit (PNG is ~500KB+).
export const OG_CONTENT_TYPE = "image/jpeg";

/**
 * Re-encodes an ImageResponse (always PNG) as JPEG. If sharp is unavailable the
 * PNG is returned unchanged so the preview still works.
 */
export async function toOgJpeg(image: Response): Promise<Response> {
  const png = Buffer.from(await image.arrayBuffer());
  try {
    const { default: sharp } = await import("sharp");
    const jpeg = await sharp(png).flatten({ background: "#ffffff" }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
  } catch (error) {
    console.error("[og] JPEG conversion failed, serving PNG:", error);
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
  }
}

export const OG_COLORS = {
  ink: "#0a0a0a",
  muted: "#52525b",
  subtle: "#a1a1aa",
  line: "#e4e4e7",
  surface: "#f4f4f5",
  brand: "#0b6cc4",
  red: "#ef4444",
  redDark: "#dc2626",
  emerald: "#059669",
  night: "#09090b",
} as const;

const OG_DIR = join(process.cwd(), "public", "og");

let fontsPromise: Promise<OgFont[]> | null = null;
let logoPromise: Promise<string | null> | null = null;

type OgFont = { name: string; data: Buffer; weight: 600 | 800; style: "normal" };

/** Geist SemiBold/ExtraBold (site font). Falls back to next/og's bundled font if missing. */
export function loadOgFonts(): Promise<OgFont[]> {
  fontsPromise ??= Promise.all([
    readFile(join(OG_DIR, "Geist-SemiBold.ttf")),
    readFile(join(OG_DIR, "Geist-ExtraBold.ttf")),
  ])
    .then(([semi, extra]) => [
      { name: "Geist", data: semi, weight: 600 as const, style: "normal" as const },
      { name: "Geist", data: extra, weight: 800 as const, style: "normal" as const },
    ])
    .catch((error) => {
      console.error("[og] Could not load fonts:", error);
      fontsPromise = null;
      return [];
    });
  return fontsPromise;
}

/** Brand logo (360px wide, transparent PNG) as a data URI. */
export function loadOgLogo(): Promise<string | null> {
  logoPromise ??= readFile(join(OG_DIR, "logo.png"))
    .then((buf) => `data:image/png;base64,${buf.toString("base64")}`)
    .catch((error) => {
      console.error("[og] Could not load logo:", error);
      logoPromise = null;
      return null;
    });
  return logoPromise;
}

// Formats the OG renderer (Satori) can embed as-is; others (webp, avif) are converted.
const NATIVE_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1200;

/**
 * Downloads a remote image and inlines it as a data URI so the OG renderer never
 * depends on the client reaching the image host (MinIO is only exposed on :9000).
 * Images are downscaled and converted to JPEG (webp/avif aren't supported by Satori).
 * Returns null on failure so the card still renders without the photo.
 *
 * Uses axios rather than fetch on purpose: Next.js instruments fetch, and an uncached
 * fetch would force the OG route to render on every request instead of revalidating.
 */
export async function fetchImageAsDataUri(url: string | undefined): Promise<string | null> {
  if (!url || !/^https?:\/\//.test(url)) return null;
  try {
    const res = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      timeout: 6000,
      maxContentLength: MAX_IMAGE_BYTES,
    });
    const type = String(res.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    const buf = Buffer.from(res.data);

    try {
      const { default: sharp } = await import("sharp");
      const jpeg = await sharp(buf)
        .rotate()
        .resize(MAX_IMAGE_SIDE, MAX_IMAGE_SIDE, { fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 85 })
        .toBuffer();
      return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    } catch (error) {
      // sharp unavailable: embed natively supported formats unchanged.
      const nativeType = type === "image/jpg" ? "image/jpeg" : type;
      if (!NATIVE_IMAGE_TYPES.includes(nativeType)) throw error;
      return `data:${nativeType};base64,${buf.toString("base64")}`;
    }
  } catch (error) {
    console.error(`[og] Could not load image ${url.split("?")[0]}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export function formatRD(value: number): string {
  return `RD$ ${Math.round(value).toLocaleString("es-DO")}`;
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export function getDiscount(product: Pick<Product, "price" | "originalPrice">) {
  const original = product.originalPrice;
  if (!original || original <= product.price) return null;
  const savings = original - product.price;
  return { original, savings, percent: Math.round((savings / original) * 100) };
}

export function productSpecs(product: Product, max = 3): string[] {
  return [product.processor, product.ram, product.ssd]
    .map((spec) => (spec || "").trim())
    .filter((spec) => spec && spec !== "N/A" && spec !== "Consultar")
    .slice(0, max)
    .map((spec) => truncate(spec, 34));
}
