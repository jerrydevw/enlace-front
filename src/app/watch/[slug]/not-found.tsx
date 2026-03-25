import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
          Enlace
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl text-stone-800 font-light">
            Evento nao encontrado
          </h1>
          <p className="text-sm text-stone-400 font-light leading-relaxed">
            Verifique o link recebido pelo organizador e tente novamente.
          </p>
        </div>

        <div className="w-8 h-px bg-stone-200" />

        <Link
          href="/"
          className="text-xs text-stone-400 underline underline-offset-4 font-light"
        >
          voltar ao inicio
        </Link>

      </div>
    </main>
  );
}
