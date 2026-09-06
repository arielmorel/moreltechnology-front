/**
 * Google Tag Manager - Event Helpers for Next.js
 *
 * Use these functions to push ecommerce events to the dataLayer.
 * Configure GA4 tags in GTM to fire on these events.
 *
 * Events available:
 * - view_item_list: When a product listing page is viewed
 * - select_item: When a user clicks on a product
 * - view_item: When a product detail page is viewed
 * - add_to_cart: When a user adds a product to cart
 * - remove_from_cart: When a user removes a product from cart
 * - begin_checkout: When checkout process starts
 * - add_shipping_info: When shipping info is submitted
 * - add_payment_info: When payment info is submitted
 * - purchase: When a purchase is completed
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushToDataLayer(data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
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

export interface ImpressionItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_list_id?: string;
  item_list_name?: string;
  price: number;
}

export function viewItemList(items: ImpressionItem[], listId: string, listName: string) {
  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: items.map((item, index) => ({
        ...item,
        index,
      })),
    },
  });
}

export function selectItem(item: ImpressionItem, listId: string, listName: string) {
  pushToDataLayer({
    event: "select_item",
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: [item],
    },
  });
}

export function viewItem(item: EcommerceItem) {
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: "DOP",
      value: item.price,
      items: [item],
    },
  });
}

export function addToCart(items: EcommerceItem[]) {
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: "DOP",
      value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items,
    },
  });
}

export function removeFromCart(items: EcommerceItem[]) {
  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency: "DOP",
      value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      items,
    },
  });
}

export function beginCheckout(items: EcommerceItem[], coupon?: string) {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: "DOP",
      value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      coupon,
      items,
    },
  });
}

export function addShippingInfo(shippingTier?: string, coupon?: string) {
  pushToDataLayer({
    event: "add_shipping_info",
    ecommerce: {
      shipping_tier: shippingTier,
      coupon,
    },
  });
}

export function addPaymentInfo(paymentType?: string) {
  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: {
      payment_type: paymentType,
    },
  });
}

export function purchase(transactionId: string, items: EcommerceItem[], options?: {
  tax?: number;
  shipping?: number;
  coupon?: string;
}) {
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      currency: "DOP",
      value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: options?.tax ?? 0,
      shipping: options?.shipping ?? 0,
      coupon: options?.coupon,
      items,
    },
  });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  pushToDataLayer({
    event: eventName,
    ...params,
  });
}
