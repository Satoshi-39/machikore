/**
 * 記事スポットセクション
 *
 * 記事内の各スポットを表示するコンポーネント
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { RichTextRenderer, AddressPinIcon } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import type { SpotWithImages } from '@/shared/types';

interface ArticleSpotSectionProps {
  spot: SpotWithImages;
  index: number;
  onPress: () => void;
  onImagePress?: (imageUrls: string[], index: number) => void;
}

export function ArticleSpotSection({ spot, index, onPress, onImagePress }: ArticleSpotSectionProps) {
  const { t, locale } = useI18n();
  // マスタースポット名（JSONB型を現在のlocaleで抽出）
  const masterSpotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('article.unknownSpot')
    : t('article.unknownSpot');
  // JSONB型の住所を現在のlocaleで抽出
  const address = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);

  return (
    <View className="mb-10">
      {/* セクション番号とスポット名 */}
      <Pressable onPress={onPress} className="flex-row items-center mb-1">
        <Text className="text-foreground dark:text-dark-foreground font-bold text-base mr-2">{index}.</Text>
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground flex-1">{masterSpotName}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
      </Pressable>

      {/* ユーザーの一言 */}
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
                  style={{ width: 192, height: 144, borderRadius: 8, marginRight: 8 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* 住所（写真の下） */}
      {address && (
        <View className="flex-row items-center mb-3">
          <AddressPinIcon size={14} color={colors.gray[400]} />
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      )}

      {/* 記事内容 */}
      {spot.article_content ? (
        <RichTextRenderer
          content={spot.article_content}
          textClassName="text-base text-foreground dark:text-dark-foreground leading-6"
        />
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
