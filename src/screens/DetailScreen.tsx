import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { formatDate } from '../utils/html';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route }: Props) {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
      ) : (
        <View style={[styles.heroImage, styles.heroPlaceholder]}>
          <Text style={styles.heroPlaceholderText}>📰</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.pubDate)}</Text>
        <Text style={styles.text}>{item.content}</Text>
      </View>
      <Pressable style={styles.sourceButton} onPress={() => Linking.openURL(item.link)}>
        <Text style={styles.sourceButtonText}>Kaynak: {item.sourceName} — Haberin tamamını oku ↗</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#e5e7eb',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderText: {
    fontSize: 56,
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#9ca3af',
  },
  text: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  sourceButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  sourceButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
