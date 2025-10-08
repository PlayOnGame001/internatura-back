import Fastify, { FastifyServerOptions } from "fastify";
import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import configPlugin from "./config";
import { getFeedDataRoutes } from "./modules/feedParser/routes/feedParser.route";
import { userRout } from "./modules/feedParser/routes/userRout";
import { healthRoute } from "./modules/feedParser/routes/health.route";
import { lineItemRoutes } from "./modules/AddService/route/lineItem.routes";
import { bidAdapterRoutes } from "./modules/AddService/route/BidAdapter.routes";
import { eventsRoutes } from "./clickHouse/routes/Events.routes";
import { statsRoutes } from "../src/clickHouse/routes/stats.routes";
import cors from "@fastify/cors";

export type AppOptions = Partial<FastifyServerOptions>;

export async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify({ 
    logger: true,
    bodyLimit: 1048576
  });
  await fastify.register(configPlugin);
  await fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options,
    ignorePattern: /(addServer\.plugin\.(ts|js)|swagger\.plugin\.(ts|js))$/
  });
  
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  });
  await fastify.register(healthRoute);
  await fastify.register(getFeedDataRoutes);
  await fastify.register(userRout, { prefix: "/auth" });
  await fastify.register(lineItemRoutes, { prefix: "/line-item" });
  await fastify.register(bidAdapterRoutes, { prefix: "/ad" });
  await fastify.register(eventsRoutes, { prefix: "/api/statistics" });
  await fastify.register(statsRoutes, { prefix: "/api/statistics" });
  fastify.get("/", async () => {
    return { status: "ok" };
  });

  return fastify;
}