import { PrismaClient } from '@prisma/client';
import { parseFeed as parseRssFeed } from "../feedParser.service";
import * as cheerio from "cheerio";
import { FeedItem, FeedCache } from "../types/types";

const prisma = new PrismaClient();

let feedCache: FeedCache | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export async function getAllFeeds() {
  try {
    const feeds = await prisma.feed.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return feeds;
  } catch (error) {
    console.error('❌ Error fetching feeds from DB:', error);
    throw error;
  }
}

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
    const title = $("h1").first().text().trim() || $("title").text().trim();
    $("script, style, nav, header, footer, aside, noscript, iframe, .advertisement, .ads, .promo, .subscribe, .related, .comments, .footer, .header, .top-bredcr ").remove();

    let content = "";
    if ($("article").length) {
      content = $("article").text().trim();
    } else if ($("main").length) {
      content = $("main").text().trim();
    } else {
      content = $("body").text().trim();
    }
    const unwantedPatterns = [
      /Читайте також[\s\S]*$/i,
      /Новини партнерів[\s\S]*$/i,
      /Читайте УНІАН[\s\S]*$/i,
      /Інформаційне агентство\+ Новини› Війна\s*$/i,
      /Допоможіть проєкту[\s\S]*$/i
    ];
    unwantedPatterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    content = content.replace(/\s+/g, ' ').trim();
    content = content.substring(0, 5000);

    return {
      title,
      content,
      url
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error("Не удалось спарсить статью: " + message);
  }
}

export { parseRssFeed as parseFeed };