"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function FilterChip({ active, children, className, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-border hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
