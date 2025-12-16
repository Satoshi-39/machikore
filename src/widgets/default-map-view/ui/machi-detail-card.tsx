/**
 * デフォルトマップ上で選択された街の詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, LOCATION_ICONS, SPOT_CATEGORY_COLORS } from '@/shared/config';
import { LocationPinIcon, AddressPinIcon } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { useCheckMachiVisited, useToggleVisit } from '@/entities/visit/api';
import { useMasterSpotsByMachi } from '@/entities/master-spot';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  useSearchBarSync,
  useLocationButtonSync,
  SEARCH_BAR_BOTTOM_Y,
} from '@/shared/lib';
import { useMachiWikipediaSummary } from '@/shared/api/wikipedia/use-wikipedia-summary';
import type { MachiRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

interface MachiDetailCardProps {
  machi: MachiRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
  /** スポット選択時のコールバック */
  onSpotSelect?: (spot: MasterSpotDisplay) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function MachiDetailCardContent({
  onSearchBarVisibilityChange,
  onLocationButtonVisibilityChange,
}: {
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
}) {
  // animatedPositionを監視して検索バーの表示/非表示を同期
  useSearchBarSync({
    searchBarBottomY: SEARCH_BAR_BOTTOM_Y,
    onVisibilityChange: onSearchBarVisibilityChange ?? (() => {}),
  });

  // animatedPositionを監視して現在地ボタンの表示/非表示を同期
  useLocationButtonSync({
    onVisibilityChange: onLocationButtonVisibilityChange ?? (() => {}),
  });

  return null;
}

