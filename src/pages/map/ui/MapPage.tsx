/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * selectedMapIdの有無でデフォルトマップ/ユーザーマップを切り替え
 * URLクエリパラメータ (?id=xxx) でマップ指定可能（共有用）
 */

import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useUserStore } from '@/entities/user';
import { useMapStore, useMap, useUserMaps } from '@/entities/map';
import { DefaultMapView } from '@/widgets/default-map-view';
import { DefaultMapList } from '@/widgets/default-map-list';
import { UserMapView } from '@/widgets/user-map-view';
import type { MapViewHandle } from '@/shared/lib/map';
import { UserMapList } from '@/widgets/user-map-list';
import { DefaultMapSearch } from '@/widgets/default-map-search';
import { OwnMapSearch } from '@/widgets/own-map-search';
import { OtherMapSearch } from '@/widgets/other-map-search';
import { MapHeader } from '@/widgets/map-header';
import { useLocation, useCurrentTab } from '@/shared/lib';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import {
  useSelectedPlaceStore,
  type PlaceSearchResult,
} from '@/features/search-places';
import { useSearchResultJump } from '@/features/map-jump';

interface MapPageProps {
  /** propsで渡されるマップID（URLパラメータより優先） */
  mapId?: string;
  /** propsで渡されるスポットID（URLパラメータより優先） */
  initialSpotId?: string;
}

