"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("@/components/ui/sonner").then(m => m.Toaster), { ssr: false });
const CompareDrawer = dynamic(() => import("@/components/compare-drawer").then(m => m.CompareDrawer), { ssr: false });
const FloatingWhatsApp = dynamic(() => import("@/components/floating-whatsapp").then(m => m.FloatingWhatsApp), { ssr: false });

export function ClientProviders() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("referralCode", ref);
    }
  }, []);

  return (
    <>
      <Toaster position="bottom-right" />
      <CompareDrawer />
      <FloatingWhatsApp />
    </>
  );
}
