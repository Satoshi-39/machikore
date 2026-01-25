/**
 * SpotShortCarousel Widget
 *
 * YouTubeショートのような縦型スポットカードの横スクロールカルーセル
 * FSD: Widget層 - 複数のEntityを組み合わせた複合コンポーネント
 * タップでフルスクリーンビューアを起動
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpotShortCard } from '@/entities/user-spot';
import { ShortViewerModal, type ShortItem } from '@/features/short-viewer';
import type { SpotWithDetails } from '@/shared/types';
import type { UserSpotSearchResult } from '@/shared/api/supabase';
import { useI18n } from '@/shared/lib/i18n';

interface SpotShortCarouselProps {
  /** セクションタイトル */
  title?: string;
  /** 表示するスポット一覧 */
  spots: (SpotWithDetails | UserSpotSearchResult)[];
  /** スポットタップ時のコールバック（ビューア内から呼ばれる） */
  onSpotPress?: (spotId: string, mapId: string) => void;
  /** ユーザータップ時のコールバック */
  onUserPress?: (userId: string) => void;
  /** 「すべて見る」タップ時のコールバック */
  onSeeAllPress?: () => void;
  /** カードの幅 */
  cardWidth?: number;
  /** ローディング中かどうか */
  isLoading?: boolean;
}

export function SpotShortCarousel({
  title,
  spots,
  onSpotPress,
  onUserPress,
  onSeeAllPress,
  cardWidth,
  isLoading = false,
}: SpotShortCarouselProps) {
  const { t } = useI18n();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);

  // 動画URLを持つスポットをShortItem形式に変換
  const shortItems = useMemo((): ShortItem[] => {
    return spots
      .filter((spot): spot is SpotWithDetails & { video_url: string } =>
        'video_url' in spot && typeof spot.video_url === 'string' && spot.video_url.length > 0
      )
      .map((spot) => ({
        spot: spot as SpotWithDetails,
        videoUrl: spot.video_url,
      }));
  }, [spots]);

  // カードタップ時の処理
  const handleCardPress = useCallback((spotId: string, _mapId: string) => {
    // 動画があるスポットの場合はビューアを開く
    const index = shortItems.findIndex((item) => item.spot.id === spotId);
    if (index >= 0) {
      setViewerInitialIndex(index);
      setViewerVisible(true);
    } else {
      // 動画がない場合は従来の動作
      onSpotPress?.(spotId, _mapId);
    }
  }, [shortItems, onSpotPress]);

  const handleCloseViewer = useCallback(() => {
    setViewerVisible(false);
  }, []);

  const handleViewerSpotPress = useCallback((spotId: string, mapId: string) => {
    setViewerVisible(false);
    onSpotPress?.(spotId, mapId);
  }, [onSpotPress]);

  const handleViewerUserPress = useCallback((userId: string) => {
    setViewerVisible(false);
    onUserPress?.(userId);
  }, [onUserPress]);

  if (isLoading) {
    return (
      <View className="py-4">
        {title && (
          <Text className="text-lg font-bold text-on-surface px-4 mb-3">
            {title}
          </Text>
        )}
        <View className="h-48 justify-center items-center">
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
    <View className="py-4">
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
              <Ionicons name="chevron-forward" size={16} className="text-primary" />
            </Pressable>
          )}
        </View>
      )}

      {/* カルーセル */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {spots.map((spot) => (
          <SpotShortCard
            key={spot.id}
            spot={spot}
            onPress={handleCardPress}
            onUserPress={onUserPress}
            width={cardWidth}
            videoUrl={'video_url' in spot ? spot.video_url : undefined}
          />
        ))}
      </ScrollView>

      {/* フルスクリーンビューア */}
      {shortItems.length > 0 && (
        <ShortViewerModal
          visible={viewerVisible}
          onClose={handleCloseViewer}
          items={shortItems}
          initialIndex={viewerInitialIndex}
          onSpotPress={handleViewerSpotPress}
          onUserPress={handleViewerUserPress}
        />
      )}
    </View>
  );
}
