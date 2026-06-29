import { NewsItem } from '../types/news';
import { extractFirstImage, stripHtml, truncate } from '../utils/html';

interface FeedSource {
  url: string;
  name: string;
}

const FEEDS: FeedSource[] = [
  { url: 'https://webrazzi.com/feed/', name: 'Webrazzi' },
  { url: 'https://shiftdelete.net/feed', name: 'ShiftDelete.Net' },
  { url: 'https://www.webtekno.com/rss.xml', name: 'Webtekno' },
  { url: 'https://www.donanimhaber.com/rss/tum/', name: 'Donanımhaber' },
];

const RSS_TO_JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json';

interface RawFeedItem {
  guid?: string;
  link: string;
  title: string;
  description?: string;
  content?: string;
  pubDate: string;
  thumbnail?: string;
  enclosure?: { link?: string };
}

interface RawFeedResponse {
  status: string;
  items: RawFeedItem[];
}

async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  const requestUrl = `${RSS_TO_JSON_ENDPOINT}?rss_url=${encodeURIComponent(source.url)}&count=20`;
  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error(`${source.name} alınamadı (${response.status})`);
  }
  const data: RawFeedResponse = await response.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error(`${source.name} geçersiz yanıt döndürdü`);
  }

  return data.items.map((item) => {
    const summaryHtml = item.description || item.content || '';
    const fullHtml = item.content || item.description || '';
    const image = item.thumbnail || item.enclosure?.link || extractFirstImage(fullHtml);

    return {
      id: item.guid || item.link,
      title: stripHtml(item.title),
      summary: truncate(stripHtml(summaryHtml), 160),
      content: stripHtml(fullHtml),
      imageUrl: image || null,
      link: item.link,
      sourceName: source.name,
      pubDate: item.pubDate,
    };
  });
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const items: NewsItem[] = [];
  let allFailed = true;
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allFailed = false;
      items.push(...result.value);
    }
  }

  if (allFailed) {
    throw new Error('Haberler yüklenemedi. İnternet bağlantınızı kontrol edin.');
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return items;
}
