"use client";

import { useState } from "react";
import { useEventStatus } from "@/hooks/useEventStatus";
import { session } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { CodeForm } from "@/components/watch/CodeForm";
import { WaitingRoom } from "@/components/watch/WaitingRoom";
import { LivePlayer } from "@/components/watch/LivePlayer";
import { EventEnded } from "@/components/watch/EventEnded";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { EventPublicStatus } from "@/lib/types";

interface Props {
  slug: string;
  initialStatus: EventPublicStatus;
}

const CODE_ERROR_MESSAGES: Record<string, string> = {
  INVALID_INVITE_CODE: "Codigo invalido. Verifique e tente novamente.",
  INVITE_CODE_REVOKED: "Este convite foi cancelado.",
  INVITE_CODE_EXPIRED: "Este convite expirou.",
  EVENT_ENDED: "Este evento ja foi encerrado.",
  RATE_LIMIT_EXCEEDED: "Muitas tentativas. Aguarde alguns minutos.",
};

export function WatchClient({ slug, initialStatus }: Props) {
  const eventStatus = useEventStatus(slug, initialStatus);

  const [token, setToken] = useState<string | null>(
    () => session.get(slug)?.token ?? null
  );
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCodeSubmit(code: string) {
    setIsSubmitting(true);
    setCodeError(null);
    try {
      const res = await api.validateCode(slug, code);
      session.set(slug, {
        token: res.sessionToken,
        expiresAt: res.expiresAt,
        sessionId: res.sessionId,
      });
      setToken(res.sessionToken);
    } catch (err) {
      if (err instanceof ApiError) {
        setCodeError(
          CODE_ERROR_MESSAGES[err.code] ?? "Erro inesperado. Tente novamente."
        );
      } else {
        setCodeError("Erro de conexao. Verifique sua internet.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSessionExpired() {
    session.clear(slug);
    setToken(null);
    setCodeError("Sua sessao expirou. Digite o codigo novamente.");
  }

  // Evento encerrado — independente de ter JWT
  if (eventStatus.status === "ENDED") {
    return <EventEnded title={eventStatus.title} />;
  }

  // Sem JWT — pede o codigo
  if (!token) {
    return (
      <CodeForm
        eventTitle={eventStatus.title}
        onSubmit={handleCodeSubmit}
        error={codeError}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Com JWT e evento LIVE — carrega o player
  if (eventStatus.status === "LIVE") {
    return (
      <LivePlayer
        slug={slug}
        token={token}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  // Com JWT mas evento CREATED/PROVISIONING — improvavel mas tratado
  if (
    eventStatus.status === "CREATED" ||
    eventStatus.status === "PROVISIONING" ||
    eventStatus.status === "PROVISIONING_FAILED"
  ) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
          <p className="font-serif text-stone-300 text-sm tracking-[0.3em] uppercase">
            Enlace
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-3xl text-stone-800 font-light leading-tight">
              {eventStatus.title}
            </h1>
            <div className="w-8 h-px bg-stone-200 mx-auto" />
            <p className="font-serif text-xl text-stone-600 font-light italic leading-relaxed">
              A cerimônia já foi agendada, estamos ansiosos e vamos amar ter
              você com a gente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <p className="text-xs text-stone-400 font-light tracking-wide">
              Em breve a sala de espera estará disponível
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Com JWT e evento READY — tela de espera com countdown
  return (
    <WaitingRoom
      title={eventStatus.title}
      scheduledAt={eventStatus.scheduledAt}
    />
  );
}
