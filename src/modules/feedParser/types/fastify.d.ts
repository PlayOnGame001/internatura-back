import { Config } from "../../../config/schema";

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    prisma: import('../prisma/prisma.service').default;
    pluginLoaded: (pluginName: string) => void;
  }
}
