import fp from "fastify-plugin";
import { createClient, type ClickHouseClient } from "@clickhouse/client";
import type { FastifyPluginAsync } from "fastify";

const DB_NAME = process.env.CLICKHOUSE_DB || "mydb";
const TABLE_NAME = process.env.CLICKHOUSE_TABLE || "events";

const clickhousePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const client: ClickHouseClient = createClient({
    host: process.env.CLICKHOUSE_URL || "http://localhost:8123",
    username: process.env.CLICKHOUSE_USER || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
  });

  // сохраняем клиент
  fastify.decorate("clickhouse", client);

  try {
    // создаём БД если нужно
    await client.exec({ query: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}` });

    // создаём таблицу (если нет)
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

    fastify.log.info("ClickHouse database and table initialized");
  } catch (err) {
    fastify.log.error(err, "Failed to initialize ClickHouse");
    throw err;
  }

  fastify.addHook("onClose", async () => {
    try {
      fastify.log.info("ClickHouse plugin closed");
    } catch (e) {
      fastify.log.error(e);
    }
  });
});

export default clickhousePlugin;