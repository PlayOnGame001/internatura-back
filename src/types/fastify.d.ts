import type { Config } from "../config/schema";
import type { ClickHouseClient } from '@clickhouse/client';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    prisma: import('../prisma/prisma.service').default;
    pluginLoaded: (pluginName: string) => void;
    clickhouse: ClickHouseClient;
  }
  
  interface FastifyReply {
    noContent(): FastifyReply;
  }
}