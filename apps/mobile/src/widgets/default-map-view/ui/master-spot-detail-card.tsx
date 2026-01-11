/**
 * デフォルトマップ上で選択されたマスタースポットの詳細情報カード
 */

import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { colors, LOCATION_ICONS, SPOT_TYPE_COLORS } from '@/shared/config';
import {
  showLoginRequiredAlert,
  useCurrentTab,
  useSearchBarSync,
  useLocationButtonSync,
  SEARCH_BAR_BOTTOM_Y,
} from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { LocationPinIcon, AddressPinIcon, DirectionsButton } from '@/shared/ui';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';
import { extractAddress, extractName } from '@/shared/lib/utils/multilang.utils';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotsByMasterSpot, SpotCard } from '@/entities/user-spot';
import { determineSpotCategory } from '@/entities/master-spot';
import { useCurrentUserId } from '@/entities/user';
import { useCheckMasterSpotFavorited, useAddMasterSpotFavorite, useRemoveMasterSpotFavorite } from '@/entities/master-spot';
import { useSelectedPlaceStore } from '@/features/search-places';
import { useMapStore } from '@/entities/map';
import { MapSelectSheet } from '@/widgets/map-select-sheet';

interface MasterSpotDetailCardProps {
  spot: MasterSpotDisplay;
  onClose: () => void;
  onSnapChange?: (snapIndex: number) => void;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  /** 閉じるボタン押下前に呼ばれるコールバック（現在地ボタン非表示用） */
  onBeforeClose?: () => void;
  /** 現在地ボタンの表示/非表示変更コールバック（高さベースの判定） */
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
}

/** 検索バー・現在地ボタン同期を行う内部コンテンツコンポーネント */
function MasterSpotDetailCardContent({
  searchBarBottomY,
  onSearchBarVisibilityChange,
  onLocationButtonVisibilityChange,
}: {
  searchBarBottomY: number;
  onSearchBarVisibilityChange?: (isHidden: boolean) => void;
  onLocationButtonVisibilityChange?: (isVisible: boolean) => void;
}) {
  useSearchBarSync({
    searchBarBottomY,
    onVisibilityChange: onSearchBarVisibilityChange ?? (() => {}),
  });

  useLocationButtonSync({
    onVisibilityChange: onLocationButtonVisibilityChange ?? (() => {}),
  });

  return null;
}

