"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedParserService = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
const async_retry_1 = __importDefault(require("async-retry"));
class FeedParserService {
    parser;
    constructor() {
        this.parser = new rss_parser_1.default();
    }
    async parse(url) {
        return (0, async_retry_1.default)(async () => {
            const feed = await this.parser.parseURL(url);
            return feed.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.content,
            }));
        }, { retries: 3 } // ретрай до 3 раз при ошибках
        );
    }
}
exports.FeedParserService = FeedParserService;
