import { FastifyInstance } from "fastify";
import { schema as getFeedSchema } from "../schemas/getFeedData.schema";
import { parseFeedSchema } from "../schemas/ParserFeedData.schema";
import { parseArticleSchema } from "../schemas/ParserFeedArticle.schema";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getAllFeeds, parseFeed, parseArticle } from "../services/feedService";
import { v4 as uuidv4 } from "uuid";
import { FeedItem } from "../types/types";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/feed", { schema: getFeedSchema }, async (_request, reply) => {
    try {
      const feeds: FeedItem[] = await getAllFeeds();
      const response = feeds.map(feed => {
        const { id, link: url = "", title = null, createdAt } = feed;
        return {
          id: id || uuidv4(),
          url,
          title,
          createdAt: createdAt || new Date().toISOString(),
        };
      });

      return response;
    } catch (error) {
      reply.status(500).send({ error: "Failed to fetch feeds" });
    }
  });

  route.get("/feed/parse", { schema: parseFeedSchema }, async (request, reply) => {
    const { url } = request.query;
    try {
      const items = await parseFeed(url);

      const safeItems = items.map(item => {
        const { title = "", link = "", pubDate = "", content = "" } = item;
        return { title, link, pubDate, content };
      });
      return safeItems;} 
        catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: "Ошибка парсинга RSS" });
    }
  });

  route.get("/feed/article", { schema: parseArticleSchema }, async (request, reply) => {
    const { url } = request.query;

    try {
      const article = await parseArticle(url);
      const { title = "", content = "" } = article;
      return {
        url,
        title,
        content,
      };
    } catch (error: any) {
      fastify.log.error(error);
      return { error: "Ошибка парсинга статьи" };
    }
  });
}
