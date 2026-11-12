import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { isMetaCapiConfigured, sendCapiEvent } from "@/lib/meta/capi";

export const runtime = "nodejs";

const itemSchema = z.object({
  item_id: z.string().min(1),
  item_name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().positive(),
  currency: z.string().min(1),
});

const leadSchema = z.object({
  eventId: z.string().min(1).max(200),
  eventName: z.literal("Lead").optional(),
  eventSourceUrl: z.string().url().optional(),
  orderId: z.string().max(200).optional(),
  leadType: z.string().max(50).optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).optional(),
  items: z.array(itemSchema).max(100).optional(),
  customer: z
    .object({
      name: z.string().max(200).optional(),
      email: z.string().email().max(320).optional(),
      phone: z.string().max(50).optional(),
    })
    .optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
  fbp: z.string().max(500).optional(),
  fbc: z.string().max(500).optional(),
});

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();

  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: Request) {
  if (!isMetaCapiConfigured()) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const ip = getClientIp(request) ?? "unknown";
  const rateLimit = checkRateLimit(`meta-lead:${ip}`, 20, 60_000);

  if (!rateLimit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  const items = data.items ?? [];
  const nameParts = data.customer?.name?.trim().split(/\s+/) ?? [];
  const currency = data.currency ?? items[0]?.currency ?? "DOP";
  const value =
    data.value ??
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const customData = {
    ...data.customData,
    currency,
    value,
    order_id: data.orderId,
    lead_type: data.leadType ?? "order",
    content_ids: items.map((item) => item.item_id),
    content_type: items.length > 0 ? "product" : undefined,
    contents:
      items.length > 0
        ? items.map((item) => ({
            id: item.item_id,
            quantity: item.quantity,
            item_price: item.price,
          }))
        : undefined,
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  };

  const result = await sendCapiEvent({
    eventName: "Lead",
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
    customData,
  });

  if (!result.ok) {
    console.error("[meta-capi] Lead event failed:", result.error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
