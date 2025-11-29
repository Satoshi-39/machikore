/**
 * カスタムマップ上で選択されたスポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import { showEditDeleteMenu, showDeleteConfirmation } from '@/shared/lib/utils';
import { useSpotImages, useDeleteSpot } from '@/entities/spot/api';
import type { SpotWithDetails, UUID } from '@/shared/types';

interface SpotDetailCardProps {
  spot: SpotWithDetails;
  currentUserId?: UUID | null;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onEdit?: (spotId: string) => void;
}

export function SpotDetailCard({ spot, currentUserId, onClose, onSnapChange, onEdit }: SpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteSpot();
  const isOwner = currentUserId && spot.user_id === currentUserId;

  // SpotWithDetailsから表示用データを抽出
  const spotName = spot.custom_name || spot.master_spot?.name || '不明なスポット';
  const spotAddress = spot.master_spot?.google_formatted_address;
  const latitude = spot.master_spot?.latitude ?? 0;
  const longitude = spot.master_spot?.longitude ?? 0;

  // スポットの画像を取得
  const { data: images = [] } = useSpotImages(spot.id);

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

  // 三点リーダーメニュー
  const handleMenuPress = useCallback(() => {
    showEditDeleteMenu({
      title: 'スポットメニュー',
      onEdit: () => onEdit?.(spot.id),
      onDelete: handleDelete,
    });
  }, [spot.id, onEdit]);

  const handleDelete = useCallback(() => {
    showDeleteConfirmation({
      title: 'スポットを削除',
      message: 'このスポットを削除しますか？この操作は取り消せません。',
      onConfirm: () => {
        deleteSpot(spot.id);
        onClose();
      },
    });
  }, [spot.id, deleteSpot, onClose]);

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
              {spotName}
            </Text>
            {spotAddress && (
              <Text className="text-sm text-gray-600">{spotAddress}</Text>
            )}
          </View>
          <View className="flex-row items-center">
            {/* 三点リーダーメニュー（自分のスポットのみ） */}
            {isOwner && (
              <Pressable
                onPress={handleMenuPress}
                disabled={isDeleting}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 mr-2"
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
              </Pressable>
            )}
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </Pressable>
          </View>
        </View>

        {/* 位置情報 */}
        <View className="flex-row items-center mb-3">
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-1">
            緯度: {latitude.toFixed(4)}, 経度: {longitude.toFixed(4)}
          </Text>
        </View>

        {/* 画像 */}
        {images.length > 0 && (
          <View className="mb-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.cloud_path || '' }}
                  className="w-32 h-32 rounded-lg mr-2"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 説明 */}
        {spot.description && (
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.text.secondary}
              />
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                説明
              </Text>
            </View>
            <Text className="text-sm text-gray-600 pl-5">{spot.description}</Text>
          </View>
        )}

        {/* 統計情報（将来実装予定） */}
        <View className="flex-row items-center justify-around pt-3 border-t border-gray-200 mb-2">
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="image-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.images_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">画像</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.likes_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">いいね</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
              <Text className="text-lg font-bold text-gray-900 ml-1">
                {spot.comments_count}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">コメント</Text>
          </View>
        </View>

        {/* アクションボタン（将来実装予定） */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          <Text className="text-xs text-gray-500 text-center">
            画像追加、いいね、コメント機能は今後実装予定です
          </Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
