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
import { extractName } from '@/shared/lib/utils/multilang.utils';
import type { SpotWithDetails, TagBasicInfo } from '@/shared/types';

interface MapInfoModalProps {
  visible: boolean;
  onClose: () => void;
  mapTitle?: string;
  mapDescription?: string | null;
  mapTags?: TagBasicInfo[];
  spots?: SpotWithDetails[];
  onSpotPress?: (spotId: string) => void;
}

export function MapInfoModal({
  visible,
  onClose,
  mapTitle,
  mapDescription,
  mapTags = [],
  spots = [],
  onSpotPress,
}: MapInfoModalProps) {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();

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
          className="bg-surface dark:bg-dark-surface-secondary rounded-b-3xl shadow-2xl"
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
            {/* マップ名 */}
            <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
              {mapTitle}
            </Text>

            {/* タグ */}
            {mapTags.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {mapTags.map((tag) => (
                  <View
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20"
                  >
                    <Text className="text-sm text-primary dark:text-primary-light">
                      #{tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* マップの概要 */}
            {mapDescription && (
              <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary mt-4 leading-6">
                {mapDescription}
              </Text>
            )}

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
                      className="flex-row items-center py-2 px-3 rounded-lg bg-background dark:bg-dark-surface-secondary active:opacity-70"
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
