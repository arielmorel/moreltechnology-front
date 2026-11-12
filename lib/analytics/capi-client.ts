"use client";

import type { AnalyticsItem, CustomerData } from "./events";

interface LeadCapiPayload {
  eventId: string;
  eventName: "Lead";
  eventSourceUrl?: string;
  orderId?: string;
  leadType?: string;
  value?: number;
  currency?: string;
  items?: AnalyticsItem[];
  customer?: CustomerData;
  customData?: Record<string, unknown>;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

function getFbc(): string | undefined {
  const cookieValue = readCookie("_fbc");
  if (cookieValue) return cookieValue;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}

export async function sendLeadToCapi(payload: LeadCapiPayload): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/meta/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...payload,
        eventSourceUrl: payload.eventSourceUrl ?? window.location.href,
        fbp: readCookie("_fbp"),
        fbc: getFbc(),
      }),
    });
  } catch {
    // Analytics must never block the customer flow.
  }
}
