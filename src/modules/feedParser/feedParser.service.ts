import Parser from 'rss-parser';
import retry from 'async-retry';

export class FeedParserService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async parse(url: string) {
    return retry(
      async () => {
        const feed = await this.parser.parseURL(url);
        return feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
        }));
      },
      { retries: 3 } // ретрай до 3 раз при ошибках
    );
  }
}
