/**
 * ユーザーマップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 特定ユーザーのマップを表示・管理
 */

import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { useMapStore, useMap, useUserMaps } from '@/entities/map';
import { UserMapView } from '@/widgets/user-map-view';
import { UserMapList } from '@/widgets/user-map-list';
import { OwnMapSearch } from '@/widgets/own-map-search';
import { OtherMapSearch } from '@/widgets/other-map-search';
import { MapHeader } from '@/widgets/map-header';
import type { MapViewHandle } from '@/shared/lib/map';
import { useLocation, useCurrentTab, useSafeBack } from '@/shared/lib';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import type { UserMapThemeColor } from '@/shared/config';
import {
  useSelectedPlaceStore,
  type PlaceSearchResult,
  type ManualLocationInput,
  reverseGeocode,
} from '@/features/search-places';
import { usePinDropStore } from '@/features/drop-pin';
import * as Crypto from 'expo-crypto';

interface UserMapPageProps {
  /** マップID（必須） */
  mapId: string;
  /** 初期表示するスポットID */
  initialSpotId?: string;
}

export function UserMapPage({ mapId, initialSpotId: propSpotId }: UserMapPageProps) {
  const { spotId } = useLocalSearchParams<{ spotId?: string }>();
  const effectiveSpotId = propSpotId ?? spotId;

  const router = useRouter();
  const currentTab = useCurrentTab();
  const insets = useSafeAreaInsets();
  const { goBack } = useSafeBack();

  const user = useUserStore((state) => state.user);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);

  const { data: selectedMap, isLoading: isMapLoading } = useMap(mapId);
  const mapOwner = selectedMap?.user ?? null;

  // ログインユーザー自身のマップ一覧（デフォルトマップIDの取得用）
  const { data: myMaps } = useUserMaps(user?.id ?? null, { currentUserId: user?.id });

  // マップ所有者のマップ一覧を取得（ヘッダーのドロップダウン用）
  const mapOwnerId = selectedMap?.user_id ?? null;
  const { data: ownerMaps } = useUserMaps(mapOwnerId, { currentUserId: user?.id });

  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDetailCardMaximized, setIsDetailCardMaximized] = useState(false);
  const { location } = useLocation();
  const mapViewRef = useRef<MapViewHandle>(null);

  // スポットジャンプ用のstoreアクション
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

  // ピン刺しモード開始
  const startPinDropMode = usePinDropStore((state) => state.startPinDropMode);

  // マップIDをグローバルステートに設定（スポット作成時などで使用）
  useEffect(() => {
    setSelectedMapId(mapId);
  }, [mapId, setSelectedMapId]);

  // スポットIDがある場合はスポットにジャンプ
  useEffect(() => {
    if (effectiveSpotId) {
      setJumpToSpotId(effectiveSpotId);
    }
  }, [effectiveSpotId, setJumpToSpotId]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedMapId(null);
    goBack();
  };

  // 検索結果タップ時の処理（新規スポット作成）
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const handlePlaceSelect = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
    router.push('/create-spot');
  };

  const handleMapSelect = (newMapId: string) => {
    setSelectedMapId(newMapId);
    router.replace(`/(tabs)/${currentTab}/maps/${newMapId}` as any);
  };

  const handleUserPress = () => {
    if (selectedMap?.user_id) {
      router.push(`/(tabs)/${currentTab}/users/${selectedMap.user_id}` as any);
    }
  };

  // 地図上でピン刺しモード開始
  const handleMapPinSelect = () => {
    startPinDropMode();
  };

  // ピン刺し確定時のハンドラー
  const handlePinDropConfirm = async (pinLocation: { latitude: number; longitude: number }) => {
    let shortAddress: string | null = null;
    let formattedAddress: string | null = null;
    try {
      const addresses = await reverseGeocode(pinLocation.latitude, pinLocation.longitude);
      if (addresses) {
        shortAddress = addresses.shortAddress;
        formattedAddress = addresses.formattedAddress;
      }
    } catch (error) {
      console.warn('住所の取得に失敗しました:', error);
    }

    const manualInput: ManualLocationInput = {
      id: Crypto.randomUUID(),
      name: null,
      shortAddress,
      formattedAddress,
      latitude: pinLocation.latitude,
      longitude: pinLocation.longitude,
      category: [],
      source: 'map_pin',
    };

    setSelectedPlace(manualInput);
    router.push('/create-spot');
  };

  // スポット編集
  const handleEditSpot = (spotId: string) => {
    router.push(`/edit-spot/${spotId}` as Href);
  };

  // 記事ページへ遷移
  const handleArticlePress = () => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as any);
  };

  // マップ編集画面へ遷移
  const handleEditMap = () => {
    router.push(`/edit-map/${mapId}` as Href);
  };

  return (
    <View className="flex-1">
      {/* マップ表示（常にレンダリング・全画面） */}
      <View className="flex-1">
        <UserMapView
          ref={mapViewRef}
          mapId={mapId}
          userId={user?.id ?? null}
          currentUserId={user?.id ?? null}
          defaultMapId={myMaps?.[0]?.id ?? null}
          initialSpotId={effectiveSpotId}
          currentLocation={location}
          viewMode={viewMode}
          isSearchFocused={isSearchFocused}
          onEditSpot={handleEditSpot}
          onDetailCardMaximized={setIsDetailCardMaximized}
          onPinDropConfirm={handlePinDropConfirm}
        />

        {/* リスト表示時：マップの上にリストUIをオーバーレイ */}
        {viewMode === 'list' && !isSearchFocused && (
          <View className="absolute inset-0 bg-surface dark:bg-dark-surface">
            <UserMapList
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSearchFocus={handleSearchFocus}
            />
          </View>
        )}

        {/* 検索フォーカス時：全画面検索UI（マップの上に重ねる） */}
        {isSearchFocused && selectedMap && (
          <View
            className="absolute inset-0 z-50 bg-surface dark:bg-dark-surface"
            style={{ paddingTop: insets.top }}
          >
            {selectedMap.user_id === user?.id ? (
              // 自分のマップ: Google Places APIで新規スポット検索
              <OwnMapSearch
                mapId={mapId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                currentLocation={location}
                onPlaceSelect={handlePlaceSelect}
                onMapPinSelect={handleMapPinSelect}
                themeColor={selectedMap.theme_color as UserMapThemeColor}
              />
            ) : (
              // 他人のマップ: そのマップのスポットを検索
              <OtherMapSearch
                mapId={selectedMap.id}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                onSpotSelect={(spot) => setJumpToSpotId(spot.id)}
                themeColor={selectedMap.theme_color as UserMapThemeColor}
              />
            )}
          </View>
        )}
      </View>

      {/* ヘッダー（検索中・カード最大時は非表示） - マップ上にオーバーレイ */}
      {!isSearchFocused && !isDetailCardMaximized && (
        <View
          className="absolute top-0 left-0 right-0"
          style={{ paddingTop: insets.top }}
        >
          <View className="mx-4 mt-2">
            <MapHeader
              isUserMap
              isLoading={isMapLoading}
              mapId={mapId}
              mapTitle={selectedMap?.name}
              userId={user?.id}
              currentUserId={user?.id}
              mapOwnerId={selectedMap?.user_id}
              userName={mapOwner?.display_name || undefined}
              userAvatarUrl={mapOwner?.avatar_url || undefined}
              userMaps={ownerMaps}
              onBack={handleBack}
              onMapSelect={handleMapSelect}
              onUserPress={handleUserPress}
              onSearchPress={handleSearchFocus}
              onArticlePress={handleArticlePress}
              onEditPress={handleEditMap}
            />
          </View>
        </View>
      )}
    </View>
  );
}
