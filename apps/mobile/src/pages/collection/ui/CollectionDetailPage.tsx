/**
 * コレクション詳細ページ
 *
 * コレクション内のマップ一覧を表示
 */

import { useCollection, useCollectionMaps } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { CollectionLikeButton } from '@/features/collection-like';
import { LikersModal } from '@/features/view-likers';
import type { CollectionMapWithDetails } from '@/shared/api/supabase/collections';
import { avatarSizeNum, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import type { ThumbnailCrop } from '@/shared/lib/image';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { useCurrentTab } from '@/shared/lib/navigation';
import type { MapWithUser } from '@/shared/types';
import {
  CroppedThumbnail,
  ErrorView,
  Loading,
  PageHeader,
  PopupMenu,
  type PopupMenuItem,
} from '@/shared/ui';
import { MapDisplayCard } from '@/widgets/map-cards';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

interface CollectionDetailPageProps {
  collectionId: string;
}

export function CollectionDetailPage({
  collectionId,
}: CollectionDetailPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    error: collectionError,
  } = useCollection(collectionId, currentUserId);
  const {
    data: collectionMapsData,
    isLoading: isLoadingMaps,
    error: mapsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useCollectionMaps(collectionId, currentUserId);

  // ページデータをフラット化
  const collectionMaps = useMemo(
    () => collectionMapsData?.pages.flatMap((page) => page) ?? [],
    [collectionMapsData]
  );

  const isOwner = collection?.user_id === currentUserId;
  const isLoading = isLoadingCollection || isLoadingMaps;
  const error = collectionError || mapsError;

  // 無限スクロール用ハンドラ
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // フッターコンポーネント（ローディング表示）
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  const handleEdit = useCallback(() => {
    router.push(`/edit-collection/${collectionId}` as Href);
  }, [router, collectionId]);

  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (!isOwner) return [];
    return [
      {
        id: 'edit',
        label: t('common.edit'),
        icon: 'create-outline',
        onPress: handleEdit,
      },
    ];
  }, [isOwner, handleEdit, t]);

  // CollectionMapWithDetails.map を MapWithUser として扱うためのヘルパー
  const toMapWithUser = (
    item: CollectionMapWithDetails
  ): MapWithUser | null => {
    if (!item.map) return null;
    return item.map as unknown as MapWithUser;
  };

  const { width: windowWidth } = useWindowDimensions();
  const thumbnailWidth = Math.round(windowWidth * 0.35);
  const thumbnailHeight = Math.round(thumbnailWidth * (5 / 4));
  const thumbnailCrop = collection?.thumbnail_crop as ThumbnailCrop | null;
  // グリッドカード幅: (画面幅 - 外側padding10×2 - カードpadding6×4) / 2列
  const gridCardWidth = Math.floor((windowWidth - 44) / 2);

  const renderHeader = useCallback(() => {
    if (!collection) return null;
    return (
      <View className="bg-surface mb-3" style={{ marginHorizontal: -10 }}>
        {/* 上半分の背景 */}
        <View
          className="absolute top-0 left-0 right-0 bg-surface-variant"
          style={{ height: 64 + thumbnailHeight * 0.75 }}
        />

        <View className="items-center pt-16 pb-6 px-4">
          {/* 4:5 サムネイル（中央配置） */}
          {collection.thumbnail_url ? (
            thumbnailCrop ? (
              <CroppedThumbnail
                url={collection.thumbnail_url}
                crop={thumbnailCrop}
                width={thumbnailWidth}
                borderRadius={0}
                aspectRatio={4 / 5}
              />
            ) : (
              <Image
                source={{
                  uri:
                    getOptimizedImageUrl(
                      collection.thumbnail_url,
                      IMAGE_PRESETS.collectionThumbnail
                    ) || collection.thumbnail_url,
                }}
                style={{
                  width: thumbnailWidth,
                  height: thumbnailHeight,
                }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            )
          ) : (
            <View
              className="items-center justify-center bg-outline-variant"
              style={{
                width: thumbnailWidth,
                height: thumbnailHeight,
              }}
            >
              <Ionicons
                name="grid"
                size={iconSizeNum['3xl']}
                className="text-on-surface-variant"
              />
            </View>
          )}

          {/* タイトル */}
          <Text className="text-xl font-bold text-on-surface mt-8 text-center">
            {collection.name}
          </Text>

          {/* 非公開表示 */}
          {!collection.is_public && (
            <View className="flex-row items-center gap-1 mt-2">
              <Ionicons
                name="lock-closed"
                size={iconSizeNum.xs}
                className="text-on-surface-variant"
              />
              <Text className="text-sm text-on-surface-variant">
                {t('collection.private')}
              </Text>
            </View>
          )}

          {/* 説明 */}
          {collection.description && (
            <Text className="text-sm text-on-surface-variant mt-3 text-center">
              {collection.description}
            </Text>
          )}

          {/* 作成者情報 */}
          {collection.user && (
            <Pressable
              onPress={() => handleUserPress(collection.user_id)}
              className="flex-row items-center mt-4"
            >
              {collection.user.avatar_url ? (
                <Image
                  source={{
                    uri:
                      getOptimizedImageUrl(
                        collection.user.avatar_url,
                        IMAGE_PRESETS.avatar
                      ) || collection.user.avatar_url,
                  }}
                  style={{
                    width: avatarSizeNum.md,
                    height: avatarSizeNum.md,
                    borderRadius: avatarSizeNum.md / 2,
                    marginRight: 8,
                  }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
                  <Ionicons
                    name="person"
                    size={iconSizeNum.sm}
                    className="text-gray-400"
                  />
                </View>
              )}
              <Text className="text-sm text-on-surface-variant">
                {collection.user.display_name ||
                  collection.user.username ||
                  t('collection.anonymous')}
              </Text>
            </Pressable>
          )}

          {/* いいねボタン */}
          <View className="mt-4">
            <CollectionLikeButton
              collectionId={collectionId}
              currentUserId={currentUserId}
              likesCount={collection.likes_count ?? 0}
              isLiked={collection.is_liked ?? false}
              size={iconSizeNum.lg}
              onCountPress={() => setIsLikersModalVisible(true)}
            />
          </View>
        </View>
      </View>
    );
  }, [
    collection,
    handleUserPress,
    thumbnailWidth,
    thumbnailHeight,
    thumbnailCrop,
  ]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.collection')} />
        <Loading message={t('common.loading')} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.collection')} />
        <ErrorView error={error} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader
        title={t('collection.collection')}
        rightComponent={
          menuItems.length > 0 ? (
            <PopupMenu
              items={menuItems}
              triggerSize={iconSizeNum.lg}
              respectSafeArea
            />
          ) : undefined
        }
      />

      <FlashList
        data={collectionMaps}
        numColumns={2}
        keyExtractor={(item: CollectionMapWithDetails) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }: { item: CollectionMapWithDetails }) => {
          const map = toMapWithUser(item);
          if (!map) return null;
          return (
            <View style={{ flex: 1, paddingHorizontal: 6, paddingBottom: 16 }}>
              <MapDisplayCard
                map={map}
                size="small"
                width={gridCardWidth}
                onPress={() => handleArticlePress(map.id)}
                onMapPress={() => handleMapPress(map.id)}
                onUserPress={() => handleUserPress(map.user_id)}
              />
            </View>
          );
        }}
        estimatedItemSize={250}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 16 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Ionicons
              name="map-outline"
              size={iconSizeNum['3xl']}
              className="text-gray-300"
            />
            <Text className="text-on-surface-variant mt-4">
              {t('collection.noMaps')}
            </Text>
          </View>
        }
      />

      <LikersModal
        visible={isLikersModalVisible}
        collectionId={collectionId}
        onClose={() => setIsLikersModalVisible(false)}
        onUserPress={(userId) => {
          setIsLikersModalVisible(false);
          handleUserPress(userId);
        }}
      />
    </View>
  );
}
