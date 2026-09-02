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
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
