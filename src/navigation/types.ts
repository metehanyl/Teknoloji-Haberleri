import { NewsItem } from '../types/news';

export type RootStackParamList = {
  Home: undefined;
  Detail: { item: NewsItem };
};
