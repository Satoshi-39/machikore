/**
 * 記事スポットセクション
 *
 * 記事内の各スポットを表示するコンポーネント
 */

import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { SpotWithImages } from '@/shared/types';

interface ArticleSpotSectionProps {
  spot: SpotWithImages;
  index: number;
  onPress: () => void;
  onImagePress?: (imageUrls: string[], index: number) => void;
}

export function ArticleSpotSection({ spot, index, onPress, onImagePress }: ArticleSpotSectionProps) {
  const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
  const address = spot.master_spot?.google_short_address || spot.google_short_address;

  return (
    <View className="mb-6 pb-6 border-b border-border-light dark:border-dark-border-light">
      {/* セクション番号とスポット名 */}
      <Pressable onPress={onPress} className="flex-row items-center mb-2">
        <Text className="text-foreground dark:text-dark-foreground font-bold text-base mr-2">{index}.</Text>
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground flex-1">{spotName}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
      </Pressable>

      {/* 一言メモ（スポット名のすぐ下） */}
      {spot.description && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
          {spot.description}
        </Text>
      )}

      {/* スポット画像 */}
      {spot.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2 -mx-4 px-4"
        >
          {spot.images.map((image, imageIndex) => {
            const imageUrls = spot.images.map(img => img.cloud_path || '').filter(Boolean);
            return (
              <Pressable
                key={image.id}
                onPress={() => onImagePress?.(imageUrls, imageIndex)}
              >
                <Image
                  source={{ uri: image.cloud_path || '' }}
                  className="w-48 h-36 rounded-lg mr-2"
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* 住所（写真の下） */}
      {address && (
        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={14} color={colors.gray[400]} />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      )}

      {/* 記事内容 */}
      {spot.article_content ? (
        <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-6">
          {spot.article_content}
        </Text>
      ) : (
        <View className="py-4 px-3 bg-surface dark:bg-dark-surface rounded-lg border border-border dark:border-dark-border">
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
            まだ紹介文がありません
          </Text>
        </View>
      )}
    </View>
  );
}
