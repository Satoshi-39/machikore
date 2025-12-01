/**
 * デフォルトマップ上で選択されたマスタースポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Linking, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useSegments } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/config';
import type { MasterSpotDisplay } from '@/shared/api/supabase/spots';
import { useSpotsByMasterSpot } from '@/entities/user-spot';
import { getRelativeSpotTime } from '@/entities/user-spot/model/helpers';

interface MasterSpotDetailCardProps {
  spot: MasterSpotDisplay;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
}

export function MasterSpotDetailCard({ spot, onClose, onSnapChange }: MasterSpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';

  // このマスタースポットに紐づくユーザー投稿を取得
  const { data: userSpots = [], isLoading: isLoadingUserSpots } = useSpotsByMasterSpot(spot.id);

  // タブバーの高さを考慮したスナップポイント（3段階固定）
  // 縮小: 15%（現在地ボタンのみ表示）、デフォルト: 45%、拡大: 90%（検索バー非表示）
  const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

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

  // ウェブサイトを開く
  const handleWebsitePress = useCallback(() => {
    if (spot.google_website_uri) {
      Linking.openURL(spot.google_website_uri);
    }
  }, [spot.google_website_uri]);

  // 電話をかける
  const handlePhonePress = useCallback(() => {
    if (spot.google_phone_number) {
      Linking.openURL(`tel:${spot.google_phone_number}`);
    }
  }, [spot.google_phone_number]);

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
              {spot.name}
            </Text>
            {spot.google_formatted_address && (
              <Text className="text-sm text-gray-600">{spot.google_formatted_address}</Text>
            )}
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
            緯度: {spot.latitude.toFixed(4)}, 経度:{' '}
            {spot.longitude.toFixed(4)}
          </Text>
        </View>

        {/* 評価 */}
        {spot.google_rating && (
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="star"
              size={16}
              color="#F59E0B"
            />
            <Text className="text-sm text-gray-900 ml-1 font-semibold">
              {spot.google_rating.toFixed(1)}
            </Text>
            {spot.google_user_rating_count && (
              <Text className="text-sm text-gray-600 ml-1">
                ({spot.google_user_rating_count}件の評価)
              </Text>
            )}
          </View>
        )}

        {/* アクションボタン */}
        <View className="mt-2 pt-3 border-t border-gray-200">
          {/* 電話番号 */}
          {spot.google_phone_number && (
            <Pressable
              onPress={handlePhonePress}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons name="call-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="text-base text-gray-900 ml-3">
                {spot.google_phone_number}
              </Text>
            </Pressable>
          )}

          {/* ウェブサイト */}
          {spot.google_website_uri && (
            <Pressable
              onPress={handleWebsitePress}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons name="globe-outline" size={20} color={colors.primary.DEFAULT} />
              <Text className="text-base text-gray-900 ml-3" numberOfLines={1}>
                ウェブサイトを開く
              </Text>
            </Pressable>
          )}
        </View>

        {/* ユーザー投稿一覧 */}
        <View className="mt-4 pt-4 border-t border-gray-200">
          <View className="flex-row items-center mb-3">
            <Ionicons name="people-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-gray-900 ml-2">
              みんなの投稿 ({spot.user_spots_count}件)
            </Text>
          </View>

          {isLoadingUserSpots ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : userSpots.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-sm text-gray-500">
                まだ投稿がありません
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {userSpots.map((userSpot) => (
                <Pressable
                  key={userSpot.id}
                  className="bg-gray-50 rounded-lg p-3 active:bg-gray-100"
                  onPress={() => {
                    // スポット詳細ページに遷移（タブ内ルートを使用）
                    onClose();
                    if (isInDiscoverTab) {
                      router.push(`/(tabs)/discover/spots/${userSpot.id}`);
                    } else if (isInMapTab) {
                      router.push(`/(tabs)/map/spots/${userSpot.id}`);
                    } else if (isInMypageTab) {
                      router.push(`/(tabs)/mypage/spots/${userSpot.id}`);
                    } else {
                      router.push(`/spots/${userSpot.id}`);
                    }
                  }}
                >
                  {/* ユーザー情報とマップ名 */}
                  <View className="flex-row items-center mb-2">
                    {userSpot.user?.avatar_url ? (
                      <Image
                        source={{ uri: userSpot.user.avatar_url }}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
                        <Ionicons name="person" size={16} color={colors.gray[500]} />
                      </View>
                    )}
                    <View className="ml-2 flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-medium text-gray-900">
                          {userSpot.user?.display_name || userSpot.user?.username || 'ユーザー'}
                        </Text>
                        {userSpot.map && (
                          <View className="flex-row items-center ml-2">
                            <Ionicons name="map-outline" size={12} color={colors.primary.DEFAULT} />
                            <Text className="text-xs text-primary-600 ml-1" numberOfLines={1}>
                              {userSpot.map.name}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-gray-500">
                        {getRelativeSpotTime(userSpot.created_at)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </View>

                  {/* カスタム名 */}
                  {userSpot.custom_name && (
                    <Text className="text-sm font-medium text-gray-800 mb-1">
                      {userSpot.custom_name}
                    </Text>
                  )}

                  {/* 説明 */}
                  {userSpot.description && (
                    <Text className="text-sm text-gray-700" numberOfLines={3}>
                      {userSpot.description}
                    </Text>
                  )}

                  {/* 画像 */}
                  {userSpot.images && userSpot.images.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mt-2 -mx-3"
                      contentContainerStyle={{ paddingHorizontal: 12 }}
                    >
                      {userSpot.images.map((image) => (
                        <Image
                          key={image.id}
                          source={{ uri: image.cloud_path || '' }}
                          className="w-24 h-24 rounded-lg mr-2"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  )}

                  {/* いいね・コメント数 */}
                  <View className="flex-row items-center mt-2 gap-3">
                    <View className="flex-row items-center">
                      <Ionicons name="heart-outline" size={14} color={colors.text.secondary} />
                      <Text className="text-xs text-gray-500 ml-1">{userSpot.likes_count}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={14} color={colors.text.secondary} />
                      <Text className="text-xs text-gray-500 ml-1">{userSpot.comments_count}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
