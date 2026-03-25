export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-stone-500 animate-spin" />
      <p className="text-sm text-stone-400 tracking-wide">carregando...</p>
    </div>
  );
}
