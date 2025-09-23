import { parseFeed as parseRssFeed } from "../feedParser.service";
import * as cheerio from "cheerio";

let feedCache: any = null;
let lastUrl = "";

export async function getFeed(url?: string, force?: boolean) {
  const feedUrl = url || "https://default-rss-url.com/feed";

  if (feedCache && lastUrl === feedUrl && !force) {
    return feedCache;
  }

  const feed = await parseRssFeed(feedUrl);
  feedCache = feed;
  lastUrl = feedUrl;

  return feed;
}

export async function getAllFeeds() {
  return feedCache || [];
}

export async function parseArticle(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка при загрузке страницы");
    const html = await res.text();

    const $ = cheerio.load(html);

    const title = $("title").text();
    const content = $("body").text().trim();

    return { title, content };
  } catch (err) {
    throw new Error("Не удалось спарсить статью: " + err);
  }
}

export { parseRssFeed as parseFeed };
