import Fastify, { FastifyServerOptions } from "fastify";
import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import configPlugin from "./config";
import swaggerPlugin from "./plugins/swagger";
import { getFeedDataRoutes } from "./modules/feedParser/routes/feedParser.route";
import { userRout } from "./modules/feedParser/routes/userRout";

export type AppOptions = Partial<FastifyServerOptions>;

export async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify({ logger: true });
  await fastify.register(configPlugin);
  await fastify.register(swaggerPlugin);
  fastify.decorate("pluginLoaded", (pluginName: string) => {
    fastify.log.info(`✅ Plugin loaded: ${pluginName}`);
  });

  await fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options,
    ignorePattern: /^((?!plugin).)*$/,
  });

  fastify.get("/health", async () => ({ status: "ok" }));
  fastify.register(getFeedDataRoutes);
  fastify.register(userRout, { prefix: "/auth" });

  return fastify;
}
