/**
 * SpotCardCarousel Widget
 *
 * SpotCard（カルーセル版）の横スクロールカルーセル
 * FSD: Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * 動画広告（carousel_video）をカルーセル内に表示可能
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpotCard } from '@/entities/user-spot';
import { colors } from '@/shared/config';
import { SpotNativeAdCard } from '@/shared/ui';
import type { SpotWithDetails, UUID } from '@/shared/types';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import { useI18n } from '@/shared/lib/i18n';

/** カードの幅（画面幅の85%） */
const CARD_WIDTH_RATIO = 0.85;

interface SpotCardCarouselProps {
  /** セクションタイトル */
  title?: string;
  /** 表示するスポット一覧 */
  spots: (SpotWithDetails | UserSpotSearchResult)[];
  /** 現在のユーザーID */
  currentUserId?: UUID | null;
  /** カード全体タップ時のコールバック（スポット記事への遷移用） */
  onSpotPress?: (spotId: string) => void;
  /** ユーザータップ時のコールバック */
  onUserPress?: (userId: string) => void;
  /** マップアイコンタップ時のコールバック（マップ内スポットへの遷移用） */
  onMapPress?: (spotId: string, mapId: string) => void;
  /** コメントタップ時のコールバック */
  onCommentPress?: (spotId: string) => void;
  /** タグタップ時のコールバック */
  onTagPress?: (tagName: string) => void;
  /** 「すべて見る」タップ時のコールバック */
  onSeeAllPress?: () => void;
  /** 編集コールバック */
  onEdit?: (spotId: string) => void;
  /** 削除コールバック */
  onDelete?: (spotId: string) => void;
  /** 通報コールバック */
  onReport?: (spotId: string) => void;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** 動画広告を表示するか（カルーセル内に挿入） */
  showVideoAd?: boolean;
}

export function SpotCardCarousel({
  title,
  spots,
  currentUserId,
  onSpotPress,
  onUserPress,
  onMapPress,
  onCommentPress,
  onTagPress,
  onSeeAllPress,
  onEdit,
  onDelete,
  onReport,
  isLoading = false,
  showVideoAd = false,
}: SpotCardCarouselProps) {
  const { t } = useI18n();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * CARD_WIDTH_RATIO;

  if (isLoading) {
    return (
      <View className="py-4">
        {title && (
          <Text className="text-lg font-bold text-on-surface px-4 mb-3">
            {title}
          </Text>
        )}
        <View className="h-64 justify-center items-center">
          <Text className="text-on-surface-variant">
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  if (spots.length === 0) {
    return null;
  }

  return (
    <View className="py-4 border-b border-outline">
      {/* ヘッダー */}
      {(title || onSeeAllPress) && (
        <View className="flex-row items-center justify-between px-4 mb-3">
          {title && (
            <Text className="text-lg font-bold text-on-surface">
              {title}
            </Text>
          )}
          {onSeeAllPress && (
            <Pressable
              onPress={onSeeAllPress}
              className="flex-row items-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-sm text-primary mr-1">
                {t('common.seeAll')}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary.DEFAULT} />
            </Pressable>
          )}
        </View>
      )}

      {/* カルーセル */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        decelerationRate="fast"
        snapToInterval={cardWidth + 12} // カード幅 + マージン
        snapToAlignment="start"
      >
        {spots.map((spot, index) => (
          <React.Fragment key={spot.id}>
            <View style={{ width: cardWidth, marginRight: 12, justifyContent: 'center' }}>
              <SpotCard
                spot={spot}
                currentUserId={currentUserId}
                variant="carousel"
                cardWidth={cardWidth}
                onPress={onSpotPress}
                onUserPress={onUserPress}
                onMapPress={onMapPress}
                onCommentPress={onCommentPress}
                onTagPress={onTagPress}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
                noBorder
              />
            </View>
            {/* スポット2つ目の後に動画広告を挿入 */}
            {showVideoAd && index === 1 && (
              <View style={{ width: cardWidth, marginRight: 12, justifyContent: 'center' }}>
                <SpotNativeAdCard cardWidth={cardWidth} />
              </View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}
