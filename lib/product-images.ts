import { isMinioImage } from "@/lib/utils";

const SITE_URL = "https://moreltechnologyrd.com";

// Object keys in the image bucket are UUID-based file names (e.g. C_2_IMG_<uuid>.webp).
const OBJECT_KEY_PATTERN = /^[\w.-]+\.(webp|jpe?g|png|avif|gif)$/i;

function objectKey(src: string): string | null {
  try {
    const key = new URL(src).pathname.split("/").pop() ?? "";
    return OBJECT_KEY_PATTERN.test(key) ? key : null;
  } catch {
    return null;
  }
}

/**
 * The catalog API returns presigned bucket URLs that change on every request and
 * expire after 7 days, which crawlers can't index. This maps them to a stable URL on
 * our own domain (/imagenes/productos/<slug>/<object-key>), served by the route in
 * app/imagenes/productos/[slug]/[file]/route.ts. Non-bucket URLs pass through untouched.
 */
export function productImagePath(slug: string, src: string, branch?: string): string {
  if (!src || !isMinioImage(src)) return src;
  const key = objectKey(src);
  if (!key) return src;
  const path = `/imagenes/productos/${encodeURIComponent(slug)}/${key}`;
  return branch ? `${path}?branch=${encodeURIComponent(branch)}` : path;
}

/** Absolute stable URL, for JSON-LD and other places that need a full URL. */
export function productImageUrl(slug: string, src: string, branch?: string): string {
  const path = productImagePath(slug, src, branch);
  return path.startsWith("/") ? `${SITE_URL}${path}` : path;
}

/** Finds the product image whose bucket object key matches `key`. */
export function findImageByKey(images: string[], key: string): string | undefined {
  return images.find((src) => isMinioImage(src) && objectKey(src) === key);
}
