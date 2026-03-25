"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  title: string;
  scheduledAt: string;
}

export function WaitingRoom({ title, scheduledAt }: Props) {
  const { hours, minutes, seconds, isOver } = useCountdown(scheduledAt);

  const date = new Date(scheduledAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-10 text-center">

        {/* Logo */}
        <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
          Enlace
        </p>

        {/* Titulo */}
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-4xl text-stone-800 font-light leading-tight">
            {title}
          </h1>
          <p className="text-sm text-stone-400 font-light">{date}</p>
        </div>

        {/* Divisor */}
        <div className="w-8 h-px bg-stone-200" />

        {/* Countdown ou mensagem */}
        {isOver ? (
          <p className="font-serif text-xl text-stone-600 font-light italic">
            A cerimonia esta prestes a comecar
          </p>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-stone-400 tracking-widest uppercase font-light">
              começa em
            </p>
            <div className="flex items-end gap-3">
              <CountUnit value={hours} label="h" />
              <span className="text-2xl text-stone-300 font-light mb-1">:</span>
              <CountUnit value={minutes} label="m" />
              <span className="text-2xl text-stone-300 font-light mb-1">:</span>
              <CountUnit value={seconds} label="s" />
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-xs text-stone-400 font-light tracking-wide">
            A transmissao iniciara em breve
          </p>
        </div>
      </div>
    </main>
  );
}

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-serif text-5xl text-stone-800 font-light tabular-nums">
        {value}
      </span>
      <span className="text-xs text-stone-300 tracking-widest uppercase">{label}</span>
    </div>
  );
}
