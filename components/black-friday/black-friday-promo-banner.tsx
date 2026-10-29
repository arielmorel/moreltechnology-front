"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Flame } from "lucide-react";
import { BLACK_FRIDAY_CAMPAIGN, getBlackFridayState } from "@/lib/black-friday";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

interface BlackFridayPromoBannerProps {
  className?: string;
  compact?: boolean;
}

export function BlackFridayPromoBanner({ className, compact = false }: BlackFridayPromoBannerProps) {
  const mounted = useMounted();

  if (!mounted) return null;

  const state = getBlackFridayState();
  if (state === "ended") return null;

  const isActive = state === "active";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-r from-zinc-950 via-red-950 to-zinc-950 text-white shadow-xl shadow-red-950/10",
        compact ? "p-4 md:p-5" : "p-5 md:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-red-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-orange-500/15 blur-3xl" />

      <div
        className={cn(
          "relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          compact && "md:gap-6"
        )}
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30",
              compact ? "h-10 w-10" : "h-12 w-12"
            )}
          >
            <Flame className={compact ? "h-5 w-5" : "h-6 w-6"} />
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-300">
                {isActive ? "Campaña activa" : "Próximamente"}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">
                <CalendarDays className="h-3 w-3" />
                {BLACK_FRIDAY_CAMPAIGN.startLabel} - {BLACK_FRIDAY_CAMPAIGN.endLabel}
              </span>
            </div>
            <h2 className={cn("font-black tracking-tight", compact ? "text-lg" : "text-xl md:text-2xl")}>
              {isActive
                ? "Black Friday 2026: laptops en oferta"
                : "Black Friday 2026 llega el 1 de noviembre"}
            </h2>
            {!compact && (
              <p className="mt-1 max-w-xl text-sm text-white/65">
                {isActive
                  ? "Aprovecha precios especiales en laptops nuevas y usadas certificadas, con garantía local y envío a todo el país."
                  : "Prepara tu próxima laptop y descubre las ofertas que tendremos disponibles durante la campaña."}
              </p>
            )}
          </div>
        </div>

        <Link
          href={BLACK_FRIDAY_CAMPAIGN.slug}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 text-sm font-bold text-zinc-950 transition-colors hover:bg-red-50 md:self-auto"
        >
          {isActive ? "Ver ofertas" : "Ver detalles"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
