"use client";

import { Toaster } from "@/components/ui/sonner";
import { CompareDrawer } from "@/components/compare-drawer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export function ClientProviders() {
  return (
    <>
      <Toaster position="bottom-right" />
      <CompareDrawer />
      <FloatingWhatsApp />
    </>
  );
}
