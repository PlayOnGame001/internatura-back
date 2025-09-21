import { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getAllFeeds } from "../services/feedService";
import { v4 as uuidv4 } from "uuid";
import { FeedItem } from "../types/types";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/feed", { schema }, async (request, reply) => {
    try {
      const feeds: FeedItem[] = await getAllFeeds();

      const response = feeds.map(feed => ({
        id: feed.id || uuidv4(),
        url: feed.link || "",
        title: feed.title ?? null,
        createdAt: feed.createdAt || new Date().toISOString(),
      }));

      return response;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch feeds" });
    }
  });
}
