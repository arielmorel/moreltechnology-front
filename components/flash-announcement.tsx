"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";

function getTimeLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function FlashAnnouncement() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-20 pt-14 md:pt-16 bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white">
      <div className="container mx-auto px-4 md:px-6 py-2">
        <Link
          href="/ofertas"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
        >
          <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold">
            <Flame className="w-4 h-4" />
            Ofertas Flash del día
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold">
            <span className="tabular-nums bg-black/20 rounded-md px-1.5 py-0.5">
              {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
            </span>
            para aprovecharlas
          </span>
          <span className="inline-flex items-center gap-1 text-xs md:text-sm font-bold underline underline-offset-2">
            Ver ofertas <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}