"use client";

import { useEffect, useState } from "react";

const EMPTY = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getRemaining(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

interface BlackFridayCountdownProps {
  targetIso: string;
  label: string;
}

export function BlackFridayCountdown({ targetIso, label }: BlackFridayCountdownProps) {
  const [remaining, setRemaining] = useState(EMPTY);

  useEffect(() => {
    const update = () => setRemaining(getRemaining(targetIso));
    const timeout = setTimeout(update, 0);
    const interval = setInterval(update, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [targetIso]);

  const units = [
    { label: "Días", value: remaining.days },
    { label: "Horas", value: remaining.hours },
    { label: "Min", value: remaining.minutes },
    { label: "Seg", value: remaining.seconds },
  ];

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur-sm"
          >
            <span className="block text-2xl font-black tabular-nums text-white md:text-3xl">
              {pad(unit.value)}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-white/55">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
