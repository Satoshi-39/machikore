/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * selectedMapIdの有無でデフォルトマップ/ユーザーマップを切り替え
 * URLクエリパラメータ (?id=xxx) でマップ指定可能（共有用）
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useLocation } from '@/shared/lib';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import {
  useSelectedPlaceStore,
  type PlaceSearchResult,
} from '@/features/search-places';
import { ActionSheet, type ActionSheetItem } from '@/shared/ui';

export function MapPage() {
  const { id, addSpot, spotId } = useLocalSearchParams<{ id?: string; addSpot?: string; spotId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const { data: selectedMap, isLoading: isMapLoading } = useMap(selectedMapId);
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { location } = useLocation();
  const mapViewRef = useRef<MapViewHandle>(null);

  // スポットジャンプ用のstoreアクション
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

  // URLクエリパラメータからマップIDを読み取り、グローバルステートに設定
  useEffect(() => {
    if (id) {
      setSelectedMapId(id);
    }
  }, [id, setSelectedMapId]);

  // addSpotパラメータがある場合は検索画面を自動的に開く（スポット追加モード）
  useEffect(() => {
    if (addSpot) {
      setIsSearchFocused(true);
    }
  }, [addSpot]);

  // spotIdパラメータがある場合はスポットにジャンプ
  useEffect(() => {
    if (spotId) {
      setJumpToSpotId(spotId);
    }
  }, [spotId, setJumpToSpotId]);

  // URLパラメータのidもチェック（storeが更新される前でもユーザーマップとして扱う）
  const isUserMap = selectedMapId != null || id != null;

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

  const handleCloseUserMap = () => {
    setSelectedMapId(null);
    router.push('/(tabs)/map');
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
    router.push(`/(tabs)/map?id=${mapId}`);
  };

  const handleUserPress = () => {
    if (selectedMap?.user_id) {
      router.push(`/users/${selectedMap.user_id}`);
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
    router.push(`/edit-spot?id=${spotId}`);
  };

  // 三点リーダメニューを開く
  const handleMenuPress = () => {
    setIsMenuOpen(true);
  };

  // いいね処理
  const handleLikePress = () => {
    setIsLiked(!isLiked);
    // TODO: API呼び出し
  };

  // ブックマーク処理
  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: API呼び出し
  };

  // 共有処理
  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `${selectedMap?.name || 'マップ'}をチェック！`,
        url: `https://machikore.app/map/${selectedMapId}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // アクションシートのメニュー項目
  const menuItems: ActionSheetItem[] = useMemo(() => [
    {
      id: 'like',
      label: isLiked ? 'いいね済み' : 'いいね',
      icon: isLiked ? 'heart' : 'heart-outline',
      iconColor: isLiked ? '#EF4444' : undefined,
      onPress: handleLikePress,
    },
    {
      id: 'bookmark',
      label: isBookmarked ? '保存済み' : '保存',
      icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
      iconColor: isBookmarked ? '#F59E0B' : undefined,
      onPress: handleBookmarkPress,
    },
    {
      id: 'share',
      label: '共有',
      icon: 'share-outline',
      onPress: handleSharePress,
    },
  ], [isLiked, isBookmarked]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={isUserMap ? ['top'] : []}>
      {/* ヘッダー（ユーザーマップの時のみ表示、検索中は非表示） */}
      {isUserMap && !isSearchFocused && (
        <MapHeader
          isUserMap={isUserMap}
          isLoading={isLoadingUserMap}
          mapTitle={selectedMap?.name}
          userName={mapOwner?.display_name || undefined}
          userAvatarUrl={mapOwner?.avatar_url || undefined}
          userMaps={ownerMaps}
          onClose={handleCloseUserMap}
          onMapSelect={handleMapSelect}
          onUserPress={handleUserPress}
          onSearchPress={handleSearchFocus}
          onMenuPress={handleMenuPress}
        />
      )}

      {/* マップアクションシート */}
      <ActionSheet
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={menuItems}
        title={selectedMap?.name}
      />

      {/* マップ表示（常にレンダリング） */}
      <View className="flex-1">
        {/* デフォルトマップ or ユーザーマップ */}
        {isUserMap ? (
          <UserMapView
            ref={mapViewRef}
            mapId={selectedMapId || id || null}
            userId={user?.id ?? null}
            currentUserId={user?.id ?? null}
            defaultMapId={myMaps?.[0]?.id ?? null}
            currentLocation={location}
            viewMode={viewMode}
            isSearchFocused={isSearchFocused}
            onEditSpot={handleEditSpot}
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
          <View className="absolute inset-0 bg-white" style={{ paddingTop: isUserMap ? 0 : insets.top }}>
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
            className="absolute inset-0 z-50"
            style={{
              paddingTop: isUserMap ? 0 : insets.top,
              backgroundColor: 'white',
            }}
          >
            {isUserMap ? (
              // ユーザーマップ: 自分のマップか他人のマップかで分岐
              selectedMap?.user_id === user?.id ? (
                // 自分のマップ: Google Places APIで新規スポット検索
                <OwnMapSearch
                  mapId={selectedMapId || id || null}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClose={handleSearchClose}
                  currentLocation={location}
                  onPlaceSelect={handlePlaceSelect}
                  onMapPinSelect={handleMapPinSelect}
                />
              ) : (
                // 他人のマップ: そのユーザーのスポットを検索
                <OtherMapSearch
                  mapUserId={selectedMap?.user_id ?? null}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onClose={handleSearchClose}
                />
              )
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

      </View>
    </SafeAreaView>
  );
}
