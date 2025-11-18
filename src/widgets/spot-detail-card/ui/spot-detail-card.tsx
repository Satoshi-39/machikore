/**
 * カスタムマップ上で選択されたスポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import type { SpotRow } from '@/shared/types/database.types';

interface SpotDetailCardProps {
  spot: SpotRow;
  onClose: () => void;
  onSnapChange?: (isExpanded: boolean) => void;
}

export function SpotDetailCard({ spot, onClose, onSnapChange }: SpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // スナップポイント: 35%（小さく表示）、80%（大きく表示）
  const snapPoints = useMemo(() => ['35%', '80%'], []);

  // 初回マウント時に初期状態（縮小状態）を通知
  useEffect(() => {
    // index 0 = 35%（小さく表示）→ isExpanded = false
    onSnapChange?.(false);
  }, [onSnapChange]);

  // スナップ変更時のハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom Sheet index:', index);
    // index 0: 35%（小さく表示）→ ボタン表示
    // index 1: 80%（大きく表示）→ ボタン非表示
    onSnapChange?.(index === 1);
  }, [onSnapChange]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onClose={onClose}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: colors.text.secondary }}
    >
      <BottomSheetScrollView className="px-4"  contentContainerStyle={{ paddingBottom: 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {spot.name}
            </Text>
            {spot.address && (
              <Text className="text-sm text-gray-600">{spot.address}</Text>
            )}
          </View>
          <Pressable
            onPress={onClose}
            className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* 位置情報 */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-1">
            緯度: {spot.latitude.toFixed(4)}, 経度:{' '}
            {spot.longitude.toFixed(4)}
          </Text>
        </View>

        {/* メモ */}
        {spot.memo && (
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.text.secondary}
              />
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                メモ
              </Text>
            </View>
            <Text className="text-sm text-gray-600 pl-5">{spot.memo}</Text>
          </View>
        )}

        {/* 統計情報（将来実装予定） */}
        <View className="flex-row items-center justify-around pt-3 border-t border-gray-200 mb-2">
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="image-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.images_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">画像</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.likes_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">いいね</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.comments_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">コメント</Text>
          </View>
        </View>

        {/* アクションボタン（将来実装予定） */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            画像追加、いいね、コメント機能は今後実装予定です
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
