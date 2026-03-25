import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WatchClient } from "./WatchClient";
import { api, ApiError } from "@/lib/api";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const status = await api.getPublicStatus(params.slug);
    return {
      title: `${status.title} — Enlace`,
      description: "Acompanhe ao vivo este momento especial.",
    };
  } catch {
    return {
      title: "Enlace — Transmissao ao vivo",
    };
  }
}

export default async function WatchPage({ params }: Props) {
  try {
    const initialStatus = await api.getPublicStatus(params.slug);
    return <WatchClient slug={params.slug} initialStatus={initialStatus} />;
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }
}
