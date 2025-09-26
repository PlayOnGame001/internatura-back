import Parser from "rss-parser";
import retry from "async-retry";
import * as cheerio from "cheerio";

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

export async function parseArticle(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $("title").text();
  const content = $("p").map((_, el) => $(el).text()).get().join("\n");

  return {
    url,
    title,
    content,
  };
}