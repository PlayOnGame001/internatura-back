import { parseFeed } from "../feedParser.service";

let feedCache: any = null;
let lastUrl = "";

export async function getFeed(url?: string, force?: boolean) {
  const feedUrl = url || "https://default-rss-url.com/feed";

  if (feedCache && lastUrl === feedUrl && !force) {
    return feedCache;
  }

  const feed = await parseFeed(feedUrl);
  feedCache = feed;
  lastUrl = feedUrl;

  return feed;
}

export async function getAllFeeds() {
  return feedCache || [];
}
