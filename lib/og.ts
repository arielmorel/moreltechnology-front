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

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * Downloads a remote image and inlines it as a data URI so the OG renderer never
 * depends on the client reaching the image host (MinIO is only exposed on :9000).
 * Returns null on failure or unsupported formats so the image still renders.
 */
export async function fetchImageAsDataUri(url: string | undefined): Promise<string | null> {
  if (!url || !/^https?:\/\//.test(url)) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!res.ok) return null;
    const type = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!SUPPORTED_IMAGE_TYPES.includes(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_IMAGE_BYTES) return null;
    return `data:${type === "image/jpg" ? "image/jpeg" : type};base64,${buf.toString("base64")}`;
  } catch (error) {
    console.error(`[og] Could not fetch image ${url}:`, error);
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
