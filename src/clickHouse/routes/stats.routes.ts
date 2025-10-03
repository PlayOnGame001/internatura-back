// add this file
import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getEventsSchema } from "../schemas/statistic.schema";

export async function statsRoutes(fastify: FastifyInstance) {
  fastify.log.info("✅ statsRoutes plugin is registering");

  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/events", { schema: getEventsSchema }, async (request, reply) => {
    try {
      const q = request.query as any;
      const page = Math.max(1, Number(q.page) || 1);
      const limit = Math.min(1000, Number(q.limit) || 20);
      const offset = (page - 1) * limit;

      const where: string[] = [];
      if (q.eventType) where.push(`eventType = '${String(q.eventType).replace("'", "")}'`);
      if (q.adUnit) where.push(`adUnit = '${String(q.adUnit).replace("'", "")}'`);
      if (q.creativeId) where.push(`creativeId LIKE '%${String(q.creativeId).replace("'", "")}%'`);
      if (q.cpmMin) where.push(`cpm >= ${Number(q.cpmMin)}`);
      if (q.cpmMax) where.push(`cpm <= ${Number(q.cpmMax)}`);
      if (q.date_from) where.push(`ts >= '${String(q.date_from)}'`);
      if (q.date_to) where.push(`ts <= '${String(q.date_to)}'`);

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const DB = process.env.CLICKHOUSE_DB || "mydb";
      const TABLE = process.env.CLICKHOUSE_TABLE || "events";

      const countQ = `SELECT count() AS total FROM ${DB}.${TABLE} ${whereSql}`;
      const totalRes = await fastify.clickhouse.query({ query: countQ });
      const totalData = (await totalRes.json()) as unknown as { total: number }[];
      const total = totalData[0]?.total ?? 0;

      const selectQ = `
        SELECT id, eventType, ts, ts_ms, pageUrl, adUnit, creativeId, cpm, adapter
        FROM ${DB}.${TABLE}
        ${whereSql}
        ORDER BY ts_ms DESC
        LIMIT ${offset}, ${limit}
      `;
      const rowsRes = await fastify.clickhouse.query({ query: selectQ });
      const rows = (await rowsRes.json()) as unknown as any[];

      return reply.send({ total, page, limit, data: rows });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: "failed to query events" });
    }
  });
}