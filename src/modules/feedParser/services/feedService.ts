import { parseFeed as parseRssFeed } from "../feedParser.service";
import * as cheerio from "cheerio";
import { FeedItem, FeedCache} from "../types/types";

let feedCache: FeedCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export async function getFeed(url?: string, force?: boolean): Promise<FeedItem[]> {
  const feedUrl = url || "https://news.ycombinator.com/rss";
  
  const now = Date.now();
  const isCacheValid = 
    feedCache !== null && 
    feedCache.url === feedUrl && 
    (now - feedCache.timestamp) < CACHE_TTL &&
    !force;

  if (isCacheValid && feedCache !== null) {
    return feedCache.items;
  }

  try {
    const parsedItems = await parseRssFeed(feedUrl);
    
    const feedItems: FeedItem[] = parsedItems.map(item => ({
      id: item.guid || item.link || crypto.randomUUID(),
      url: item.link || '',
      link: item.link || '',
      title: item.title || null,
      content: item.content || '',
      pubDate: item.pubDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));


    feedCache = {
      items: feedItems,
      url: feedUrl,
      timestamp: now
    };

    return feedItems;
  } catch (error) {
    return feedCache?.items || [];
  }
}

export async function getAllFeeds(): Promise<FeedItem[]> {
  
  if (!feedCache) {
    return await getFeed();
  }
  
  return feedCache.items;
}

export function saveFeedToCache(url: string, items: FeedItem[]): void {
  feedCache = {
    items,
    url,
    timestamp: Date.now()
  };
}

export async function parseArticle(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const html = await res.text();

    const $ = cheerio.load(html);

    const title = $("h1").first().text() || $("title").text();
    
    $("script, style, nav, header, footer").remove();
    const content = $("article").text().trim() || 
                   $("main").text().trim() || 
                   $("body").text().trim();

    return { 
      title: title.trim(), 
      content: content.substring(0, 5000)
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error("Не удалось спарсить статью: " + message);
  }
}

export { parseRssFeed as parseFeed };