"use client";

import { useSyncExternalStore } from "react";

export type AnalyticsConsent = "granted" | "denied";

export const ANALYTICS_CONSENT_KEY = "morel-analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "morel:analytics-consent-change";

const GRANTED_CONSENT = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

const DENIED_CONSENT = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

function readStoredConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function pushConsentCommand(command: "default" | "update", value: typeof GRANTED_CONSENT | typeof DENIED_CONSENT): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", command, value] as unknown as Record<string, unknown>);
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  return readStoredConsent();
}

export function hasAnalyticsConsent(): boolean {
  return readStoredConsent() === "granted";
}

export function applyGoogleConsent(value: AnalyticsConsent): void {
  pushConsentCommand("update", value === "granted" ? GRANTED_CONSENT : DENIED_CONSENT);
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Ignore storage failures; the in-memory event still updates the UI.
  }

  applyGoogleConsent(value);
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}

export function resetAnalyticsConsent(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  } catch {
    // Ignore storage failures.
  }

  pushConsentCommand("update", DENIED_CONSENT);
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(ANALYTICS_CONSENT_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, callback);
  };
}

export function useAnalyticsConsent(): AnalyticsConsent | null {
  return useSyncExternalStore(
    subscribe,
    readStoredConsent,
    () => null
  );
}
