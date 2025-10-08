import fp from "fastify-plugin";
import { createClient, type ClickHouseClient } from "@clickhouse/client";
import type { FastifyPluginAsync } from "fastify";

const DB_NAME = process.env.CLICKHOUSE_DATABASE || process.env.CLICKHOUSE_DB || "analytics";
const TABLE_NAME = process.env.CLICKHOUSE_TABLE || "events";

const clickhousePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const clickhouseHost = process.env.CLICKHOUSE_HOST || "localhost";
  const clickhousePort = process.env.CLICKHOUSE_PORT || "8123";
  const clickhouseUrl = `http://${clickhouseHost}:${clickhousePort}`;

  const client: ClickHouseClient = createClient({
    url: clickhouseUrl,
    database: DB_NAME,
    username: process.env.CLICKHOUSE_USER || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
  });

  fastify.decorate("clickhouse", client);

  try {
    await client.ping();
    fastify.log.info(`✅ ClickHouse connected: ${clickhouseUrl}`);
    await client.exec({ query: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}` });
    await client.exec({
      query: `
        CREATE TABLE IF NOT EXISTS ${DB_NAME}.${TABLE_NAME} (
          id String,
          eventType String,
          ts String,
          ts_ms UInt64,
          pageUrl String,
          referrer String,
          userAgent String,
          sessionId String,
          pageViewId String,
          adUnit String,
          adapter String,
          creativeId String,
          cpm Float64,
          auctionId String,
          bidId String,
          latencyMs UInt32,
          extra String
        ) ENGINE = MergeTree()
        ORDER BY (ts_ms, id)
      `
    });

    fastify.log.info(`✅ ClickHouse database '${DB_NAME}' and table '${TABLE_NAME}' initialized`);
  } catch (err) {
    fastify.log.error(err, "❌ Failed to initialize ClickHouse");
    throw err;
  }
  fastify.addHook("onClose", async () => {
    try {
      await client.close();
      fastify.log.info("ClickHouse connection closed");
    } catch (e) {
      fastify.log.error(e, "Error closing ClickHouse");
    }
  });
});

export default clickhousePlugin;