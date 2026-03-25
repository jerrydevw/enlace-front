import type {
  AccessResponse,
  ApiErrorBody,
  EventPublicStatus,
  PlaybackResponse,
} from "./types";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(code);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const { token: _token, ...restOptions } = options ?? {};
  void _token;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  // Use relative path for client-side to avoid Mixed Content (next.config.js proxy)
  // Use full URL for server-side (Server Components)
  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? apiUrl : "";
  const requestPath = isServer ? path : path.replace(/^\/api\//, "/api-proxy/");

  const res = await fetch(
    `${baseUrl}${requestPath}`,
    { ...restOptions, headers }
  );

  if (!res.ok) {
    const body: ApiErrorBody = await res.json();
    throw new ApiError(res.status, body.error ?? "UNKNOWN_ERROR");
  }

  return res.json() as Promise<T>;
}

export const api = {
  getPublicStatus: (slug: string) =>
    apiFetch<EventPublicStatus>(
      `/api/v1/events/${slug}/public-status`,
      { cache: "no-store" }
    ),

  validateCode: (slug: string, code: string) =>
    apiFetch<AccessResponse>(`/api/v1/events/${slug}/access`, {
      method: "POST",
      body: JSON.stringify({ code: code.toUpperCase().trim() }),
    }),

  getPlaybackUrl: (slug: string, token: string) =>
    apiFetch<PlaybackResponse>(`/api/v1/events/${slug}/playback-url`, {
      token,
    }),
};
