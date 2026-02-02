/**
 * マイページ コレクションタブ
 *
 * ユーザーが作成したコレクションの一覧を表示
 */

import { useDeleteCollection, useUserCollections } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import type { Collection } from '@/shared/api/supabase/collections';
import { colors, borderRadiusNum, iconSizeNum } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { ErrorView, Loading, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

interface CollectionsTabProps {
  userId: string | null;
  /** リストのヘッダーコンポーネント（プロフィール+タブフィルター） */
  ListHeaderComponent?: React.ReactElement;
}

interface CollectionCardProps {
  collection: Collection;
  isOwner: boolean;
  onPress?: () => void;
  onEdit?: (collectionId: string) => void;
  onDelete?: (collectionId: string) => void;
}

function CollectionCard({
  collection,
  isOwner,
  onPress,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const { t } = useI18n();
  const createdDate = new Date(collection.created_at);
  const formattedDate = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;

  const menuItems: PopupMenuItem[] = useMemo(() => {
    if (!isOwner) return [];
    return [
      {
        id: 'edit',
        label: t('common.edit'),
        icon: 'create-outline',
        onPress: () => onEdit?.(collection.id),
      },
      {
        id: 'delete',
        label: t('common.delete'),
        icon: 'trash-outline',
        destructive: true,
        onPress: () => onDelete?.(collection.id),
      },
    ];
  }, [collection.id, isOwner, onEdit, onDelete, t]);

  return (
    <View className="bg-surface">
      <Pressable
        onPress={onPress}
        className="px-4 py-4"
      >
        <View className="flex-row items-start">
          {/* サムネイル or アイコン（4:5比率） */}
          {collection.thumbnail_url ? (
            <Image
              source={{ uri: getOptimizedImageUrl(collection.thumbnail_url, IMAGE_PRESETS.collectionThumbnailSmall) || collection.thumbnail_url }}
              style={{ width: 64, height: 80, marginRight: 12 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              className="items-center justify-center mr-3"
              style={{ width: 64, height: 80, backgroundColor: colors.primitive.gray[100] }}
            >
              <Ionicons
                name="grid"
                size={iconSizeNum.lg}
                className="text-primary"
              />
            </View>
          )}

          {/* コレクション情報 */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-on-surface mb-1">
              {collection.name}
            </Text>
            {collection.description && (
              <Text
                className="text-sm text-on-surface-variant mb-2"
                numberOfLines={2}
              >
                {collection.description}
              </Text>
            )}
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="map" size={iconSizeNum.xs} className="text-on-surface-variant" />
                <Text className="text-xs text-on-surface-variant">
                  {t('collection.mapsCount', { count: collection.maps_count })}
                </Text>
              </View>
              <Text className="text-xs text-on-surface-variant">
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* 公開/非公開アイコン + メニュー */}
          <View className="flex-row items-center">
            {!collection.is_public && (
              <View className={isOwner ? 'mr-2' : ''}>
                <Ionicons
                  name="lock-closed"
                  size={iconSizeNum.sm}
                  className="text-on-surface-variant"
                />
              </View>
            )}
            {isOwner && menuItems.length > 0 && (
              <PopupMenu items={menuItems} />
            )}
          </View>
        </View>
      </Pressable>
      {/* 下部ボーダー（両端に余白） */}
      <View className="mx-4 border-b-hairline border-outline-variant" />
    </View>
  );
}

export function CollectionsTab({
  userId,
  ListHeaderComponent,
}: CollectionsTabProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: collections, isLoading, error } = useUserCollections(userId);
  const { mutate: deleteCollection } = useDeleteCollection();

  // 自分のコレクションかどうか
  const isOwner = userId === currentUserId;

  const handleCollectionPress = useCallback(
    (collection: Collection) => {
      router.push(`/(tabs)/${currentTab}/collections/${collection.id}` as Href);
    },
    [router, currentTab]
  );

  const handleEdit = useCallback(
    (collectionId: string) => {
      router.push(`/edit-collection/${collectionId}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (collectionId: string) => {
      if (!userId) return;
      Alert.alert(t('collection.deleteTitle'), t('collection.deleteMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteCollection({ collectionId, userId }),
        },
      ]);
    },
    [userId, deleteCollection, t]
  );

  const renderEmptyState = useCallback(
    () => (
      <View className="items-center py-12">
        <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-4">
          <Ionicons name="grid" size={iconSizeNum['2xl']} className="text-on-surface-variant" />
        </View>
        <Text className="text-base font-semibold text-on-surface mb-2">
          {t('collection.emptyTitle')}
        </Text>
        <Text className="text-sm text-on-surface-variant text-center">
          {isOwner
            ? t('collection.emptyDescriptionOwner')
            : t('collection.emptyDescriptionOther')}
        </Text>
      </View>
    ),
    [isOwner, t]
  );

  // エラー状態（プロフィールは表示しつつエラーを表示）
  if (error) {
    return (
      <FlatList
        data={[]}
        keyExtractor={() => 'error'}
        renderItem={() => null}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<ErrorView error={error} />}
        className="bg-surface"
        contentContainerClassName="flex-grow"
      />
    );
  }

  return (
    <FlatList
      data={collections || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CollectionCard
          collection={item}
          isOwner={isOwner}
          onPress={() => handleCollectionPress(item)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      className="bg-surface"
      contentContainerClassName="flex-grow"
      ListEmptyComponent={isLoading ? <Loading variant="inline" /> : renderEmptyState}
    />
  );
}
