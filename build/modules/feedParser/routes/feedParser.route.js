"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedDataRoutes = getFeedDataRoutes;
const getFeedData_schema_1 = require("../schemas/getFeedData.schema");
const feedService_1 = require("../services/feedService");
const uuid_1 = require("uuid");
async function getFeedDataRoutes(fastify) {
    const route = fastify.withTypeProvider();
    const feedService = new feedService_1.FeedService();
    route.get('/feed', { schema: getFeedData_schema_1.schema }, async (request, reply) => {
        try {
            const feeds = await feedService.getAllFeeds();
            const response = feeds.map(feed => ({
                id: feed.id || (0, uuid_1.v4)(),
                url: feed.link || '',
                title: feed.title || null,
                createdAt: feed.createdAt || new Date().toISOString(),
            }));
            reply.send(response);
        }
        catch (error) {
            reply.status(500).send({ error: "Failed to fetch feeds" });
        }
    });
}
