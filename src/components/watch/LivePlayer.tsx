"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";

interface Props {
  slug: string;
  token: string;
  onSessionExpired: () => void;
}

type PlayerState = "loading" | "ready" | "error";

const AUTH_ERRORS = new Set(["SESSION_REVOKED", "INVALID_TOKEN", "SESSION_EXPIRED"]);

export function LivePlayer({ slug, token, onSessionExpired }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [muted, setMuted] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initPlayer() {
      setPlayerState("loading");
      setErrorMsg(null);

      try {
        const { playbackUrl } = await api.getPlaybackUrl(slug, token);
        if (cancelled) return;
        await loadHls(playbackUrl);
        if (!cancelled) setPlayerState("ready");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (AUTH_ERRORS.has(err.code)) {
            onSessionExpired();
            return;
          }
          if (err.statusCode === 409) {
            // ainda nao esta LIVE — tenta novamente em 10s
            retryRef.current = setTimeout(initPlayer, 10_000);
            return;
          }
        }
        setPlayerState("error");
        setErrorMsg("Nao foi possivel carregar a transmissao.");
      }
    }

    async function loadHls(url: string) {
      const video = videoRef.current;
      if (!video) return;

      const Hls = (await import("hls.js")).default;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        return () => hls.destroy();
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari — HLS nativo
        video.src = url;
      }
    }

    initPlayer();

    return () => {
      cancelled = true;
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [slug, token, onSessionExpired]);

  function handleUnmute() {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setMuted(false);
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">

      {/* Video */}
      <div className="w-full max-w-5xl relative">
        <div className="aspect-video w-full bg-stone-900 relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls={playerState === "ready"}
            className="w-full h-full object-contain"
          />

          {/* Loading overlay */}
          {playerState === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-stone-600 border-t-stone-300 animate-spin" />
              <p className="text-stone-500 text-sm font-light">
                conectando a transmissao...
              </p>
            </div>
          )}

          {/* Erro */}
          {playerState === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-stone-400 text-sm font-light text-center px-8">
                {errorMsg}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-stone-500 underline underline-offset-4"
              >
                tentar novamente
              </button>
            </div>
          )}

          {/* Botao de som */}
          {playerState === "ready" && muted && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center">
              <button
                onClick={handleUnmute}
                className="px-5 py-2.5 rounded-full text-sm font-light
                           bg-white/10 backdrop-blur-sm text-white
                           border border-white/20
                           hover:bg-white/20 transition-colors"
              >
                Ativar som
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Badge ao vivo */}
      {playerState === "ready" && (
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-stone-400 text-xs tracking-widest uppercase font-light">
            ao vivo
          </p>
        </div>
      )}
    </main>
  );
}
