export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  link: string;
  sourceName: string;
  pubDate: string;
}
