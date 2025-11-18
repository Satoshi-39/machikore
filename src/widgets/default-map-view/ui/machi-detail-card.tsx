/**
 * デフォルトマップ上で選択された街の詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import { MachiVisitInfo } from '@/widgets/machi-visit-info';
// import { MachiSpotList } from './machi-spot-list'; // TODO: 街とマップの関係を再設計後に実装
// import { useVisitByMachi } from '@/entities/visit/api'; // TODO: 将来使用予定
import { useCurrentUserId } from '@/entities/user';
import type { MachiRow } from '@/shared/types/database.types';

interface MachiDetailCardProps {
  machi: MachiRow;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
}

export function MachiDetailCard({ machi, onClose, onSnapChange }: MachiDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const currentUserId = useCurrentUserId();
  // const { data: visit } = useVisitByMachi(currentUserId || '', machi.id); // TODO: 将来使用予定

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 95%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '95%'], []);

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onAnimate={handleSheetAnimate}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={false}
      backgroundStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{ backgroundColor: colors.text.secondary }}
    >
      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {machi.name}
            </Text>
            <Text className="text-sm text-gray-600">{machi.lines || ''}</Text>
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
            緯度: {machi.latitude.toFixed(4)}, 経度:{' '}
            {machi.longitude.toFixed(4)}
          </Text>
        </View>

        {/* 訪問記録（ログイン時のみ） */}
        {currentUserId && (
          <View className="mb-3">
            <MachiVisitInfo userId={currentUserId} machiId={machi.id} />
          </View>
        )}

        {/* スポットリスト（将来実装予定） */}
        {/* TODO: マップとスポットの関係を実装後に有効化 */}
        {/* {currentUserId && visit && (
          <View className="mb-3">
            <MachiSpotList mapId={???} />
          </View>
        )} */}

        {/* アクションボタン（将来実装予定） */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            詳細ページや訪問記録追加機能は今後実装予定です
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
