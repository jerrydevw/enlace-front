"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { EventPublicStatus } from "@/lib/types";

const POLL_INTERVAL_MS = 15_000;
const TERMINAL = new Set(["LIVE", "ENDED"]);

export function useEventStatus(slug: string, initial: EventPublicStatus) {
  const [status, setStatus] = useState<EventPublicStatus>(initial);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (TERMINAL.has(status.status)) return;

    intervalRef.current = setInterval(async () => {
      try {
        const updated = await api.getPublicStatus(slug);
        setStatus(updated);
        if (TERMINAL.has(updated.status)) {
          clearInterval(intervalRef.current!);
        }
      } catch {
        // falha silenciosa — nao interrompe a tela de espera
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slug, status.status]);

  return status;
}
