import Parser from "rss-parser";
import retry from "async-retry";

const parser = new Parser();

export async function parseFeed(url: string) {
  return retry(
    async () => {
      const feed = await parser.parseURL(url);
      return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.content,
      }));
    },
    { retries: 3 }
  );
}
