import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ukrainianFeeds = [
  {
    url: "https://rss.unian.net/site/news_ukr.rss",
    title: "УНІАН",
  },
];

export async function initializeFeeds() {
  try {
    console.log('🔄 Initializing feeds...');
    
    for (const feed of ukrainianFeeds) {
      const existingFeed = await prisma.feed.findUnique({
        where: { url: feed.url },
      });

      if (!existingFeed) {
        await prisma.feed.create({
          data: {
            url: feed.url,
            title: feed.title,
          },
        });
        console.log(`Created feed: ${feed.title}`);
      } else {
        console.log(`Feed already exists: ${feed.title}`);
      }
    }
    
    console.log('✅ Feeds initialization completed');
  } catch (error) {
    console.error('❌ Error initializing feeds:', error);
    throw error;
  }
}