"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalyticsConsent } from "@/lib/analytics/consent";
import { trackPageView } from "@/lib/analytics/events";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function GtmPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useAnalyticsConsent();

  useEffect(() => {
    if (!GTM_ID || consent !== "granted") return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url, document.title);
  }, [pathname, searchParams, consent]);

  return null;
}

export function GtmPageView() {
  return (
    <Suspense fallback={null}>
      <GtmPageViewInner />
    </Suspense>
  );
}
