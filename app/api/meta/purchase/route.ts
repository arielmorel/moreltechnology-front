import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isMetaCapiConfigured, sendCapiEvent } from "@/lib/meta/capi";

export const runtime = "nodejs";

const itemSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().optional(),
  price: z.number().nonnegative(),
  quantity: z.number().positive(),
  currency: z.string().min(1),
});

const purchaseSchema = z.object({
  eventId: z.string().min(1).max(200),
  transactionId: z.string().min(1).max(200),
  eventSourceUrl: z.string().url().optional(),
  value: z.number().nonnegative(),
  currency: z.string().min(1).max(10),
  tax: z.number().nonnegative().optional(),
  shipping: z.number().nonnegative().optional(),
  coupon: z.string().max(100).optional(),
  items: z.array(itemSchema).min(1).max(100),
  customer: z
    .object({
      name: z.string().max(200).optional(),
      email: z.string().email().max(320).optional(),
      phone: z.string().max(50).optional(),
    })
    .optional(),
  fbp: z.string().max(500).optional(),
  fbc: z.string().max(500).optional(),
});

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;

  return timingSafeEqual(aBuffer, bBuffer);
}

function getProvidedSecret(request: Request): string | undefined {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }

  return request.headers.get("x-meta-capi-secret") ?? undefined;
}

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();

  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: Request) {
  const internalSecret = process.env.META_CAPI_INTERNAL_SECRET;

  if (!internalSecret) {
    return NextResponse.json({ error: "Meta CAPI internal secret is not configured" }, { status: 503 });
  }

  const providedSecret = getProvidedSecret(request);

  if (!providedSecret || !safeEqual(providedSecret, internalSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMetaCapiConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const body = await request.json().catch(() => null);
  const parsed = purchaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  const nameParts = data.customer?.name?.trim().split(/\s+/) ?? [];
  const contents = data.items.map((item) => ({
    id: item.item_id,
    quantity: item.quantity,
    item_price: item.price,
  }));

  const result = await sendCapiEvent({
    eventName: "Purchase",
    eventId: data.eventId,
    eventSourceUrl: data.eventSourceUrl,
    userData: {
      email: data.customer?.email,
      phone: data.customer?.phone,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" ") || undefined,
      clientIpAddress: getClientIp(request),
      clientUserAgent: request.headers.get("user-agent") ?? undefined,
      fbp: data.fbp,
      fbc: data.fbc,
    },
    customData: {
      currency: data.currency,
      value: data.value,
      order_id: data.transactionId,
      content_ids: data.items.map((item) => item.item_id),
      content_type: "product",
      contents,
      num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
      tax: data.tax,
      shipping: data.shipping,
      coupon: data.coupon,
    },
  });

  if (!result.ok) {
    console.error("[meta-capi] Purchase event failed:", result.error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
