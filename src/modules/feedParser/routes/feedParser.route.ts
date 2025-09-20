import { FastifyInstance } from "fastify";
import { schema } from "../schemas/getFeedData.schema";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FeedService } from "../services/feedService";
import { v4 as uuidv4 } from 'uuid'; 

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();
  const feedService = new FeedService();

  route.get(
    '/feed',
    { schema: schema },
    async (request, reply) => {
      try {
        const feeds = await feedService.getAllFeeds();

        const response = (feeds as any[]).map(feed => ({
          id: feed.id || uuidv4(),      
          url: feed.link || '',         
          title: feed.title || null,
          createdAt: feed.createdAt || new Date().toISOString(),
        }));

        reply.send(response);
      } catch (error) {
        reply.status(500).send({ error: "Failed to fetch feeds" });
      }
    }
  );
}
