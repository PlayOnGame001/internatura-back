import { FeedParserService } from '../feedParser.service';

export class FeedService {
  private feedCache: any = null;
  private lastUrl: string = '';
  private parserService: FeedParserService;

  constructor() {
    this.parserService = new FeedParserService();
  }

  async getFeed(url?: string, force?: boolean) {
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
