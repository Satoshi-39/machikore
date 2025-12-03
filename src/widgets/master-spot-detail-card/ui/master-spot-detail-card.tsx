/**
 * デフォルトマップ上で選択されたマスタースポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Linking, Image, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useSegments, type Href } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { MasterSpotDisplay } from '@/shared/api/supabase/spots';
import { useSpotsByMasterSpot } from '@/entities/user-spot';
import { getRelativeSpotTime } from '@/entities/user-spot/model/helpers';
import { useCurrentUserId } from '@/entities/user';
import { useCheckMasterSpotLiked, useToggleMasterSpotLike } from '@/entities/like';
import { useSelectedPlaceStore } from '@/features/search-places';
import { useMapStore } from '@/entities/map';
import { MapSelectSheet } from '@/widgets/map-select-sheet';

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
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const [showMapSelectSheet, setShowMapSelectSheet] = useState(false);

  // いいね状態
  const { data: isLiked = false } = useCheckMasterSpotLiked(currentUserId, spot.id);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMasterSpotLike();

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

  // いいねボタン
  const handleLikePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, masterSpotId: spot.id });
  }, [currentUserId, isTogglingLike, toggleLike, spot.id]);

  // Google Mapsで経路を開く
  const handleDirectionsPress = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
    Linking.openURL(url);
  }, [spot.latitude, spot.longitude]);

  // 投稿ボタン - マップ選択シートを表示
  const handlePostPress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('投稿');
      return;
    }
    setShowMapSelectSheet(true);
  }, [currentUserId]);

  // マップ選択後の処理
  const handleMapSelect = useCallback((mapId: string) => {
    // 選択したマップに、現在のユーザーが既にこのマスタースポットを追加しているかチェック
    const existingSpot = userSpots.find(
      (s) => s.user_id === currentUserId && s.map_id === mapId
    );

    if (existingSpot) {
      // 既に追加されている場合は編集画面に遷移
      setShowMapSelectSheet(false);
      onClose();
      router.push(`/edit-spot/${existingSpot.id}` as Href);
      return;
    }

    // 新規追加の場合
    // マップIDを設定
    setSelectedMapId(mapId);
    // MasterSpotDisplayからPlaceSearchResultを作成
    setSelectedPlace({
      id: spot.google_place_id || spot.id,
      name: spot.name,
      address: spot.google_formatted_address,
      latitude: spot.latitude,
      longitude: spot.longitude,
      category: spot.google_types || [],
      googleData: {
        placeId: spot.google_place_id || spot.id,
        placeName: spot.name,
        category: spot.google_types || [],
        address: spot.google_formatted_address,
        formattedAddress: spot.google_formatted_address || undefined,
        internationalPhoneNumber: spot.google_phone_number || undefined,
        websiteUri: spot.google_website_uri || undefined,
        rating: spot.google_rating || undefined,
        userRatingCount: spot.google_user_rating_count || undefined,
      },
    });
    setShowMapSelectSheet(false);
    onClose();
    router.push('/create-spot');
  }, [spot, setSelectedMapId, setSelectedPlace, onClose, router, userSpots, currentUserId]);

  // 新規マップ作成
  const handleCreateNewMap = useCallback(() => {
    setShowMapSelectSheet(false);
    router.push('/create-map');
  }, [router]);

  // ウェブサイトを開く
  const handleWebsitePress = useCallback(() => {
    if (spot.google_website_uri) {
      Linking.openURL(spot.google_website_uri);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Webサイトがありません',
        visibilityTime: 2000,
      });
    }
  }, [spot.google_website_uri]);

  return (
    <>
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onAnimate={handleSheetAnimate}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary }}
    >
      <BottomSheetScrollView className="px-4"  contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-1">
              {spot.name}
            </Text>
            {spot.google_formatted_address && (
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{spot.google_formatted_address}</Text>
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

        {/* アクションボタン - 横並び4つ均等配置 */}
        <View className="flex-row py-3 border-t border-b border-border dark:border-dark-border">
          {/* いいね */}
          <Pressable
            onPress={handleLikePress}
            disabled={isTogglingLike}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? '#EF4444' : colors.text.secondary}
              />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">いいね</Text>
          </Pressable>

          {/* 投稿 */}
          <Pressable
            onPress={handlePostPress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons name="add-circle-outline" size={24} color={colors.primary.DEFAULT} />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">投稿</Text>
          </Pressable>

          {/* 経路案内 */}
          <Pressable
            onPress={handleDirectionsPress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons name="navigate" size={24} color={colors.primary.DEFAULT} />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">経路</Text>
          </Pressable>

          {/* ウェブサイト（常に表示、ない場合はグレーアウト） */}
          <Pressable
            onPress={handleWebsitePress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons
                name="globe-outline"
                size={24}
                color={spot.google_website_uri ? colors.primary.DEFAULT : colors.gray[300]}
              />
            </View>
            <Text className={`text-xs ${spot.google_website_uri ? 'text-foreground-secondary dark:text-dark-foreground-secondary' : 'text-gray-300'}`}>
              Web
            </Text>
          </Pressable>
        </View>

        {/* ユーザー投稿一覧 */}
        <View className="mt-4 pt-4 border-t border-border dark:border-dark-border">
          <View className="flex-row items-center mb-3">
            <Ionicons name="people-outline" size={18} color={colors.text.secondary} />
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground ml-2">
              みんなの投稿 ({spot.user_spots_count}件)
            </Text>
          </View>

          {isLoadingUserSpots ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : userSpots.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                まだ投稿がありません
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {userSpots.map((userSpot) => (
                <Pressable
                  key={userSpot.id}
                  className="bg-surface dark:bg-dark-surface rounded-lg p-3 border border-border dark:border-dark-border active:bg-muted dark:active:bg-dark-muted"
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
                        <Text className="text-sm font-medium text-foreground dark:text-dark-foreground">
                          {userSpot.user?.display_name || userSpot.user?.username || 'ユーザー'}
                        </Text>
                        {userSpot.map && (
                          <View className="flex-row items-center ml-2">
                            <Ionicons name="map-outline" size={12} color={colors.primary.DEFAULT} />
                            <Text className="text-xs text-blue-500 ml-1" numberOfLines={1}>
                              {userSpot.map.name}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                        {getRelativeSpotTime(userSpot.created_at)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </View>

                  {/* カスタム名 */}
                  {userSpot.custom_name && (
                    <Text className="text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
                      {userSpot.custom_name}
                    </Text>
                  )}

                  {/* 説明 */}
                  {userSpot.description && (
                    <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary" numberOfLines={3}>
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
                      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">{userSpot.likes_count}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={14} color={colors.text.secondary} />
                      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1">{userSpot.comments_count}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>

    {/* マップ選択シート */}
    {showMapSelectSheet && (
      <MapSelectSheet
        onSelectMap={handleMapSelect}
        onCreateNewMap={handleCreateNewMap}
        onClose={() => setShowMapSelectSheet(false)}
      />
    )}
    </>
  );
}
