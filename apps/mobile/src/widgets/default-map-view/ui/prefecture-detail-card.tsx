/**
 * 都道府県詳細カード
 * デフォルトマップで都道府県をタップした時に表示
 * 市区一覧を表示し、タップで市区詳細カードに遷移
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
import { getCitiesByPrefecture } from '@/shared/api/sqlite/cities';
import { usePrefectureWikipediaSummary } from '@/shared/api/wikipedia/use-wikipedia-summary';
import type { PrefectureRow, CityRow } from '@/shared/types/database.types';

interface PrefectureDetailCardProps {
  prefecture: PrefectureRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** 市区選択時のコールバック */
  onCitySelect?: (city: CityRow) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function PrefectureDetailCardContent({
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

export function PrefectureDetailCard({
  prefecture,
  onClose,
  onSnapChange,
  onSearchBarVisibilityChange,
  onBeforeClose,
  onLocationButtonVisibilityChange,
  onCitySelect,
}: PrefectureDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // 都道府県に属する市区データを取得
  const cities = useMemo(() => getCitiesByPrefecture(prefecture.id), [prefecture.id]);

  // Wikipedia要約を取得
  const { data: wikiSummary, isLoading: isWikiLoading } = usePrefectureWikipediaSummary(prefecture.name);

  // 市区選択時にカードを閉じてから遷移するためのペンディング状態
  const pendingCityRef = useRef<CityRow | null>(null);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // 初回マウント時に初期状態を通知
  useEffect(() => {
    onSnapChange?.(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onSnapChange?.(1);
      const pendingCity = pendingCityRef.current;
      if (pendingCity) {
        pendingCityRef.current = null;
        onCitySelect?.(pendingCity);
      } else {
        onClose();
      }
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose, onCitySelect]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // 市区をタップした時のハンドラー
  const handleCityPress = useCallback((city: CityRow) => {
    pendingCityRef.current = city;
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
      <PrefectureDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 flex-row items-center">
            <Ionicons name={LOCATION_ICONS.PREFECTURE.name} size={iconSizeNum.lg} color={LOCATION_ICONS.PREFECTURE.color} />
            <Text className="text-2xl font-bold text-on-surface ml-2">
              {prefecture.name}
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
              {prefecture.name}の市区町村を選択して、街を探索しましょう。
            </Text>
          )}
        </View>

        {/* 市区リスト */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name={LOCATION_ICONS.CITY.name} size={iconSizeNum.sm} color={LOCATION_ICONS.CITY.color} />
            <Text className="text-base font-semibold text-on-surface ml-2">
              市区町村一覧
            </Text>
            {cities.length > 0 && (
              <View className={`ml-2 px-2 py-0.5 ${LOCATION_ICONS.CITY.bgColor} rounded-full`}>
                <Text className="text-xs font-semibold" style={{ color: LOCATION_ICONS.CITY.color }}>
                  {cities.length}
                </Text>
              </View>
            )}
          </View>

          {cities.length > 0 ? (
            cities.map((city, index) => (
              <Pressable
                key={city.id}
                onPress={() => handleCityPress(city)}
                className="flex-row items-center py-3 border-b-thin border-outline-variant active:bg-secondary"
              >
                <View className={`w-8 h-8 items-center justify-center ${LOCATION_ICONS.CITY.bgColor} rounded-full mr-3`}>
                  <Text className="text-sm font-bold" style={{ color: LOCATION_ICONS.CITY.color }}>
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base text-on-surface font-medium">
                    {city.name}
                  </Text>
                  {city.name_kana && (
                    <Text className="text-xs text-on-surface-variant">
                      {city.name_kana}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-on-surface-variant" />
              </Pressable>
            ))
          ) : (
            <View className="py-4">
              <Text className="text-sm text-on-surface-variant text-center">
                この都道府県には市区町村が登録されていません
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
