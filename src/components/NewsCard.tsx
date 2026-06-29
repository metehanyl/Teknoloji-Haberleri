import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NewsItem } from '../types/news';
import { formatDate } from '../utils/html';

interface Props {
  item: NewsItem;
  onPress: () => void;
  onSourcePress: () => void;
}

export default function NewsCard({ item, onPress, onSourcePress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Text style={styles.thumbnailPlaceholderText}>📰</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {item.summary}
          </Text>
          <Text style={styles.date}>{formatDate(item.pubDate)}</Text>
        </View>
      </View>
      <Pressable style={styles.sourceRow} onPress={onSourcePress} hitSlop={8}>
        <Text style={styles.sourceText}>Kaynak: {item.sourceName} ↗</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  summary: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 4,
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
  },
  sourceRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
});
