import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function WatchLoading() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center">
      <LoadingSpinner />
    </main>
  );
}
