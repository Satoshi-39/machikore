/**
 * マップ情報モーダル
 *
 * マップ名、タグ、概要、スポット一覧を表示するモーダル
 * 上からスライドダウンするアニメーション付き
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { extractName } from '@/shared/lib/utils/multilang.utils';
import { shareMap } from '@/shared/lib';
import { getThumbnailHeight, colors } from '@/shared/config';
import { MapThumbnail, PrivateBadge, TagChip } from '@/shared/ui';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';
import type { SpotWithDetails, TagBasicInfo } from '@/shared/types';

interface MapInfoModalProps {
  visible: boolean;
  onClose: () => void;
  mapId: string;
  mapTitle?: string;
  mapDescription?: string | null;
  mapThumbnailUrl?: string | null;
  mapTags?: TagBasicInfo[];
  spots?: SpotWithDetails[];
  onSpotPress?: (spotId: string) => void;
  /** タグタップ時のコールバック */
  onTagPress?: (tagName: string) => void;
  /** 記事アイコンタップ時のコールバック */
  onArticlePress?: () => void;
  /** 現在のユーザーID（オーナー判定用） */
  currentUserId?: string | null;
  /** マップオーナーのユーザーID */
  mapOwnerId?: string;
  /** いいね済みかどうか */
  isLiked?: boolean;
  /** いいね数 */
  likesCount?: number;
}

export function MapInfoModal({
  visible,
  onClose,
  mapId,
  mapTitle,
  mapDescription,
  mapThumbnailUrl,
  mapTags = [],
  spots = [],
  onSpotPress,
  onTagPress,
  onArticlePress,
  currentUserId,
  mapOwnerId,
  isLiked = false,
  likesCount = 0,
}: MapInfoModalProps) {
  // オーナーかどうかの判定
  const isOwner = currentUserId && mapOwnerId && currentUserId === mapOwnerId;
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // いいねユーザー一覧モーダル
  const [isLikersModalVisible, setIsLikersModalVisible] = React.useState(false);

  const handleSharePress = useCallback(async () => {
    if (!mapId) return;
    await shareMap(mapId);
  }, [mapId]);

  // スポット名を取得するヘルパー
  const getSpotName = useCallback(
    (spot: SpotWithDetails): string => {
      if (spot.master_spot?.name) {
        return extractName(spot.master_spot.name, locale) || t('spot.unknownSpot');
      }
      if (spot.name) {
        return extractName(spot.name, locale) || t('spot.unknownSpot');
      }
      return t('spot.unknownSpot');
    },
    [locale, t]
  );
  const slideAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -500,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Animated.View
          className="bg-surface-variant rounded-b-3xl shadow-2xl"
          style={{
            maxHeight: '70%',
            paddingTop: insets.top,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ヘッダー */}
          <View className="flex-row items-center justify-center px-6 py-4 border-b border-outline-variant">
            <Text className="text-lg font-bold text-on-surface">
              {t('userMap.mapInfo')}
            </Text>
            <Pressable onPress={onClose} className="absolute right-6">
              <Ionicons name="close" size={28} color="#6B7280" />
            </Pressable>
          </View>

          {/* コンテンツ */}
          <ScrollView className="px-6 py-4">
            {/* マップ情報 + サムネイル */}
            <View className="flex-row">
              {/* 左側: マップ名・概要・タグ */}
              <View className="flex-1 mr-3">
                <Text className="text-lg font-bold text-on-surface">
                  {mapTitle}
                </Text>

                {/* マップの概要 */}
                {mapDescription && (
                  <Text className="text-sm text-on-surface-variant mt-2 leading-5">
                    {mapDescription}
                  </Text>
                )}

                {/* タグ */}
                {mapTags.length > 0 && (
                  <View className="flex-row flex-wrap mt-2">
                    {mapTags.map((tag) => (
                      <TagChip key={tag.id} name={tag.name} onPress={onTagPress} />
                    ))}
                  </View>
                )}
              </View>

              {/* 右側: サムネイル */}
              <MapThumbnail
                url={mapThumbnailUrl}
                width={112}
                height={getThumbnailHeight(112)}
                borderRadius={6}
                showBorderOnDefault
              />
            </View>

            {/* いいね・保存ボタン */}
            <View className="flex-row items-center mt-3 gap-5">
              {/* いいねボタン */}
              <MapLikeButton
                mapId={mapId}
                currentUserId={currentUserId}
                isLiked={isLiked}
                likesCount={likesCount}
                size={16}
                showCount={true}
                hideCountWhenZero={true}
                onCountPress={() => setIsLikersModalVisible(true)}
                inactiveColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
                textMarginClassName="ml-1.5"
              />

              {/* 保存ボタン */}
              <MapBookmarkButton
                mapId={mapId}
                currentUserId={currentUserId}
                size={16}
                inactiveColor={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
              />

              {/* 共有ボタン */}
              <Pressable
                onPress={handleSharePress}
                hitSlop={8}
              >
                <Ionicons
                  name="share-outline"
                  size={16}
                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
                />
              </Pressable>

              {/* 記事ボタン */}
              <Pressable
                onPress={() => {
                  onArticlePress?.();
                  onClose();
                }}
                hitSlop={8}
              >
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]}
                />
              </Pressable>
            </View>

            {/* スポット一覧 */}
            <View className="mt-6">
              <Text className="text-base font-bold text-on-surface mb-3">
                {t('userMap.spotList')} ({spots.length})
              </Text>
              {spots.length > 0 ? (
                <View className="gap-2">
                  {spots.map((spot, index) => (
                    <Pressable
                      key={spot.id}
                      onPress={() => {
                        onSpotPress?.(spot.id);
                        onClose();
                      }}
                      className="flex-row items-center py-2 px-3 rounded-lg active:opacity-70"
                    >
                      <Text className="text-sm text-on-surface-variant mr-2">
                        {index + 1}.
                      </Text>
                      <Text
                        className="text-base text-on-surface flex-shrink"
                        numberOfLines={1}
                      >
                        {getSpotName(spot)}
                      </Text>
                      {/* 非公開バッジ（オーナーのみ表示） */}
                      {isOwner && spot.is_public === false && (
                        <PrivateBadge size="sm" className="ml-1.5" />
                      )}
                      <View className="flex-1" />
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View className="items-center py-6">
                  <Text className="text-sm text-on-surface-variant">
                    {t('userMap.noSpots')}
                  </Text>
                </View>
              )}
            </View>

            {/* 下部余白 */}
            <View className="h-4" />
          </ScrollView>
        </Animated.View>

        {/* 背景タップで閉じる */}
        <Pressable className="flex-1" onPress={onClose} />
      </View>

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        mapId={mapId}
        onClose={() => setIsLikersModalVisible(false)}
      />
    </Modal>
  );
}