export function MasterSpotDetailCard({ spot, onClose, onSnapChange, onSearchBarVisibilityChange, onBeforeClose, onLocationButtonVisibilityChange }: MasterSpotDetailCardProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();
  const { locale } = useI18n();
  const screenWidth = Dimensions.get('window').width;
  // SpotCard用のコンテナ幅計算: 画面幅 - BottomSheetのpx-4(32px) - カードのp-4(32px) - border(2px)
  const spotCardContainerWidth = screenWidth - 32 - 32 - 2;
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const [showMapSelectSheet, setShowMapSelectSheet] = useState(false);

  // お気に入り状態
  const { data: isFavorited = false } = useCheckMasterSpotFavorited(currentUserId, spot.id);
  const { mutate: addFavorite } = useAddMasterSpotFavorite();
  const { mutate: removeFavorite } = useRemoveMasterSpotFavorite();

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
    // まず現在地ボタンを非表示にしてから、BottomSheetを閉じる
    onBeforeClose?.();
    bottomSheetRef.current?.close();
  }, [onBeforeClose]);

  // お気に入りボタン
  const handleFavoritePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('お気に入り');
      return;
    }
    if (isFavorited) {
      removeFavorite({ userId: currentUserId, masterSpotId: spot.id });
    } else {
      addFavorite({ userId: currentUserId, masterSpotId: spot.id });
    }
  }, [currentUserId, isFavorited, spot.id, addFavorite, removeFavorite]);

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
    // JSONB型の住所・名前を現在のlocaleで抽出
    const shortAddress = extractAddress(spot.google_short_address, locale);
    const formattedAddress = extractAddress(spot.google_formatted_address, locale);
    const name = extractName(spot.name, locale) || '';
    setSelectedPlace({
      id: spot.google_place_id || spot.id,
      name,
      shortAddress,
      formattedAddress,
      latitude: spot.latitude,
      longitude: spot.longitude,
      category: spot.google_types || [],
      googleData: {
        placeId: spot.google_place_id || spot.id,
        placeName: name,
        category: spot.google_types || [],
        shortAddress,
        formattedAddress,
        internationalPhoneNumber: spot.google_phone_number || undefined,
        websiteUri: spot.google_website_uri || undefined,
        rating: spot.google_rating || undefined,
        userRatingCount: spot.google_user_rating_count || undefined,
      },
    });
    setShowMapSelectSheet(false);
    onClose();
    router.push('/create-spot');
  }, [spot, setSelectedMapId, setSelectedPlace, onClose, router, userSpots, currentUserId, locale]);

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

  // SpotCard用ハンドラー
  const handleSpotPress = useCallback((spotId: string) => {
    onClose();
    router.push(`/(tabs)/${currentTab}/spots/${spotId}` as any);
  }, [onClose, router, currentTab]);

  const handleUserPress = useCallback((userId: string) => {
    onClose();
    router.push(`/(tabs)/${currentTab}/users/${userId}` as any);
  }, [onClose, router, currentTab]);

  const handleMapPress = useCallback((mapId: string) => {
    onClose();
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [onClose, router, currentTab]);

  const handleCommentPress = useCallback((spotId: string) => {
    onClose();
    router.push(`/(tabs)/${currentTab}/comments/spots/${spotId}` as any);
  }, [onClose, router, currentTab]);

  return (
    <>
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
      <MasterSpotDetailCardContent
        searchBarBottomY={SEARCH_BAR_BOTTOM_Y}
        onSearchBarVisibilityChange={onSearchBarVisibilityChange}
        onLocationButtonVisibilityChange={onLocationButtonVisibilityChange}
      />

      <BottomSheetScrollView className="px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <LocationPinIcon size={24} color={SPOT_TYPE_COLORS[determineSpotCategory(spot.google_types)]} />
              <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground ml-2">
                {extractName(spot.name, locale)}
              </Text>
            </View>
            {spot.google_short_address && (
              <View className="flex-row items-center">
                <AddressPinIcon size={14} color={LOCATION_ICONS.ADDRESS.color} holeColor={isDarkMode ? LOCATION_ICONS.ADDRESS.holeColorDark : LOCATION_ICONS.ADDRESS.holeColorLight} />
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-1">{extractAddress(spot.google_short_address, locale)}</Text>
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

        {/* アクションボタン - 横並び4つ均等配置 */}
        <View className="flex-row py-3 border-t border-b border-border dark:border-dark-border">
          {/* 投稿 */}
          <Pressable
            onPress={handlePostPress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons name="add-circle-outline" size={24} color={colors.text.secondary} />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">投稿</Text>
          </Pressable>

          {/* 経路案内 */}
          <DirectionsButton
            latitude={spot.latitude}
            longitude={spot.longitude}
            variant="circle"
          />

          {/* ウェブサイト（常に表示、ない場合はグレーアウト） */}
          <Pressable
            onPress={handleWebsitePress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons
                name="globe-outline"
                size={24}
                color={spot.google_website_uri ? colors.text.secondary : colors.gray[300]}
              />
            </View>
            <Text className={`text-xs ${spot.google_website_uri ? 'text-foreground-secondary dark:text-dark-foreground-secondary' : 'text-gray-300'}`}>
              Web
            </Text>
          </Pressable>

          {/* お気に入り */}
          <Pressable
            onPress={handleFavoritePress}
            className="flex-1 items-center py-2"
          >
            <View className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-1">
              <Ionicons
                name={isFavorited ? 'star' : 'star-outline'}
                size={24}
                color={isFavorited ? colors.warning : colors.text.secondary}
              />
            </View>
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">お気に入り</Text>
          </Pressable>
        </View>

        {/* ユーザー投稿一覧 */}
        <View className="mt-4">
          <View className="flex-row items-center mb-3 px-4">
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
                <View
                  key={userSpot.id}
                  className="rounded-xl overflow-hidden border border-border dark:border-dark-border"
                >
                  <SpotCard
                    spot={userSpot}
                    currentUserId={currentUserId}
                    containerWidth={spotCardContainerWidth}
                    onPress={() => handleSpotPress(userSpot.id)}
                    onUserPress={handleUserPress}
                    onMapPress={handleMapPress}
                    onCommentPress={handleCommentPress}
                  />
                </View>
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
