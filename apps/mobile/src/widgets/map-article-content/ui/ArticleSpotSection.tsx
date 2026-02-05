/**
 * 記事スポットセクション
 *
 * 記事内の各スポットを表示するコンポーネント
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThumbnailHeight, colors, iconSizeNum } from '@/shared/config';
import { RichTextRenderer, AddressPinIcon, PopupMenu, type PopupMenuItem, OptimizedImage, CroppedThumbnail } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import type { SpotWithImages } from '@/shared/types';
import { extractImageUrls } from '@/shared/types';

interface ArticleSpotSectionProps {
  spot: SpotWithImages;
  index: number;
  /** オーナーかどうか（非公開スポットの鍵マーク表示に使用） */
  isOwner?: boolean;
  /** 三点リーダメニューに表示するアイテム */
  menuItems?: PopupMenuItem[];
  /** スポット名タップ時（スポット記事ページへ遷移） */
  onSpotPress: () => void;
  /** マップアイコンタップ時（マップ画面へ遷移） */
  onMapPress?: () => void;
  onImagePress?: (imageUrls: string[], index: number) => void;
  /** スポットを編集（オーナーのみ） */
  onEditSpotPress?: () => void;
}

export function ArticleSpotSection({ spot, index, isOwner, menuItems = [], onSpotPress, onMapPress, onImagePress, onEditSpotPress }: ArticleSpotSectionProps) {
  const { t } = useI18n();
  const [sectionWidth, setSectionWidth] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) setSectionWidth(width);
  }, []);

  // サムネイル画像サイズの計算（OGP/SNS共有用に1.91:1）
  // 親のpx-4でパディング済みなのでsectionWidthをそのまま使用
  const imageWidth = sectionWidth;
  const imageHeight = getThumbnailHeight(imageWidth);
  // スポット名（spot.languageで抽出）
  // master_spotがある場合はその名前（JSONB）、ない場合（ピン刺し・現在地登録）はspot.name（TEXT）を使用
  const spotLanguage = spot.language || 'ja';
  const spotName = spot.master_spot?.name
    ? extractName(spot.master_spot.name, spotLanguage) || t('article.unknownSpot')
    : (spot.name ? spot.name : null) || t('article.unknownSpot');
  // 住所（spot.languageで抽出）
  const address = extractAddress(spot.master_spot?.google_short_address, spotLanguage)
    || extractAddress(spot.google_short_address, spotLanguage);

  // 記事内に挿入された画像URLを抽出
  const articleImageUrls = useMemo(() => {
    return extractImageUrls(spot.article_content);
  }, [spot.article_content]);

  // サムネイル画像を選択
  // 1. thumbnail_image_idが指定されていればその画像を優先
  // 2. なければ記事内に挿入されていない画像からorder_indexが最小のものを選択
  const thumbnailImage = useMemo(() => {
    // thumbnail_image_idが指定されている場合はその画像を優先
    if (spot.thumbnail_image_id) {
      const specifiedImage = spot.images.find((img) => img.id === spot.thumbnail_image_id);
      if (specifiedImage) return specifiedImage;
    }
    // 記事内に挿入されていない画像からorder_indexが最小のものを選択
    const remainingImages = spot.images.filter((img) => {
      if (!img.cloud_path) return false;
      // cloud_pathがarticleImageUrlsに含まれているかチェック
      return !articleImageUrls.some((url: string) => url.includes(img.cloud_path!));
    });
    // order_indexでソートして最初の1枚を返す
    if (remainingImages.length === 0) return null;
    return remainingImages.sort((a, b) => a.order_index - b.order_index)[0]!;
  }, [spot.images, spot.thumbnail_image_id, articleImageUrls]);

  // オーナー用編集メニュー項目を追加
  const allMenuItems: PopupMenuItem[] = [...menuItems];
  if (onEditSpotPress) {
    // 編集は先頭に追加
    allMenuItems.unshift({
      id: 'edit-spot',
      label: t('article.editSpot'),
      icon: 'create-outline',
      onPress: onEditSpotPress,
    });
  }

  return (
    <View className="mb-10" onLayout={handleLayout}>
      {/* セクション番号とスポット名 */}
      <View className="flex-row items-start mb-1">
        <Pressable onPress={onSpotPress} className="flex-row items-start flex-1 mr-2">
          <Text className="text-xl font-bold text-on-surface mr-2">{index}.</Text>
          <Text className="text-xl font-bold text-on-surface flex-shrink">
            {/* オーナーの場合、非公開スポットに鍵マークを表示（スポット名の前にインライン） */}
            {isOwner && spot.is_public === false && (
              <><Ionicons name="lock-closed" size={iconSizeNum.sm} className="text-on-surface-variant" /> </>
            )}
            {spotName}
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-4 flex-shrink-0">
          {onMapPress && (
            <Pressable onPress={onMapPress} className="h-7 justify-center" hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
              <Ionicons name="map-outline" size={iconSizeNum.md} className="text-gray-400" />
            </Pressable>
          )}
          {allMenuItems.length > 0 && (
            <View className="h-7 justify-center">
              <PopupMenu items={allMenuItems} triggerSize={20} hitSlop={4} />
            </View>
          )}
        </View>
      </View>

      {/* 住所（スポット名の下） */}
      {address && (
        <View className="flex-row items-center mb-3">
          <AddressPinIcon size={iconSizeNum.xs} color={colors.light['on-surface-variant']} />
          <Text className="text-sm text-on-surface-variant ml-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      )}

      {/* サムネイル画像（記事に挿入されていない画像から1枚表示） */}
      {thumbnailImage && imageWidth > 0 && (
        <Pressable
          onPress={() => onImagePress?.([thumbnailImage.cloud_path || ''], 0)}
          className="mb-4"
        >
          {spot.thumbnail_crop && thumbnailImage.cloud_path ? (
            <CroppedThumbnail
              url={thumbnailImage.cloud_path}
              crop={spot.thumbnail_crop}
              width={imageWidth}
            />
          ) : (
            <OptimizedImage
              url={thumbnailImage.cloud_path}
              width={imageWidth}
              height={imageHeight}
              quality={85}
            />
          )}
        </Pressable>
      )}

      {/* ユーザーの一言（写真の下、大きく太く） */}
      {spot.description && (
        <Text className="text-lg font-bold text-on-surface mb-6">
          {spot.description}
        </Text>
      )}

      {/* 記事内容 */}
      {spot.article_content ? (
        <RichTextRenderer
          content={spot.article_content}
          textClassName="text-base text-on-surface leading-loose"
        />
      ) : (
        <View className="py-8">
          <Text className="text-sm text-on-surface-variant text-center">
            {t('article.noDescription')}
          </Text>
        </View>
      )}
    </View>
  );
}