export function MachiDetailCard({ machi, onClose, onSnapChange, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange, onSpotSelect }: MachiDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();

  // 訪問状態
  const { data: isVisited, isLoading: isCheckingVisit } = useCheckMachiVisited(currentUserId, machi.id);
  const toggleVisitMutation = useToggleVisit();

  // 街に属するマスタースポットを取得（上位10件）
  const { data: masterSpots = [], isLoading: isSpotsLoading } = useMasterSpotsByMachi(machi.id, 10);

  // Wikipedia要約を取得
  const { data: wikiSummary, isLoading: isWikiLoading } = useMachiWikipediaSummary(
    machi.name,
    machi.city_name ?? undefined,
    machi.prefecture_name ?? undefined
  );

  // スポット選択時にカードを閉じてから遷移するためのペンディング状態
  const pendingSpotRef = useRef<MasterSpotDisplay | null>(null);

  const handleToggleVisit = useCallback(() => {
    if (!currentUserId || toggleVisitMutation.isPending) return;
    toggleVisitMutation.mutate({ userId: currentUserId, machiId: machi.id });
  }, [currentUserId, machi.id, toggleVisitMutation]);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

  // 初回マウント時に初期状態（デフォルト状態）を通知
  // Bottom Sheetの初期index=1の場合、onChangeは呼ばれないため手動で通知
  useEffect(() => {
    onSnapChange?.(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スナップ変更時のハンドラー（スナップ確定時のみ呼ばれる）
  const handleSheetChanges = useCallback((index: number) => {
    // index -1 = 閉じた状態 → デフォルト状態(1)にリセットして親に通知
    if (index === -1) {
      onSnapChange?.(1);
      // ペンディング中のスポットがあれば、閉じた後にスポットカードを開く
      const pendingSpot = pendingSpotRef.current;
      if (pendingSpot) {
        pendingSpotRef.current = null;
        onSpotSelect?.(pendingSpot);
      } else {
        onClose();
      }
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose, onSpotSelect]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // まず現在地ボタンを非表示にしてから、BottomSheetを閉じる
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // スポットをタップした時のハンドラー
  const handleSpotPress = useCallback((spot: MasterSpotDisplay) => {
    // ペンディング状態にして、カードを閉じる
    pendingSpotRef.current = spot;
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
      <MachiDetailCardContent
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name={LOCATION_ICONS.MACHI.name} size={24} color={LOCATION_ICONS.MACHI.color} />
              <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground ml-2">
                {machi.name}
              </Text>
            </View>
            {/* 所在地 */}
            {(machi.prefecture_name || machi.city_name) && (
              <View className="flex-row items-center">
                <AddressPinIcon size={14} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                  {[machi.prefecture_name, machi.city_name].filter(Boolean).join(' ')}
                </Text>
              </View>
            )}
          </View>

          {/* 訪問トグルボタン */}
          {currentUserId && (
            <Pressable
              onPress={handleToggleVisit}
              disabled={isCheckingVisit || toggleVisitMutation.isPending}
              className={`flex-row items-center px-4 py-2 rounded-full mr-4 ${
                isVisited ? 'bg-blue-500 active:bg-blue-600' : 'bg-surface dark:bg-dark-surface border border-foreground dark:border-dark-foreground active:bg-blue-50 dark:active:bg-dark-muted'
              }`}
            >
              {(isCheckingVisit || toggleVisitMutation.isPending) ? (
                <ActivityIndicator size="small" color={isVisited ? 'white' : (isDarkMode ? colors.dark.foreground : '#3B82F6')} />
              ) : (
                <>
                  {isVisited && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="white"
                    />
                  )}
                  <Text
                    className={`text-sm font-semibold ${isVisited ? 'ml-1.5 text-white' : 'text-foreground dark:text-dark-foreground'}`}
                  >
                    {isVisited ? '訪問済み' : '訪問する'}
                  </Text>
                </>
              )}
            </Pressable>
          )}

          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* エリア紹介（Wikipedia要約） */}
        <View className="mb-4">
          {isWikiLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color={colors.text.secondary} />
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-2">
                情報を取得中...
              </Text>
            </View>
          ) : wikiSummary?.extract ? (
            <Text
              className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary leading-6"
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
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary leading-6">
              {machi.name}の街を探索してみましょう。
            </Text>
          )}
        </View>

        {/* スポットランキング */}
        <View>
          <View className="flex-row items-center mb-3">
            <LocationPinIcon size={18} color={SPOT_CATEGORY_COLORS.popular} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              人気スポット
            </Text>
            {masterSpots.length > 0 && (
              <View className="ml-2 px-2 py-0.5 bg-amber-100 rounded-full">
                <Text className="text-xs font-semibold" style={{ color: SPOT_CATEGORY_COLORS.popular }}>
                  {masterSpots.length}
                </Text>
              </View>
            )}
          </View>

          {isSpotsLoading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : masterSpots.length > 0 ? (
            masterSpots.map((spot, index) => (
              <Pressable
                key={spot.id}
                onPress={() => handleSpotPress(spot)}
                className="flex-row items-center py-3 border-b border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
              >
                {/* ランキング番号 */}
                <View className={`w-8 h-8 items-center justify-center rounded-full mr-3 ${
                  index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-200' : index === 2 ? 'bg-orange-100' : 'bg-muted dark:bg-dark-muted'
                }`}>
                  <Text className={`text-sm font-bold ${
                    index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-500' : index === 2 ? 'text-orange-600' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
                  }`}>
                    {index + 1}
                  </Text>
                </View>
                {/* スポット情報 */}
                <View className="flex-1">
                  <Text className="text-base text-foreground dark:text-dark-foreground font-medium" numberOfLines={1}>
                    {spot.name}
                  </Text>
                  <View className="flex-row items-center mt-0.5">
                    {spot.bookmarks_count > 0 && (
                      <View className="flex-row items-center mr-3">
                        <Ionicons name="bookmark" size={12} color={colors.primary.DEFAULT} />
                        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                          {spot.bookmarks_count}
                        </Text>
                      </View>
                    )}
                    {spot.google_rating && (
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                          {spot.google_rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
              </Pressable>
            ))
          ) : (
            <View className="py-4">
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center">
                この街にはまだスポットが登録されていません
              </Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
