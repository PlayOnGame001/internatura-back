import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { postEventSchema } from "../schemas/events.schema";
import { addToCache, flushToClickhouse } from "../cache/Eventcache";
import type { StatsEvent } from "../types/event";
import crypto from "crypto";

export async function eventsRoutes(fastify: FastifyInstance) {
  fastify.log.info("✅ eventsRoutes plugin is registering");

  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.post("/event", { schema: postEventSchema }, async (request, reply) => {
    try {
      const body = request.body;
      const arr: any[] = Array.isArray(body) ? body : [body];

      const events: StatsEvent[] = arr.map((item) => {
        const nowMs = Date.now();
        return {
          id: item.id || crypto.randomUUID(),
          eventType: item.type || item.eventType || "unknown",
          ts: item.ts || new Date(nowMs).toISOString(),
          ts_ms: item.ts_ms ?? nowMs,
          pageUrl: item.pageUrl || request.headers.referer || "",
          referrer: item.referrer || request.headers.referer || "",
          userAgent: item.userAgent || request.headers["user-agent"] || "",
          sessionId: item.sessionId || "",
          pageViewId: item.pageViewId || "",
          adUnit: item.adUnit || item.ad_unit || "",
          adapter: item.adapter || "",
          creativeId: item.creativeId || item.creative_id || "",
          cpm: item.cpm ?? null,
          auctionId: item.auctionId || "",
          bidId: item.bidId || "",
          latencyMs: item.latencyMs ?? 0,
          extra: item.extra ?? {},
        };
      });

      for (const ev of events) {
        const shouldFlush = addToCache(ev);
        if (shouldFlush) {
          await flushToClickhouse(fastify.clickhouse);
        }
      }

      return reply.code(200).send({ status: "ok", inserted: events.length });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "failed to process events" });
    }
  });
}