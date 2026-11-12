"use client";

import { resetAnalyticsConsent } from "@/lib/analytics/consent";

export function ConsentSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={resetAnalyticsConsent}
      className={className}
    >
      Preferencias de cookies
    </button>
  );
}
