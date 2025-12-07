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
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  useSearchBarSync,
  useLocationButtonSync,
  SEARCH_BAR_BOTTOM_Y,
} from '@/shared/lib';
import { useMachiByCity } from '@/entities/machi';
import type { CityRow, MachiRow } from '@/shared/types/database.types';

interface CityDetailCardProps {
  city: CityRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** 街選択時のコールバック */
  onMachiSelect?: (machi: MachiRow) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function CityDetailCardContent({
  onSearchBarVisibilityChange,
  onLocationButtonVisibilityChange,
}: {
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
}) {
  useSearchBarSync({
    searchBarBottomY: SEARCH_BAR_BOTTOM_Y,
    onVisibilityChange: onSearchBarVisibilityChange ?? (() => {}),
  });

  useLocationButtonSync({
    onVisibilityChange: onLocationButtonVisibilityChange ?? (() => {}),
  });

  return null;
}

export function CityDetailCard({ city, onClose, onSnapChange, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange, onMachiSelect }: CityDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // 市区に属する街データを取得
  const { data: machis = [] } = useMachiByCity(city.id);

  // 街選択時にカードを閉じてから遷移するためのペンディング状態（refで保持してクロージャ問題を回避）
  const pendingMachiRef = useRef<MachiRow | null>(null);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // 初回マウント時に初期状態（デフォルト状態）を通知
  useEffect(() => {
    onSnapChange?.(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー（スナップ確定時のみ呼ばれる）
  const handleSheetChanges = useCallback((index: number) => {
    // index -1 = 閉じた状態 → デフォルト状態(1)にリセットして親に通知
    if (index === -1) {
      onSnapChange?.(1);
      // ペンディング中の街があれば、閉じた後に街カードを開く
      const pendingMachi = pendingMachiRef.current;
      if (pendingMachi) {
        pendingMachiRef.current = null;
        onMachiSelect?.(pendingMachi);
      } else {
        onClose();
      }
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose, onMachiSelect]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // まず現在地ボタンを非表示にしてから、BottomSheetを閉じる
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // 街をタップした時のハンドラー
  const handleMachiPress = useCallback((machi: MachiRow) => {
    // ペンディング状態にして、カードを閉じる
    pendingMachiRef.current = machi;
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={false}
      backgroundStyle={{ backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary }}
    >
      {/* 検索バー・現在地ボタン同期用の内部コンポーネント */}
      <CityDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

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

        {/* 統計情報 */}
        <View className="flex-row items-center justify-around py-3 border-y border-border dark:border-dark-border mb-4">
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="map" size={18} color={colors.secondary.DEFAULT} />
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">{machis.length}</Text>
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">街</Text>
          </View>
        </View>

        {/* 街リスト */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="map" size={18} color={colors.secondary.DEFAULT} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              この市区の街
            </Text>
          </View>

          {machis.length > 0 ? (
            machis.map((machi, index) => (
              <Pressable
                key={machi.id}
                onPress={() => handleMachiPress(machi)}
                className="flex-row items-center py-3 border-b border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
              >
                <View className="w-8 h-8 items-center justify-center bg-green-100 rounded-full mr-3">
                  <Text className="text-sm font-bold text-green-600">
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base text-foreground dark:text-dark-foreground font-medium">
                    {machi.name}
                  </Text>
                  {machi.name_kana && (
                    <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{machi.name_kana}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
              </Pressable>
            ))
          ) : (
            <View className="py-4">
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center">
                この市区には街が登録されていません
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
