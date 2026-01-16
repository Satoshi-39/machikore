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
import { getThumbnailHeight, colors } from '@/shared/config';
import { MapThumbnail } from '@/shared/ui';
import type { SpotWithDetails, TagBasicInfo } from '@/shared/types';

interface MapInfoModalProps {
  visible: boolean;
  onClose: () => void;
  mapTitle?: string;
  mapDescription?: string | null;
  mapThumbnailUrl?: string | null;
  mapTags?: TagBasicInfo[];
  spots?: SpotWithDetails[];
  onSpotPress?: (spotId: string) => void;
}

export function MapInfoModal({
  visible,
  onClose,
  mapTitle,
  mapDescription,
  mapThumbnailUrl,
  mapTags = [],
  spots = [],
  onSpotPress,
}: MapInfoModalProps) {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

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
          className="bg-surface-secondary dark:bg-dark-surface-secondary rounded-b-3xl shadow-2xl"
          style={{
            maxHeight: '70%',
            paddingTop: insets.top,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ヘッダー */}
          <View className="flex-row items-center justify-center px-6 py-4 border-b border-border-light dark:border-dark-border-light">
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
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
                <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
                  {mapTitle}
                </Text>

                {/* マップの概要 */}
                {mapDescription && (
                  <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-2 leading-5">
                    {mapDescription}
                  </Text>
                )}

                {/* タグ */}
                {mapTags.length > 0 && (
                  <View className="flex-row flex-wrap gap-x-3 gap-y-1 mt-2">
                    {mapTags.map((tag) => (
                      <Text
                        key={tag.id}
                        className="text-sm text-primary dark:text-primary-light"
                      >
                        #{tag.name}
                      </Text>
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
                defaultImagePadding={0.1}
                backgroundColor={isDarkMode ? colors.black : undefined}
              />
            </View>

            {/* スポット一覧 */}
            {spots.length > 0 && (
              <View className="mt-6">
                <Text className="text-base font-bold text-foreground dark:text-dark-foreground mb-3">
                  {t('userMap.spotList')} ({spots.length})
                </Text>
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
                      <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mr-2">
                        {index + 1}.
                      </Text>
                      <Text
                        className="flex-1 text-base text-foreground dark:text-dark-foreground"
                        numberOfLines={1}
                      >
                        {getSpotName(spot)}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* 下部余白 */}
            <View className="h-4" />
          </ScrollView>
        </Animated.View>

        {/* 背景タップで閉じる */}
        <Pressable className="flex-1" onPress={onClose} />
      </View>
    </Modal>
  );
}
