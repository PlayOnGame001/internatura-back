import { FastifyInstance } from "fastify";
import { schema as getFeedSchema } from "../schemas/getFeedData.schema";
import { parseFeedSchema } from "../schemas/ParserFeedData.schema";
import { parseArticleSchema } from "../schemas/ParserFeedArticle.schema";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getAllFeeds } from "../services/feedService";
import { v4 as uuidv4 } from "uuid";
import { FeedItem } from "../types/types";
import { parseFeed, parseArticle } from "../services/feedService";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  // Получение всех сохранённых фидов из базы
  route.get("/feed", { schema: getFeedSchema }, async (request, reply) => {
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

  route.get("/feed/parse", { schema: parseFeedSchema }, async (request, reply) => {
    const { url } = request.query as { url: string };
    try {
      const items = await parseFeed(url);
      const safeItems = items.map(item => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        content: item.content || "",
      }));
      return safeItems;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Ошибка парсинга RSS" });
    }
  });

  route.get("/feed/article", { schema: parseArticleSchema }, async (request, reply) => {
    const { url } = request.query as { url: string };
    try {
      const article = await parseArticle(url);
      return {
        url,  
        title: article.title || "",
        content: article.content || "",
      };
    } catch (error: any) {
      fastify.log.error(error);
      return { error: "Ошибка парсинга статьи" };
    }
  });
}
