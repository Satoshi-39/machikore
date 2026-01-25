/**
 * 地方詳細カード
 * デフォルトマップで地方をタップした時に表示
 * 都道府県一覧を表示し、タップで都道府県詳細カードに遷移
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, LOCATION_ICONS } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  useSearchBarSync,
  useLocationButtonSync,
  SEARCH_BAR_BOTTOM_Y,
} from '@/shared/lib';
import { getPrefecturesByRegionId } from '@/shared/api/sqlite/prefectures';
import { useRegionWikipediaSummary } from '@/shared/api/wikipedia/use-wikipedia-summary';
import type { RegionRow, PrefectureRow } from '@/shared/types/database.types';

interface RegionDetailCardProps {
  region: RegionRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** 都道府県選択時のコールバック */
  onPrefectureSelect?: (prefecture: PrefectureRow) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function RegionDetailCardContent({
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

export function RegionDetailCard({
  region,
  onClose,
  onSnapChange,
  onSearchBarVisibilityChange,
  onBeforeClose,
  onLocationButtonVisibilityChange,
  onPrefectureSelect,
}: RegionDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // 地方に属する都道府県データを取得
  const prefectures = useMemo(() => getPrefecturesByRegionId(region.id), [region.id]);

  // Wikipedia要約を取得（地方名 + "地方" で検索）
  const regionWikiName = region.name.endsWith('地方') ? region.name : `${region.name}地方`;
  const { data: wikiSummary, isLoading: isWikiLoading } = useRegionWikipediaSummary(regionWikiName);

  // 都道府県選択時にカードを閉じてから遷移するためのペンディング状態
  const pendingPrefectureRef = useRef<PrefectureRow | null>(null);

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
      const pendingPrefecture = pendingPrefectureRef.current;
      if (pendingPrefecture) {
        pendingPrefectureRef.current = null;
        onPrefectureSelect?.(pendingPrefecture);
      } else {
        onClose();
      }
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose, onPrefectureSelect]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // 都道府県をタップした時のハンドラー
  const handlePrefecturePress = useCallback((prefecture: PrefectureRow) => {
    pendingPrefectureRef.current = prefecture;
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
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark['on-surface-variant'] : colors.text.secondary }}
    >
      {/* 検索バー・現在地ボタン同期用の内部コンポーネント */}
      <RegionDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 flex-row items-center">
            <Ionicons name={LOCATION_ICONS.REGION.name} size={24} color={LOCATION_ICONS.REGION.color} />
            <Text className="text-2xl font-bold text-on-surface ml-2">
              {region.name}
            </Text>
          </View>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* エリア紹介（Wikipedia要約） */}
        <View className="mb-4">
          {isWikiLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color={colors.text.secondary} />
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
              {region.name}地方の都道府県を選択して、市区町村を探索しましょう。
            </Text>
          )}
        </View>

        {/* 都道府県リスト */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name={LOCATION_ICONS.PREFECTURE.name} size={18} color={LOCATION_ICONS.PREFECTURE.color} />
            <Text className="text-base font-semibold text-on-surface ml-2">
              都道府県一覧
            </Text>
            {prefectures.length > 0 && (
              <View className={`ml-2 px-2 py-0.5 ${LOCATION_ICONS.PREFECTURE.bgColor} rounded-full`}>
                <Text className="text-xs font-semibold" style={{ color: LOCATION_ICONS.PREFECTURE.color }}>
                  {prefectures.length}
                </Text>
              </View>
            )}
          </View>

          {prefectures.length > 0 ? (
            prefectures.map((prefecture, index) => (
              <Pressable
                key={prefecture.id}
                onPress={() => handlePrefecturePress(prefecture)}
                className="flex-row items-center py-3 border-b border-outline-variant active:bg-secondary"
              >
                <View className={`w-8 h-8 items-center justify-center ${LOCATION_ICONS.PREFECTURE.bgColor} rounded-full mr-3`}>
                  <Text className="text-sm font-bold" style={{ color: LOCATION_ICONS.PREFECTURE.color }}>
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base text-on-surface font-medium">
                    {prefecture.name}
                  </Text>
                  {prefecture.name_kana && (
                    <Text className="text-xs text-on-surface-variant">
                      {prefecture.name_kana}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
              </Pressable>
            ))
          ) : (
            <View className="py-4">
              <Text className="text-sm text-on-surface-variant text-center">
                この地方には都道府県が登録されていません
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
