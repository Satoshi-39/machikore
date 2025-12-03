/**
 * 市区町村詳細カード
 * デフォルトマップで市区町村をタップした時に表示
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import type { CityRow } from '@/shared/types/database.types';

interface CityDetailCardProps {
  city: CityRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
}

export function CityDetailCard({ city, onClose, onSnapChange }: CityDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // 仮データ: おすすめスポット（実際のデータは後で実装）
  const recommendedSpots = [
    { rank: 1, name: '人気のカフェ', category: '飲食店' },
    { rank: 2, name: '有名な公園', category: '観光地' },
    { rank: 3, name: 'おしゃれな雑貨店', category: 'ショッピング' },
  ];

  // 初回マウント時に初期状態（デフォルト状態）を通知
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
    bottomSheetRef.current?.close();
  }, []);

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
      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-1">
              {city.name}
            </Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{city.type}</Text>
          </View>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* エリア紹介（仮テキスト） */}
        <View className="mb-4">
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary leading-6">
            {city.name}エリアのおすすめスポットやイベント情報を表示します。
            現在は開発中のため、仮のデータを表示しています。
          </Text>
        </View>

        {/* 統計情報（仮データ） */}
        <View className="flex-row items-center justify-around py-3 border-y border-border dark:border-dark-border mb-4">
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">12</Text>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">街</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="business" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">48</Text>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">スポット</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="people" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">324</Text>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">訪問者</Text>
          </View>
        </View>

        {/* おすすめスポットランキング（仮データ） */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={18} color="#F59E0B" />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              おすすめスポット
            </Text>
          </View>

          {recommendedSpots.map((spot) => (
            <View
              key={spot.rank}
              className="flex-row items-center py-3 border-b border-border-light dark:border-dark-border-light"
            >
              <View className="w-8 h-8 items-center justify-center bg-orange-100 rounded-full mr-3">
                <Text className="text-sm font-bold text-orange-600">
                  {spot.rank}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base text-foreground dark:text-dark-foreground font-medium">
                  {spot.name}
                </Text>
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{spot.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </View>
          ))}
        </View>

        {/* 注意書き */}
        <View className="mt-2 pt-3 border-t border-border dark:border-dark-border">
          <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary text-center">
            ※ 現在は仮データを表示しています。今後、実際のデータに基づいたランキングを表示予定です。
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
