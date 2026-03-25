"use client";

import { useEffect, useState } from "react";

interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
  isOver: boolean;
}

export function useCountdown(targetIso: string): Countdown {
  const calc = (): Countdown => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return { hours: "00", minutes: "00", seconds: "00", isOver: true };
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return { hours: pad(h), minutes: pad(m), seconds: pad(s), isOver: false };
  };

  const [countdown, setCountdown] = useState<Countdown>(calc);

  useEffect(() => {
    if (countdown.isOver) return;
    const id = setInterval(() => {
      const next = calc();
      setCountdown(next);
      if (next.isOver) clearInterval(id);
    }, 1_000);
    return () => clearInterval(id);
  }, [targetIso, countdown.isOver]);

  return countdown;
}
