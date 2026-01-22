/**
 * 記事スポットセクション
 *
 * 記事内の各スポットを表示するコンポーネント
 */

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { RichTextRenderer, AddressPinIcon, PrivateBadge, PopupMenu, type PopupMenuItem, OptimizedImage } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import type { SpotWithImages } from '@/shared/types';

interface ArticleSpotSectionProps {
  spot: SpotWithImages;
  index: number;
  /** オーナーかどうか（非公開スポットの鍵マーク表示に使用） */
  isOwner?: boolean;
  onPress: () => void;
  onImagePress?: (imageUrls: string[], index: number) => void;
  /** 記事を編集（オーナーのみ） */
  onEditArticlePress?: () => void;
  /** スポットを編集（オーナーのみ） */
  onEditSpotPress?: () => void;
}

export function ArticleSpotSection({ spot, index, isOwner, onPress, onImagePress, onEditArticlePress, onEditSpotPress }: ArticleSpotSectionProps) {
  const { t, locale } = useI18n();
  // スポット名（JSONB型を現在のlocaleで抽出）
  // master_spotがある場合はその名前、ない場合（ピン刺し・現在地登録）はspot.nameを使用
  const spotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, locale) || t('article.unknownSpot')
    : (spot.name ? extractName(spot.name, locale) : null) || t('article.unknownSpot');
  // JSONB型の住所を現在のlocaleで抽出
  const address = extractAddress(spot.master_spot?.google_short_address, locale)
    || extractAddress(spot.google_short_address, locale);

  // オーナー用メニュー項目
  const menuItems: PopupMenuItem[] = [];
  if (onEditSpotPress) {
    menuItems.push({
      id: 'edit-spot',
      label: t('article.editSpot'),
      icon: 'create-outline',
      onPress: onEditSpotPress,
    });
  }
  if (onEditArticlePress) {
    menuItems.push({
      id: 'edit-article',
      label: t('article.editSpotArticle'),
      icon: 'document-text-outline',
      onPress: onEditArticlePress,
    });
  }

  return (
    <View className="mb-10">
      {/* セクション番号とスポット名 */}
      <Pressable onPress={onPress} className="flex-row items-start mb-1">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground mr-2 leading-7">{index}.</Text>
        <View className="flex-row flex-wrap flex-1 flex-shrink mr-2">
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground leading-7">{spotName}</Text>
          {/* オーナーの場合、非公開スポットに鍵マークを表示（スポット名の直後） */}
          {isOwner && spot.is_public === false && (
            <PrivateBadge size={16} className="ml-1" />
          )}
        </View>
        <View className="h-7 justify-center">
          <Ionicons name="map-outline" size={20} color={colors.gray[400]} />
        </View>
        {isOwner && menuItems.length > 0 && (
          <View className="h-7 justify-center ml-4">
            <PopupMenu items={menuItems} triggerSize={20} triggerColor={colors.gray[400]} />
          </View>
        )}
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
                style={{ marginRight: 8 }}
              >
                <OptimizedImage
                  url={image.cloud_path}
                  width={192}
                  height={144}
                  borderRadius={8}
                  quality={75}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* 住所（写真の下） */}
      {address && (
        <View className="flex-row items-center mb-8">
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
        <View className="py-8">
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center">
            {t('article.noDescription')}
          </Text>
        </View>
      )}
    </View>
  );
}
