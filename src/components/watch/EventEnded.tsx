interface Props {
  title: string;
}

export function EventEnded({ title }: Props) {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
          Enlace
        </p>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl text-stone-800 font-light leading-snug">
            {title}
          </h1>
        </div>

        <div className="w-8 h-px bg-stone-200" />

        <div className="flex flex-col gap-2">
          <p className="font-serif text-xl text-stone-500 font-light italic">
            A cerimonia foi encerrada.
          </p>
          <p className="text-sm text-stone-400 font-light">
            Obrigado por participar deste momento especial.
          </p>
        </div>

      </div>
    </main>
  );
}
