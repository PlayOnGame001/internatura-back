export interface FeedItem {
  id: string;
  url: string;
  link: string;
  title: string | null;
  content?: string;
  pubDate?: string;
  createdAt: string;
}

export interface FeedCache {
  items: FeedItem[];
  url: string;
  timestamp: number;
}