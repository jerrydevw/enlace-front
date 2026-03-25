interface StoredSession {
  token: string;
  expiresAt: string;
  sessionId: string;
}

const key = (slug: string) => `enlace_session_${slug}`;

export const session = {
  get(slug: string): StoredSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key(slug));
      if (!raw) return null;
      const stored: StoredSession = JSON.parse(raw);
      if (new Date(stored.expiresAt) <= new Date()) {
        localStorage.removeItem(key(slug));
        return null;
      }
      return stored;
    } catch {
      return null;
    }
  },

  set(slug: string, data: StoredSession): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key(slug), JSON.stringify(data));
    } catch {
      // storage cheio ou bloqueado — ignora silenciosamente
    }
  },

  clear(slug: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key(slug));
  },
};
