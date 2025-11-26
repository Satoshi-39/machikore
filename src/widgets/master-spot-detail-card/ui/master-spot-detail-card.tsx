/**
 * デフォルトマップ上で選択されたマスタースポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import type { MasterSpotDisplay } from '@/shared/types/database.types';

interface MasterSpotDetailCardProps {
  spot: MasterSpotDisplay;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
}

export function MasterSpotDetailCard({ spot, onClose, onSnapChange }: MasterSpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // 初回マウント時に初期状態（デフォルト状態）を通知
  // Bottom Sheetの初期index=1の場合、onChangeは呼ばれないため手動で通知
  useEffect(() => {
    onSnapChange?.(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    onSnapChange?.(index);
    // index -1 = 閉じた状態 → 親に通知してコンポーネント削除
    if (index === -1) {
      onClose();
    }
  }, [onSnapChange, onClose]);

  // アニメーション中のハンドラー（リアルタイムで状態を通知）
  const handleSheetAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    onSnapChange?.(toIndex);
  }, [onSnapChange]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // 直接onCloseを呼ぶのではなく、BottomSheetをアニメーションで閉じる
    bottomSheetRef.current?.close();
  }, []);

  // ウェブサイトを開く
  const handleWebsitePress = useCallback(() => {
    if (spot.google_website_uri) {
      Linking.openURL(spot.google_website_uri);
    }
  }, [spot.google_website_uri]);

  // 電話をかける
  const handlePhonePress = useCallback(() => {
    if (spot.google_phone_number) {
      Linking.openURL(`tel:${spot.google_phone_number}`);
    }
  }, [spot.google_phone_number]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onAnimate={handleSheetAnimate}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: colors.text.secondary }}
    >
      <BottomSheetScrollView className="px-4"  contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {spot.name}
            </Text>
            {spot.google_formatted_address && (
              <Text className="text-sm text-gray-600">{spot.google_formatted_address}</Text>
            )}
          </View>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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

        {/* 評価 */}
        {spot.google_rating && (
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="star"
              size={16}
              color="#F59E0B"
            />
            <Text className="text-sm text-gray-900 ml-1 font-semibold">
              {spot.google_rating.toFixed(1)}
            </Text>
            {spot.google_user_rating_count && (
              <Text className="text-sm text-gray-600 ml-1">
                ({spot.google_user_rating_count}件の評価)
              </Text>
            )}
          </View>
        )}

        {/* アクションボタン */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          {/* 電話番号 */}
          {spot.google_phone_number && (
            <Pressable
              onPress={handlePhonePress}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons name="call-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="text-base text-gray-900 ml-3">
                {spot.google_phone_number}
              </Text>
            </Pressable>
          )}

          {/* ウェブサイト */}
          {spot.google_website_uri && (
            <Pressable
              onPress={handleWebsitePress}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons name="globe-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="text-base text-gray-900 ml-3" numberOfLines={1}>
                ウェブサイトを開く
              </Text>
            </Pressable>
          )}
        </View>

        {/* Google Place ID */}
        {spot.google_place_id && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs text-gray-400">
              Google Place ID: {spot.google_place_id}
            </Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
