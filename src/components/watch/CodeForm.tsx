"use client";

import { useState } from "react";

interface Props {
  eventTitle: string;
  onSubmit: (code: string) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

export function CodeForm({ eventTitle, onSubmit, error, isSubmitting }: Props) {
  const [code, setCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    await onSubmit(code);
  }

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
          Enlace
        </p>

        {/* Titulo do evento */}
        <div className="text-center">
          <h1 className="font-serif text-3xl text-stone-800 font-light leading-snug">
            {eventTitle}
          </h1>
          <p className="mt-3 text-sm text-stone-400 font-light">
            Digite o codigo do seu convite para assistir
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: ANA-2026"
            autoFocus
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={10}
            className="w-full text-center text-lg tracking-widest font-light
                       bg-white border border-stone-200 rounded-lg px-4 py-4
                       text-stone-800 placeholder:text-stone-300
                       focus:outline-none focus:border-stone-400
                       transition-colors"
          />

          {error && (
            <p className="text-center text-sm text-red-400 font-light">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !code.trim()}
            className="w-full py-4 rounded-lg text-sm tracking-wide font-light
                       bg-stone-800 text-stone-50
                       disabled:bg-stone-200 disabled:text-stone-400
                       transition-colors"
          >
            {isSubmitting ? "verificando..." : "entrar"}
          </button>
        </form>

        <p className="text-xs text-stone-300 text-center font-light">
          O codigo foi enviado pelo organizador do evento
        </p>
      </div>
    </main>
  );
}
