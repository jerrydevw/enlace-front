"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WatchError({ error, reset }: Props) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[Enlace] Watch error details:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      error
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
          Enlace
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl text-stone-800 font-light">
            Algo deu errado
          </h1>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            Nao foi possivel carregar o evento. Verifique sua conexao e tente novamente.
          </p>
        </div>

        <div className="w-8 h-px bg-stone-200" />

        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg text-sm tracking-wide font-light
                     bg-stone-800 text-stone-50 transition-colors
                     hover:bg-stone-700"
        >
          tentar novamente
        </button>

      </div>
    </main>
  );
}
