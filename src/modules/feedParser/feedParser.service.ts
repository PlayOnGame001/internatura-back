import Parser from "rss-parser";
import retry from "async-retry";
import * as cheerio from "cheerio";

const parser = new Parser({
  customFields: {
    item: ['guid', 'content:encoded', 'description']
  }
});

export async function parseFeed(url: string) {
  return retry(
    async () => {
      console.log('🔍 Parsing RSS from:', url);
      const feed = await parser.parseURL(url);
      return feed.items.map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        content: item['content:encoded'] || item.content || item.contentSnippet || item.description || '',
        guid: item.guid || item.link,
      }));
    },
    { 
      retries: 3,
      onRetry: (error: Error, attempt: number) => {
      }
    }
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
  
  const content = $("p")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");

  return {
    url,
    title,
    content,
  };
}