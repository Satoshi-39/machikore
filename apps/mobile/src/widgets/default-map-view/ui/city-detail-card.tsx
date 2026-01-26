/**
 * 市区町村詳細カード
 * デフォルトマップで市区町村をタップした時に表示
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, LOCATION_ICONS, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  useSearchBarSync,
  useLocationButtonSync,
  SEARCH_BAR_BOTTOM_Y,
} from '@/shared/lib';
import { useMachiByCity } from '@/entities/machi';
import { useCityWikipediaSummary } from '@/shared/api/wikipedia/use-wikipedia-summary';
import { getPrefectureById } from '@/shared/api/sqlite/prefectures';
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

  // 都道府県名を取得（Wikipedia検索用）
  const prefectureName = useMemo(() => {
    const prefecture = getPrefectureById(city.prefecture_id);
    return prefecture?.name ?? null;
  }, [city.prefecture_id]);

  // Wikipedia要約を取得
  const { data: wikiSummary, isLoading: isWikiLoading } = useCityWikipediaSummary(
    city.name,
    prefectureName ?? undefined
  );

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
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"] }}
    >
      {/* 検索バー・現在地ボタン同期用の内部コンポーネント */}
      <CityDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 flex-row items-center">
            <Ionicons name={LOCATION_ICONS.CITY.name} size={iconSizeNum.lg} color={LOCATION_ICONS.CITY.color} />
            <Text className="text-2xl font-bold text-on-surface ml-2">
              {city.name}
            </Text>
          </View>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="close" size={iconSizeNum.md} className="text-on-surface-variant" />
          </Pressable>
        </View>

        {/* エリア紹介（Wikipedia要約） */}
        <View className="mb-4">
          {isWikiLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" className="text-on-surface-variant" />
              <Text className="text-sm text-on-surface-variant ml-2">
                情報を取得中...
              </Text>
            </View>
          ) : wikiSummary?.extract ? (
            <Text
              className="text-sm text-on-surface-variant leading-6"
              numberOfLines={3}
            >
              {wikiSummary.extract.length > 90
                ? wikiSummary.extract.slice(0, 90) + '…'
                : wikiSummary.extract}
              {wikiSummary.pageUrl && (
                <Text
                  className="text-sm text-blue-500"
                  onPress={() => Linking.openURL(wikiSummary.pageUrl)}
                >
                  {' '}ウィキペディア
                </Text>
              )}
            </Text>
          ) : (
            <Text className="text-sm text-on-surface-variant leading-6">
              {city.name}の街を探索してみましょう。
            </Text>
          )}
        </View>

        {/* 街リスト */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name={LOCATION_ICONS.MACHI.name} size={iconSizeNum.sm} color={LOCATION_ICONS.MACHI.color} />
            <Text className="text-base font-semibold text-on-surface ml-2">
              この都市の街
            </Text>
            {machis.length > 0 && (
              <View className={`ml-2 px-2 py-0.5 ${LOCATION_ICONS.MACHI.bgColor} rounded-full`}>
                <Text className="text-xs font-semibold" style={{ color: LOCATION_ICONS.MACHI.color }}>
                  {machis.length}
                </Text>
              </View>
            )}
          </View>

          {machis.length > 0 ? (
            machis.map((machi, index) => (
              <Pressable
                key={machi.id}
                onPress={() => handleMachiPress(machi)}
                className="flex-row items-center py-3 border-b-thin border-outline-variant active:bg-secondary"
              >
                <View className="w-8 h-8 items-center justify-center bg-green-100 rounded-full mr-3">
                  <Text className="text-sm font-bold text-green-600">
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base text-on-surface font-medium">
                    {machi.name}
                  </Text>
                  {machi.name_kana && (
                    <Text className="text-xs text-on-surface-variant">{machi.name_kana}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-on-surface-variant" />
              </Pressable>
            ))
          ) : (
            <View className="py-4">
              <Text className="text-sm text-on-surface-variant text-center">
                この市区には街が登録されていません
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
