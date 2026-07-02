import { XMLParser } from 'fast-xml-parser';
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

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => name === 'item',
});

function extractImage(item: Record<string, unknown>): string | null {
  const media = item['media:content'] as Record<string, string> | undefined;
  if (media?.['@_url']) return media['@_url'];

  const enclosure = item['enclosure'] as Record<string, string> | undefined;
  if (enclosure?.['@_url']) return enclosure['@_url'];

  const thumbnail = item['media:thumbnail'] as Record<string, string> | undefined;
  if (thumbnail?.['@_url']) return thumbnail['@_url'];

  const description = (item['description'] as string) || (item['content:encoded'] as string) || '';
  return extractFirstImage(description);
}

async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  const response = await fetch(source.url, {
    headers: { 'User-Agent': 'TeknolojiHaberleri/1.0' },
  });
  if (!response.ok) {
    throw new Error(`${source.name} alınamadı (${response.status})`);
  }
  const xml = await response.text();
  const parsed = parser.parse(xml);

  const items: Record<string, unknown>[] = parsed?.rss?.channel?.item ?? [];

  return items.map((item, index) => {
    const descHtml = (item['description'] as string) || (item['content:encoded'] as string) || '';
    const contentHtml = (item['content:encoded'] as string) || (item['description'] as string) || '';
    const link = (item['link'] as string) || '';
    const guid = (item['guid'] as string) || link || String(index);

    return {
      id: guid,
      title: stripHtml(String(item['title'] || '')),
      summary: truncate(stripHtml(descHtml), 160),
      content: stripHtml(contentHtml),
      imageUrl: extractImage(item),
      link,
      sourceName: source.name,
      pubDate: String(item['pubDate'] || ''),
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
