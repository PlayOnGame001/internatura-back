import type { ClickHouseClient } from "@clickhouse/client";
import type { StatsEvent } from "../types/event";

let cache: StatsEvent[] = [];
const MAX_CACHE = Number(process.env.EVENT_CACHE_MAX || 100);
const FLUSH_INTERVAL = Number(process.env.EVENT_FLUSH_MS || 5000);
const DB_NAME = process.env.CLICKHOUSE_DB || "mydb";
const TABLE_NAME = process.env.CLICKHOUSE_TABLE || "events";

export function initCacheFlusher(clickClient: ClickHouseClient) {
  setInterval(async () => {
    if (cache.length === 0) return;
    try {
      await flushToClickhouse(clickClient);
    } catch (err) {
      console.error("Failed flush to ClickHouse:", err);
    }
  }, FLUSH_INTERVAL);
}

export function addToCache(event: StatsEvent): boolean {
  cache.push(event);
  return cache.length >= MAX_CACHE;
}

export async function flushToClickhouse(clickClient: ClickHouseClient) {
  if (!cache.length) return;
  const toInsert = cache.map(ev => ({
    id: ev.id,
    eventType: ev.eventType,
    ts: ev.ts,
    ts_ms: Number(ev.ts_ms || Date.now()),
    pageUrl: ev.pageUrl || "",
    referrer: ev.referrer || "",
    userAgent: ev.userAgent || "",
    sessionId: ev.sessionId || "",
    pageViewId: ev.pageViewId || "",
    adUnit: ev.adUnit || "",
    adapter: ev.adapter || "",
    creativeId: ev.creativeId || "",
    cpm: ev.cpm ?? 0,
    auctionId: ev.auctionId || "",
    bidId: ev.bidId || "",
    latencyMs: Number(ev.latencyMs ?? 0),
    extra: ev.extra ? JSON.stringify(ev.extra) : ""
  }));

  await clickClient.insert({
    table: `${DB_NAME}.${TABLE_NAME}`,
    values: toInsert,
    format: "JSONEachRow",
  });

  cache = [];
}
