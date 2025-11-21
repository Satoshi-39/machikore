/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * selectedMapIdの有無でデフォルトマップ/ユーザーマップを切り替え
 * URLクエリパラメータ (?id=xxx) でマップ指定可能（共有用）
 */

import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore, useUser } from '@/entities/user';
import { useMapStore, useMap, useUserMaps } from '@/entities/user-map';
import { DefaultMapView } from '@/widgets/default-map-view';
import { DefaultMapHierarchy } from '@/widgets/default-map-hierarchy';
import { UserMapView } from '@/widgets/user-map-view';
import type { MapViewHandle } from '@/shared/lib/map';
import { UserMapList } from '@/widgets/user-map-list';
import { DefaultMapSearch } from '@/widgets/default-map-search';
import { UserMapSearch } from '@/widgets/user-map-search';
import { MapHeader } from '@/widgets/map-header';
import { MapControls } from '@/widgets/map-controls';
import { useLocation } from '@/shared/lib';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import {
  useSelectedPlaceStore,
  type PlaceSearchResult,
  type MachikorePlaceSearchResult,
} from '@/features/search-places';

export function MapPage() {
  const { id, addSpot } = useLocalSearchParams<{ id?: string; addSpot?: string }>();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const { data: selectedMap } = useMap(selectedMapId);
  const { data: userMaps } = useUserMaps(user?.id ?? null);
  const { data: mapOwner } = useUser(selectedMap?.user_id ?? null);
  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [spotDetailSnapIndex, setSpotDetailSnapIndex] = useState<number>(1);
  const [machiDetailSnapIndex, setMachiDetailSnapIndex] = useState<number>(1);
  const { location } = useLocation();
  const mapViewRef = useRef<MapViewHandle>(null);
  const [quickAddTrigger, setQuickAddTrigger] = useState(0);

  // URLクエリパラメータからマップIDを読み取り、グローバルステートに設定
  useEffect(() => {
    if (id) {
      setSelectedMapId(id);
    }
  }, [id, setSelectedMapId]);

  // addSpotパラメータを監視して、QuickAddMenuを開くトリガーを発火
  useEffect(() => {
    if (addSpot) {
      setQuickAddTrigger((prev) => prev + 1);
      // パラメータをクリーンアップ（一度メニューを開いたら削除）
      // 注: storeのselectedMapIdではなく、URLパラメータのidを使用（タイミング問題回避）
      router.replace(id ? `/(tabs)/map?id=${id}` : '/(tabs)/map');
    }
  }, [addSpot, id, router]);

  // URLパラメータのidもチェック（storeが更新される前でもユーザーマップとして扱う）
  const isUserMap = selectedMapId != null || id != null;

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const handleSearchRequest = () => {
    setIsSearchFocused(true);
  };

  const handleCloseUserMap = () => {
    setSelectedMapId(null);
    router.push('/(tabs)/map');
  };

  // 検索結果タップ時の処理
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const handlePlaceSelect = (place: PlaceSearchResult | MachikorePlaceSearchResult) => {
    // 型ガード：PlaceSearchResult（Google Places API）かどうか判定
    const isGooglePlace = 'googleData' in place;

    if (isGooglePlace) {
      // Google Places APIの結果 → スポット作成画面へ遷移
      setSelectedPlace(place as PlaceSearchResult);
      router.push('/create-spot');
    } else {
      // ローカルDBの結果 → 既存スポットなので詳細表示
      // TODO: スポット詳細表示の実装（後で）
      console.log('既存スポット選択:', place);
    }
  };

  const handleMapSelect = (mapId: string) => {
    setSelectedMapId(mapId);
    router.push(`/(tabs)/map?id=${mapId}`);
  };

  const handleUserPress = () => {
    if (selectedMap?.user_id) {
      router.push(`/user/${selectedMap.user_id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* ヘッダー */}
      <MapHeader
        isUserMap={isUserMap}
        mapTitle={selectedMap?.name}
        userName={
          (isUserMap
            ? mapOwner?.display_name
            : user?.display_name) || undefined
        }
        userAvatarUrl={
          (isUserMap
            ? mapOwner?.avatar_url
            : user?.avatar_url) || undefined
        }
        userMaps={userMaps}
        onClose={handleCloseUserMap}
        onMapSelect={handleMapSelect}
        onUserPress={handleUserPress}
      />

      {/* マップ表示（常にレンダリング） */}
      <View className="flex-1">
        {/* デフォルトマップ or ユーザーマップ */}
        {isUserMap ? (
          <UserMapView
            ref={mapViewRef}
            mapId={selectedMapId || id || null}
            userId={user?.id ?? null}
            defaultMapId={userMaps?.[0]?.id ?? null}
            onSpotDetailSnapChange={(snapIndex) => setSpotDetailSnapIndex(snapIndex)}
            currentLocation={location}
            viewMode={viewMode}
            isSearchFocused={isSearchFocused}
            autoOpenQuickAdd={addSpot != null}
            quickAddTrigger={quickAddTrigger}
            onSearchRequest={handleSearchRequest}
          />
        ) : (
          <DefaultMapView
            ref={mapViewRef}
            userId={user?.id ?? null}
            currentLocation={location}
            onMachiDetailSnapChange={(snapIndex) => setMachiDetailSnapIndex(snapIndex)}
            viewMode={viewMode}
            isSearchFocused={isSearchFocused}
          />
        )}

        {/* リスト表示時：マップの上にリストUIをオーバーレイ */}
        {viewMode === 'list' && !isSearchFocused && (
          <View className="absolute inset-0 bg-white">
            {/* 検索バー + ViewModeToggle */}
            <MapControls
              variant="list"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSearchFocus={handleSearchFocus}
              className="px-5 pt-5 pb-3"
            />

            {/* デフォルトマップの階層リスト or ユーザーマップのフラットリスト */}
            {isUserMap ? <UserMapList /> : <DefaultMapHierarchy />}
          </View>
        )}

        {/* 検索フォーカス時：全画面検索UI（マップの上に重ねる） */}
        {isSearchFocused && (
          <View className="absolute inset-0 z-50">
            {isUserMap ? (
              // ユーザーマップ: 自分のマップならGoogle Places API、他人のマップなら街コレデータ
              <UserMapSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                currentLocation={location}
                mapUserId={selectedMap?.user_id ?? null}
                currentUserId={user?.id ?? null}
                onPlaceSelect={handlePlaceSelect}
              />
            ) : (
              // デフォルトマップ: 街コレデータ（machis + 全spots）を検索
              <DefaultMapSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                onPlaceSelect={(place) => {
                  console.log('場所選択:', place);
                  // TODO: 場所選択後の処理
                }}
              />
            )}
          </View>
        )}

        {/* 検索バー + ViewModeToggle をマップの上に表示（マップモード時かつ検索時と拡大時は非表示） */}
        {viewMode === 'map' && !isSearchFocused && (
          <View
            className="absolute top-0 left-0 right-0"
            style={{
              opacity: spotDetailSnapIndex === 2 || machiDetailSnapIndex === 2 ? 0 : 1,
            }}
            pointerEvents={spotDetailSnapIndex === 2 || machiDetailSnapIndex === 2 ? 'none' : 'auto'}
          >
            <MapControls
              variant="map"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSearchFocus={handleSearchFocus}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