export function MapPage({ mapId: propMapId, initialSpotId: propSpotId }: MapPageProps = {}) {
  const { id, addSpot, spotId } = useLocalSearchParams<{ id?: string; addSpot?: string; spotId?: string }>();

  // propsがあればpropsを優先、なければURLパラメータを使用
  const effectiveMapId = propMapId ?? id;
  const effectiveSpotId = propSpotId ?? spotId;
  const router = useRouter();
  const currentTab = useCurrentTab();
  const insets = useSafeAreaInsets();

  // 検索結果からのジャンプ処理
  const { jumpToSearchResult } = useSearchResultJump();

  const user = useUserStore((state) => state.user);
  // スポット作成時などでマップIDを共有するためにsetSelectedMapIdは維持
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);

  // propMapIdがある場合はそれを使う
  // マップタブのindex（propMapIdなし）ではデフォルトマップを表示（currentMapId = null）
  // グローバルステートのselectedMapIdは参照しない（タブ間の状態共有を避ける）
  const currentMapId = propMapId ?? null;
  const { data: selectedMap, isLoading: isMapLoading } = useMap(currentMapId);
  // UserMap型にはuser情報が含まれているので、直接使用
  const mapOwner = selectedMap?.user ?? null;

  // ログインユーザー自身のマップ一覧（デフォルトマップIDの取得用）
  const { data: myMaps } = useUserMaps(user?.id ?? null, { currentUserId: user?.id });

  // マップ所有者のマップ一覧を取得（ヘッダーのドロップダウン用）
  // - 自分のマップ: 公開・非公開両方
  // - 他ユーザのマップ: 公開のみ
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

  // マップIDをグローバルステートに設定
  // スポット作成時などで使用するため、常にセットする
  useEffect(() => {
    if (effectiveMapId) {
      setSelectedMapId(effectiveMapId);
    }
  }, [effectiveMapId, setSelectedMapId]);

  // addSpotパラメータがある場合は検索画面を自動的に開く（スポット追加モード）
  useEffect(() => {
    if (addSpot) {
      setIsSearchFocused(true);
    }
  }, [addSpot]);

  // スポットIDがある場合はスポットにジャンプ
  useEffect(() => {
    if (effectiveSpotId) {
      setJumpToSpotId(effectiveSpotId);
    }
  }, [effectiveSpotId, setJumpToSpotId]);

  // propMapIdがある場合のみユーザーマップとして扱う
  // effectiveMapIdはURLパラメータも含むため、スタックナビゲーションで戻った時に
  // 前のURLパラメータが残る可能性があるので使用しない
  const isUserMap = propMapId != null;

  // マップ読み込み中かどうか（ユーザーマップの場合のみ）
  const isLoadingUserMap = isUserMap && isMapLoading;

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
    setSearchQuery(''); // 検索画面を閉じた時にクリア
  };

  // クイック検索（カテゴリボタン押下時）
  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(true);
  };

  const handleBack = () => {
    // propsでmapIdが渡されている場合（/maps/[id]や/spots/[id]から呼ばれた場合）は
    // グローバルステートをクリアして、タブのマップ画面がデフォルトマップに戻るようにする
    // タブ内での遷移（マップ選択→スポット追加モード等）ではクリアしない
    if (propMapId) {
      setSelectedMapId(null);
    }
    // 戻れる場合は戻る、戻れない場合は dismiss でスタックを閉じる
    if (router.canGoBack()) {
      router.back();
    } else {
      router.dismiss();
    }
  };

  // 検索結果タップ時の処理（新規スポットのみ）
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const handlePlaceSelect = (place: PlaceSearchResult) => {
    // Google Places APIの結果 → スポット作成画面へ遷移
    setSelectedPlace(place);
    router.push('/create-spot');
  };

  const handleMapSelect = (mapId: string) => {
    setSelectedMapId(mapId);
    router.replace(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  };

  const handleUserPress = () => {
    if (selectedMap?.user_id) {
      router.push(`/(tabs)/${currentTab}/users/${selectedMap.user_id}` as any);
    }
  };

  // 地図上でピン刺しモード開始
  const handleMapPinSelect = () => {
    // TODO: ピン刺しモードを実装
    // 現状は検索画面が閉じるだけ（OwnMapSearch側でonCloseを呼んでいる）
    console.log('📍 ピン刺しモード開始');
  };

  // スポット編集
  const handleEditSpot = (spotId: string) => {
    router.push(`/edit-spot/${spotId}` as Href);
  };

  // 記事ページへ遷移
  const handleArticlePress = () => {
    if (!currentMapId) return;
    router.push(`/(tabs)/${currentTab}/articles/maps/${currentMapId}` as any);
  };

  // マップ編集画面へ遷移
  const handleEditMap = () => {
    if (!currentMapId) return;
    router.push(`/edit-map/${currentMapId}` as Href);
  };

  return (
    <View className="flex-1">
      {/* マップ表示（常にレンダリング・全画面） */}
      <View className="flex-1">
        {/* デフォルトマップ or ユーザーマップ */}
        {isUserMap ? (
          <UserMapView
            ref={mapViewRef}
            mapId={currentMapId || effectiveMapId || null}
            userId={user?.id ?? null}
            currentUserId={user?.id ?? null}
            defaultMapId={myMaps?.[0]?.id ?? null}
            initialSpotId={effectiveSpotId}
            currentLocation={location}
            viewMode={viewMode}
            isSearchFocused={isSearchFocused}
            onEditSpot={handleEditSpot}
            onDetailCardMaximized={setIsDetailCardMaximized}
          />
        ) : (
          <DefaultMapView
            ref={mapViewRef}
            userId={user?.id ?? null}
            currentLocation={location}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSearchFocus={handleSearchFocus}
            onQuickSearch={handleQuickSearch}
            isSearchFocused={isSearchFocused}
          />
        )}

        {/* リスト表示時：マップの上にリストUIをオーバーレイ */}
        {viewMode === 'list' && !isSearchFocused && (
          <View className="absolute inset-0 bg-surface dark:bg-dark-surface" style={{ paddingTop: isUserMap ? 0 : insets.top }}>
            {isUserMap ? (
              <UserMapList
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSearchFocus={handleSearchFocus}
              />
            ) : (
              <DefaultMapList
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSearchFocus={handleSearchFocus}
              />
            )}
          </View>
        )}

        {/* 検索フォーカス時：全画面検索UI（マップの上に重ねる） */}
        {isSearchFocused && (
          <View
            className="absolute inset-0 z-50 bg-surface dark:bg-dark-surface"
            style={{
              paddingTop: insets.top,
            }}
          >
            {isUserMap ? (
              // ユーザーマップ: 自分のマップか他人のマップかで分岐
              selectedMap?.user_id === user?.id ? (
                // 自分のマップ: Google Places APIで新規スポット検索
                <OwnMapSearch
                  mapId={currentMapId || effectiveMapId || null}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClose={handleSearchClose}
                  currentLocation={location}
                  onPlaceSelect={handlePlaceSelect}
                  onMapPinSelect={handleMapPinSelect}
                />
              ) : (
                // 他人のマップ: そのマップのスポットを検索
                <OtherMapSearch
                  mapId={selectedMap?.id ?? null}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClose={handleSearchClose}
                  onSpotSelect={(spot) => setJumpToSpotId(spot.id)}
                />
              )
            ) : (
              // デフォルトマップ: 街コレデータ（machis + 全spots）を検索
              <DefaultMapSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClose={handleSearchClose}
                onPlaceSelect={jumpToSearchResult}
              />
            )}
          </View>
        )}

      </View>

      {/* ヘッダー（ユーザーマップの時のみ表示、検索中・カード最大時は非表示） - マップ上にオーバーレイ */}
      {isUserMap && !isSearchFocused && !isDetailCardMaximized && (
        <View
          className="absolute top-0 left-0 right-0"
          style={{ paddingTop: insets.top }}
        >
          <View className="mx-4 mt-2">
            <MapHeader
              isUserMap={isUserMap}
              isLoading={isLoadingUserMap}
              mapId={currentMapId}
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
