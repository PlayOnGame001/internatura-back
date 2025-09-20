"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const feedParser_service_1 = require("../feedParser.service");
class FeedService {
    feedCache = null;
    lastUrl = '';
    parserService;
    constructor() {
        this.parserService = new feedParser_service_1.FeedParserService();
    }
    async getFeed(url, force) {
        const feedUrl = url || 'https://default-rss-url.com/feed';
        if (this.feedCache && this.lastUrl === feedUrl && !force) {
            return this.feedCache;
        }
        const feed = await this.parserService.parse(feedUrl);
        this.feedCache = feed;
        this.lastUrl = feedUrl;
        return feed;
    }
    async getAllFeeds() {
        return this.feedCache || [];
    }
}
exports.FeedService = FeedService;
