"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import type { Product, ProductVariant } from "@/lib/data";
import { trackContact } from "@/lib/analytics/events";

interface TrackedWhatsAppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  location: string;
  product?: Product;
  variant?: ProductVariant;
}

export function TrackedWhatsAppLink({
  location,
  product,
  variant,
  onClick,
  ...props
}: TrackedWhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackContact({
      method: "whatsapp",
      location,
      product,
      variant,
    });
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}
