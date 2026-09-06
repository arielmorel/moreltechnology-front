"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushToDataLayer(data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function GtmPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GTM_ID) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    pushToDataLayer({
      event: "page_view",
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
