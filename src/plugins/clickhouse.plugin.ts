import fp from "fastify-plugin";
import { createClient, type ClickHouseClient } from "@clickhouse/client";
import type { FastifyPluginAsync } from "fastify";

const DB_NAME = process.env.CLICKHOUSE_DB || "mydb";
const TABLE_NAME = process.env.CLICKHOUSE_TABLE || "events";

const clickhousePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const isCloud = !!process.env.CLICKHOUSE_URL;
  let clickhouseUrl: string;
  if (isCloud) {
    clickhouseUrl = process.env.CLICKHOUSE_URL!;
  } else {
    const clickhouseHost = process.env.CLICKHOUSE_HOST || "localhost";
    const clickhousePort = process.env.CLICKHOUSE_PORT || "8123";
    clickhouseUrl = `http://${clickhouseHost}:${clickhousePort}`;
  }

  const client: ClickHouseClient = createClient({
    url: clickhouseUrl,
    username: process.env.CLICKHOUSE_USER || "default",
    password: process.env.CLICKHOUSE_PASSWORD || "",
    request_timeout: 30000,
    compression: {
      response: true,
      request: false,
    },
  });

  fastify.decorate("clickhouse", client);

  try {
    await client.ping();
    fastify.log.info(`✅ ClickHouse connected: ${isCloud ? 'Cloud' : clickhouseUrl}`);
    
    await client.command({
      query: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
    });
    
    await client.command({
      query: `
        CREATE TABLE IF NOT EXISTS ${DB_NAME}.${TABLE_NAME} (
          id String,
          eventType LowCardinality(String),
          ts DateTime64(3),
          ts_ms UInt64,
          pageUrl String,
          referrer String,
          userAgent String,
          sessionId String,
          pageViewId String,
          adUnit LowCardinality(String),
          adapter LowCardinality(String),
          creativeId String,
          cpm Float64,
          auctionId String,
          bidId String,
          latencyMs UInt32,
          extra String
        ) ENGINE = MergeTree()
        ORDER BY (eventType, ts)
        PARTITION BY toYYYYMM(ts)
        SETTINGS index_granularity = 8192
      `,
    });

    fastify.log.info(`✅ ClickHouse database '${DB_NAME}' and table '${TABLE_NAME}' initialized`);
    
    const result = await client.query({
      query: 'SELECT version()',
      format: 'JSONEachRow',
    });
    const data = await result.json();
    fastify.log.info(`ClickHouse version: ${JSON.stringify(data)}`);
    
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

declare module "fastify" {
  interface FastifyInstance {
    clickhouse: ClickHouseClient;
  }
}