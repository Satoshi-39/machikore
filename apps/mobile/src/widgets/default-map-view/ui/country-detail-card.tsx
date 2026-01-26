/**
 * 国詳細カード
 * デフォルトマップで国をタップした時に表示
 * 地方一覧を表示し、タップで地方詳細カードに遷移
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
import { getAllRegions } from '@/shared/api/sqlite/regions';
import { useQuery } from '@tanstack/react-query';
import { getWikipediaSummary } from '@/shared/api/wikipedia';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { CountryRow, RegionRow } from '@/shared/types/database.types';

interface CountryDetailCardProps {
  country: CountryRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** 地方選択時のコールバック */
  onRegionSelect?: (region: RegionRow) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function CountryDetailCardContent({
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

export function CountryDetailCard({
  country,
  onClose,
  onSnapChange,
  onSearchBarVisibilityChange,
  onBeforeClose,
  onLocationButtonVisibilityChange,
  onRegionSelect,
}: CountryDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // 地方データを取得
  const regions = useMemo(() => getAllRegions(), []);

  // Wikipedia要約を取得（日本）
  const { data: wikiSummary, isLoading: isWikiLoading } = useQuery({
    queryKey: QUERY_KEYS.wikipediaCountry(country.name),
    queryFn: () => getWikipediaSummary(country.name),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  // 地方選択時にカードを閉じてから遷移するためのペンディング状態
  const pendingRegionRef = useRef<RegionRow | null>(null);

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
      const pendingRegion = pendingRegionRef.current;
      if (pendingRegion) {
        pendingRegionRef.current = null;
        onRegionSelect?.(pendingRegion);
      } else {
        onClose();
      }
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose, onRegionSelect]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // 地方をタップした時のハンドラー
  const handleRegionPress = useCallback((region: RegionRow) => {
    pendingRegionRef.current = region;
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
      <CountryDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 flex-row items-center">
            <Text className="text-2xl mr-2">{LOCATION_ICONS.COUNTRY.emoji}</Text>
            <Text className="text-2xl font-bold text-on-surface">
              {country.name}
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
              地方を選択して、都道府県を探索しましょう。
            </Text>
          )}
        </View>

        {/* 地方リスト */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="map-outline" size={iconSizeNum.sm} color={LOCATION_ICONS.PREFECTURE.color} />
            <Text className="text-base font-semibold text-on-surface ml-2">
              地方一覧
            </Text>
            <View className="ml-2 px-2 py-0.5 bg-purple-100 rounded-full">
              <Text className="text-xs font-semibold" style={{ color: LOCATION_ICONS.PREFECTURE.color }}>
                {regions.length}
              </Text>
            </View>
          </View>

          {regions.map((region, index) => (
            <Pressable
              key={region.id}
              onPress={() => handleRegionPress(region)}
              className="flex-row items-center py-3 border-b-thin border-outline-variant active:bg-secondary"
            >
              <View className="w-8 h-8 items-center justify-center bg-purple-100 rounded-full mr-3">
                <Text className="text-sm font-bold" style={{ color: LOCATION_ICONS.PREFECTURE.color }}>
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base text-on-surface font-medium">
                  {region.name}
                </Text>
                {region.name_kana && (
                  <Text className="text-xs text-on-surface-variant">
                    {region.name_kana}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-on-surface-variant" />
            </Pressable>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
