export type EventType =
  | "load_page"
  | "load_ad_module"
  | "auctionInit"
  | "auctionEnd"
  | "bidRequested"
  | "bidResponse"
  | "bidWon"
  | string;

export interface StatsEvent {
  id: string;
  eventType: EventType;
  ts: string;
  ts_ms: number;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  sessionId?: string;
  pageViewId?: string;
  adUnit?: string;
  adapter?: string;
  creativeId?: string;
  cpm?: number;
  auctionId?: string;
  bidId?: string;
  latencyMs?: number;
  extra?: Record<string, any>;
}
