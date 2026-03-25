export type EventStatus =
  | "CREATED"
  | "PROVISIONING"
  | "READY"
  | "LIVE"
  | "ENDED"
  | "PROVISIONING_FAILED";

export interface EventPublicStatus {
  title: string;
  status: EventStatus;
  scheduledAt: string;
}

export interface AccessResponse {
  sessionToken: string;
  expiresAt: string;
  sessionId: string;
  event: {
    title: string;
    status: EventStatus;
    scheduledAt: string;
  };
}

export interface PlaybackResponse {
  playbackUrl: string;
  eventStatus: EventStatus;
}

export interface ApiErrorBody {
  status: number;
  error: string;
  message: string;
}
