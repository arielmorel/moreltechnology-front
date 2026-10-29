"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import {
  BLACK_FRIDAY_CAMPAIGN,
  getBlackFridayState,
  type BlackFridayState,
} from "@/lib/black-friday";

const EMPTY = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeftUntil(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function getTimeLeftToday() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return getTimeLeftUntil(end.toISOString());
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTimeLeft(timeLeft: typeof EMPTY) {
  const dayPrefix = timeLeft.days > 0 ? `${timeLeft.days}d ` : "";
  return `${dayPrefix}${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function FlashAnnouncement() {
  const mounted = useMounted();
  const [state, setState] = useState<BlackFridayState | null>(null);
  const [timeLeft, setTimeLeft] = useState(EMPTY);

  useEffect(() => {
    if (!mounted) return;

    const update = () => {
      const nextState = getBlackFridayState();
      setState(nextState);

      if (nextState === "upcoming") {
        setTimeLeft(getTimeLeftUntil(BLACK_FRIDAY_CAMPAIGN.startIso));
      } else if (nextState === "active") {
        setTimeLeft(getTimeLeftUntil(BLACK_FRIDAY_CAMPAIGN.endIso));
      } else {
        setTimeLeft(getTimeLeftToday());
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  const isCampaign = state === "upcoming" || state === "active";
  const isActive = state === "active";

  const title = isActive
    ? "Black Friday 2026: ofertas en laptops"
    : state === "upcoming"
      ? "Black Friday 2026 llega el 1 de noviembre"
      : "Ofertas Flash del día";

  const countdownLabel = isActive
    ? "Termina en"
    : state === "upcoming"
      ? "Comienza en"
      : "para aprovecharlas";

  const href = isCampaign ? BLACK_FRIDAY_CAMPAIGN.slug : "/ofertas";
  const cta = isCampaign ? "Ver Black Friday" : "Ver ofertas";

  return (
    <div className="relative z-20">
      <div className="h-14 md:h-16 bg-background" />
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <Link
            href={href}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
          >
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold">
              <Flame className="w-4 h-4" />
              {title}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold">
              <span className="tabular-nums bg-black/20 rounded-md px-1.5 py-0.5">
                {formatTimeLeft(timeLeft)}
              </span>
              {countdownLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-bold underline underline-offset-2">
              {cta} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
