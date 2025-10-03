import { FastifyInstance } from "fastify";
import { schema as getFeedSchema } from "../schemas/getFeedData.schema";
import { parseFeedSchema } from "../schemas/ParserFeedData.schema";
import { parseArticleSchema } from "../schemas/ParserFeedArticle.schema";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { getAllFeeds, parseFeed, parseArticle, saveFeedToCache } from "../services/feedService";
import { FeedItem } from "../types/types";

export async function getFeedDataRoutes(fastify: FastifyInstance) {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get("/feed", { schema: getFeedSchema }, async (_request, reply) => {
  try {
    const feeds = await getAllFeeds();
    const response = feeds.map(feed => ({
      id: feed.id,
      url: feed.url,
      title: feed.title,
      createdAt: feed.createdAt.toISOString(),
    }));
    return response;
    } catch (error) {
      fastify.log.error('❌ Error in /feed:', error);
      reply.status(500).send({ error: "Failed to fetch feeds" });
    }
  });

  route.get("/feed/parse", { schema: parseFeedSchema }, async (request, reply) => {
    const { url } = request.query;
    try {
      console.log('📡 GET /feed/parse called with url:', url);
      const items = await parseFeed(url);
      const feedItems: FeedItem[] = items.map(item => ({
        id: item.guid || item.link || crypto.randomUUID(),
        url: item.link || '',
        link: item.link || '',
        title: item.title || null,
        content: item.content || '',
        pubDate: item.pubDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }));

      saveFeedToCache(url, feedItems);
      return items;
    } catch (error) {
      fastify.log.error('❌ Error parsing RSS:', error);
      return reply.status(500).send({ error: "Ошибка парсинга RSS" });
    }
  });

  route.get("/feed/article", { schema: parseArticleSchema }, async (request, reply) => {
    const { url } = request.query;

    try {
      const article = await parseArticle(url);
      
      return {
        url,
        title: article.title || '',
        content: article.content || '',
      };
    } catch (error) {
      fastify.log.error('❌ Error parsing article:', error);
      return reply.status(500).send({ error: "Ошибка парсинга статьи" });
    }
  });
}