/**
 * デフォルトマップ上で選択された街の詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { useCheckMachiVisited, useToggleVisit } from '@/entities/visit/api';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useSearchBarSync } from '@/shared/lib';
import type { MachiRow } from '@/shared/types/database.types';

interface MachiDetailCardProps {
  machi: MachiRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
}

/**
 * 路線情報をパースして表示用の文字列配列に変換
 */
function parseLines(linesJson: string | null): string[] {
  if (!linesJson) return [];
  try {
    const parsed = JSON.parse(linesJson);
    if (Array.isArray(parsed)) {
      // [{ja: "JR山手線", en: "..."}, ...] または ["JR山手線", ...] 形式に対応
      return parsed.map((line) => {
        if (typeof line === 'string') return line;
        if (typeof line === 'object' && line.ja) return line.ja;
        return '';
      }).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/** 検索バー同期を行う内部コンテンツコンポーネント */
function MachiDetailCardContent({
  searchBarBottomY,
  onSearchBarVisibilityChange,
}: {
  searchBarBottomY: number;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
}) {
  // animatedPositionを監視して検索バーの表示/非表示を同期
  useSearchBarSync({
    searchBarBottomY,
    onVisibilityChange: onSearchBarVisibilityChange ?? (() => {}),
  });

  return null; // 実際のUIはBottomSheetScrollViewで描画
}

// 検索バー領域の下端Y座標（固定値）
const SEARCH_BAR_BOTTOM_Y = 180;

export function MachiDetailCard({ machi, onClose, onSnapChange, onSearchBarVisibilityChange }: MachiDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();

  // 訪問状態
  const { data: isVisited, isLoading: isCheckingVisit } = useCheckMachiVisited(currentUserId, machi.id);
  const toggleVisitMutation = useToggleVisit();

  const handleToggleVisit = useCallback(() => {
    if (!currentUserId || toggleVisitMutation.isPending) return;
    toggleVisitMutation.mutate({ userId: currentUserId, machiId: machi.id });
  }, [currentUserId, machi.id, toggleVisitMutation]);

  // 路線情報をパース
  const lines = useMemo(() => parseLines(machi.lines), [machi.lines]);

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
      onClose();
    } else {
      onSnapChange?.(index);
    }
  }, [onSnapChange, onClose]);

  // 閉じるボタンのハンドラー
  const handleClose = useCallback(() => {
    // 直接onCloseを呼ぶのではなく、BottomSheetをアニメーションで閉じる
    bottomSheetRef.current?.close();
  }, []);

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
      {/* 検索バー同期用の内部コンポーネント（UIスレッドでanimatedPositionを監視） */}
      <MachiDetailCardContent
        searchBarBottomY={SEARCH_BAR_BOTTOM_Y}
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-1">
              {machi.name}
            </Text>
            {/* 所在地 */}
            {(machi.prefecture_name || machi.city_name) && (
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">
                  {[machi.prefecture_name, machi.city_name].filter(Boolean).join(' ')}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="w-8 h-8 items-center justify-center rounded-full bg-muted dark:bg-dark-muted"
          >
            <Ionicons name="close" size={20} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* 路線情報 + 訪問ボタン */}
        <View className="flex-row items-start justify-between">
          {/* 路線情報 */}
          {lines.length > 0 ? (
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="train-outline" size={16} color={colors.text.secondary} />
                <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary ml-1">路線</Text>
              </View>
              <View className="flex-row flex-wrap gap-1.5">
                {lines.map((line, index) => (
                  <View
                    key={index}
                    className="px-2.5 py-1 bg-muted dark:bg-dark-muted rounded-full"
                  >
                    <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="flex-1" />
          )}

          {/* 訪問トグルボタン */}
          {currentUserId && (
            <Pressable
              onPress={handleToggleVisit}
              disabled={isCheckingVisit || toggleVisitMutation.isPending}
              className={`flex-row items-center px-4 py-2.5 rounded-full ${
                isVisited ? 'bg-blue-500 active:bg-blue-600' : 'bg-surface dark:bg-dark-surface border border-blue-500 active:bg-blue-50'
              }`}
            >
              {(isCheckingVisit || toggleVisitMutation.isPending) ? (
                <ActivityIndicator size="small" color={isVisited ? 'white' : '#3B82F6'} />
              ) : (
                <>
                  {isVisited && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="white"
                    />
                  )}
                  <Text
                    className={`text-sm font-semibold ${isVisited ? 'ml-1.5 text-white' : 'text-blue-500'}`}
                  >
                    {isVisited ? '訪問済み' : '訪問する'}
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
