import { NextRequest } from "next/server";
import { getProductBySlug, resolveBranchId } from "@/lib/api";
import { findImageByKey } from "@/lib/product-images";

// Stable, crawlable product image URLs. The bucket object key in the URL is UUID-based,
// so its content never changes and the response can be cached as immutable.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string }> }
) {
  const { slug, file } = await params;
  const branch = resolveBranchId(request.nextUrl.searchParams.get("branch"));

  const product = await getProductBySlug(slug, branch);
  const src = product ? findImageByKey(product.images, file) : undefined;
  if (!src) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(src, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Image unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
