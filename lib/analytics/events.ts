import type { Product, ProductVariant } from "@/lib/data";
import type { CartItem } from "@/lib/store";
import { resolveProductPrice } from "@/lib/product-pricing";
import { hasAnalyticsConsent } from "./consent";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  affiliation?: string;
  coupon?: string;
  discount?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_variant?: string;
  location_id?: string;
  price: number;
  quantity: number;
}

export interface AnalyticsItem extends EcommerceItem {
  currency: string;
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: { id: string; quantity: number; item_price: number }[];
  num_items?: number;
  order_id?: string;
  lead_type?: string;
  search_string?: string;
  method?: string;
  location?: string;
}

interface MetaEventPayload {
  event_name: string;
  event_id: string;
  custom_data?: MetaCustomData;
}

interface PushEventOptions {
  event: string;
  metaEventName: string;
  eventId?: string;
  ecommerce?: Record<string, unknown>;
  metaCustomData?: MetaCustomData;
  extra?: Record<string, unknown>;
}

export interface CustomerData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface LeadParams {
  eventId?: string;
  orderId?: string;
  leadType?: "order" | "financing" | "contact";
  value?: number;
  currency?: string;
  items?: AnalyticsItem[];
  customer?: CustomerData;
}

function createEventId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${random}`;
}

function toEcommerceItem(item: AnalyticsItem): EcommerceItem {
  const ecommerceItem: Partial<AnalyticsItem> = { ...item };
  delete ecommerceItem.currency;
  return ecommerceItem as EcommerceItem;
}

function getItemsValue(items: AnalyticsItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getItemsCurrency(items: AnalyticsItem[]): string {
  return items[0]?.currency ?? "DOP";
}

function toMetaContents(items: AnalyticsItem[]): { id: string; quantity: number; item_price: number }[] {
  return items.map((item) => ({
    id: item.item_id,
    quantity: item.quantity,
    item_price: item.price,
  }));
}

function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

function pushEvent({ event, metaEventName, eventId, ecommerce, metaCustomData, extra }: PushEventOptions): string | null {
  if (!hasAnalyticsConsent()) return null;

  const resolvedEventId = eventId ?? createEventId(event);
  const meta: MetaEventPayload = {
    event_name: metaEventName,
    event_id: resolvedEventId,
  };

  if (metaCustomData) {
    meta.custom_data = metaCustomData;
  }

  pushToDataLayer({
    event,
    event_id: resolvedEventId,
    ...(ecommerce ? { ecommerce } : {}),
    meta,
    ...extra,
  });

  return resolvedEventId;
}

export function buildAnalyticsItem(
  product: Product,
  variant?: ProductVariant,
  quantity = 1
): AnalyticsItem {
  const pricing = resolveProductPrice(product, variant);

  return {
    item_id: variant?.sku || product.sku || product.id,
    item_name: product.name,
    item_brand: product.brand,
    item_category: product.category,
    item_variant: variant?.name,
    price: pricing.price,
    quantity,
    currency: pricing.currency,
  };
}

function toCartAnalyticsItem(item: CartItem): AnalyticsItem {
  return {
    item_id: item.sku || item.id,
    item_name: item.name,
    item_brand: item.brand,
    item_category: item.category,
    item_variant: item.variantName,
    price: item.price,
    quantity: item.quantity,
    currency:
      item.prices?.find((price) => price.currency === "DOP")?.currency ??
      item.prices?.[0]?.currency ??
      "DOP",
  };
}

export function getCartAnalyticsItems(items: CartItem[]): AnalyticsItem[] {
  return items.map(toCartAnalyticsItem);
}

export function trackPageView(path: string, title: string): string | null {
  return pushEvent({
    event: "page_view",
    metaEventName: "PageView",
    extra: {
      page_path: path,
      page_title: title,
    },
  });
}

export function trackViewItem(product: Product, variant?: ProductVariant): string | null {
  const item = buildAnalyticsItem(product, variant);
  const value = item.price * item.quantity;

  return pushEvent({
    event: "view_item",
    metaEventName: "ViewContent",
    ecommerce: {
      currency: item.currency,
      value,
      items: [toEcommerceItem(item)],
    },
    metaCustomData: {
      currency: item.currency,
      value,
      content_ids: [item.item_id],
      content_name: product.name,
      content_type: "product",
      contents: toMetaContents([item]),
    },
  });
}

export function trackAddToCart(
  product: Product,
  variant?: ProductVariant,
  quantity = 1
): string | null {
  const item = buildAnalyticsItem(product, variant, quantity);
  const value = item.price * item.quantity;

  return pushEvent({
    event: "add_to_cart",
    metaEventName: "AddToCart",
    ecommerce: {
      currency: item.currency,
      value,
      items: [toEcommerceItem(item)],
    },
    metaCustomData: {
      currency: item.currency,
      value,
      content_ids: [item.item_id],
      content_name: product.name,
      content_type: "product",
      contents: toMetaContents([item]),
      num_items: item.quantity,
    },
  });
}

export function trackRemoveFromCart(product: Product, variant?: ProductVariant): string | null {
  const item = buildAnalyticsItem(product, variant);
  const value = item.price * item.quantity;

  return pushEvent({
    event: "remove_from_cart",
    metaEventName: "RemoveFromCart",
    ecommerce: {
      currency: item.currency,
      value,
      items: [toEcommerceItem(item)],
    },
    metaCustomData: {
      currency: item.currency,
      value,
      content_ids: [item.item_id],
      content_type: "product",
      contents: toMetaContents([item]),
    },
  });
}

export function trackRemoveCartItem(item: CartItem): string | null {
  const analyticsItem = toCartAnalyticsItem(item);
  const value = analyticsItem.price * analyticsItem.quantity;

  return pushEvent({
    event: "remove_from_cart",
    metaEventName: "RemoveFromCart",
    ecommerce: {
      currency: analyticsItem.currency,
      value,
      items: [toEcommerceItem(analyticsItem)],
    },
    metaCustomData: {
      currency: analyticsItem.currency,
      value,
      content_ids: [analyticsItem.item_id],
      content_type: "product",
      contents: toMetaContents([analyticsItem]),
    },
  });
}

export function trackBeginCheckout(items: AnalyticsItem[]): string | null {
  const currency = getItemsCurrency(items);
  const value = getItemsValue(items);

  return pushEvent({
    event: "begin_checkout",
    metaEventName: "InitiateCheckout",
    ecommerce: {
      currency,
      value,
      items: items.map(toEcommerceItem),
    },
    metaCustomData: {
      currency,
      value,
      content_ids: items.map((item) => item.item_id),
      content_type: "product",
      contents: toMetaContents(items),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
}

export function trackSearch(searchString: string, resultsCount?: number): string | null {
  return pushEvent({
    event: "search",
    metaEventName: "Search",
    extra: {
      search_term: searchString,
      results_count: resultsCount,
    },
    metaCustomData: {
      search_string: searchString,
    },
  });
}

export function trackContact(options?: {
  method?: string;
  location?: string;
  product?: Product;
  variant?: ProductVariant;
}): string | null {
  const item = options?.product
    ? buildAnalyticsItem(options.product, options.variant)
    : undefined;

  return pushEvent({
    event: "contact",
    metaEventName: "Contact",
    metaCustomData: {
      method: options?.method ?? "whatsapp",
      location: options?.location,
      content_ids: item ? [item.item_id] : undefined,
      content_name: options?.product?.name,
      content_type: item ? "product" : undefined,
    },
  });
}

export function trackLead(params: LeadParams): string | null {
  const items = params.items ?? [];
  const currency = params.currency ?? (items.length > 0 ? getItemsCurrency(items) : "DOP");
  const value = params.value ?? (items.length > 0 ? getItemsValue(items) : 0);
  const eventId =
    params.eventId ??
    (params.orderId ? `lead_${params.orderId}` : createEventId("lead"));

  return pushEvent({
    event: "generate_lead",
    metaEventName: "Lead",
    eventId,
    ecommerce:
      items.length > 0
        ? {
            currency,
            value,
            transaction_id: params.orderId,
            items: items.map(toEcommerceItem),
          }
        : {
            currency,
            value,
            transaction_id: params.orderId,
          },
    metaCustomData: {
      currency,
      value,
      content_ids: items.map((item) => item.item_id),
      content_type: items.length > 0 ? "product" : undefined,
      contents: items.length > 0 ? toMetaContents(items) : undefined,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      order_id: params.orderId,
      lead_type: params.leadType ?? "order",
    },
  });
}

export function trackPurchase(
  transactionId: string,
  items: AnalyticsItem[],
  options?: {
    tax?: number;
    shipping?: number;
    coupon?: string;
  }
): string | null {
  const currency = getItemsCurrency(items);
  const value = getItemsValue(items);

  return pushEvent({
    event: "purchase",
    metaEventName: "Purchase",
    eventId: `purchase_${transactionId}`,
    ecommerce: {
      transaction_id: transactionId,
      currency,
      value,
      tax: options?.tax ?? 0,
      shipping: options?.shipping ?? 0,
      coupon: options?.coupon,
      items: items.map(toEcommerceItem),
    },
    metaCustomData: {
      currency,
      value,
      content_ids: items.map((item) => item.item_id),
      content_type: "product",
      contents: toMetaContents(items),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      order_id: transactionId,
    },
  });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): string | null {
  return pushEvent({
    event: eventName,
    metaEventName: eventName,
    extra: params,
  });
}
