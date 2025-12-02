/**
 * マイページ コレクションタブ
 *
 * ユーザーが作成したコレクションの一覧を表示
 */

import React, { useMemo, useCallback } from 'react';
import { View, Text, Pressable, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { colors } from '@/shared/config';
import {
  useUserCollections,
  useDeleteCollection,
} from '@/entities/collection';
import { Loading, ErrorView, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import type { Collection } from '@/shared/api/supabase/collections';

interface CollectionsTabProps {
  userId: string | null;
}

interface CollectionCardProps {
  collection: Collection;
  onPress?: () => void;
  onEdit?: (collectionId: string) => void;
  onDelete?: (collectionId: string) => void;
}

function CollectionCard({ collection, onPress, onEdit, onDelete }: CollectionCardProps) {
  const createdDate = new Date(collection.created_at);
  const formattedDate = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;

  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit?.(collection.id),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: () => onDelete?.(collection.id),
    },
  ], [collection.id, onEdit, onDelete]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 bg-white border-b border-gray-100"
    >
      <View className="flex-row items-start">
        {/* サムネイル or アイコン */}
        {collection.thumbnail_url ? (
          <Image
            source={{ uri: collection.thumbnail_url }}
            className="w-16 h-16 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-16 h-16 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: collection.color || colors.gray[100] }}
          >
            <Ionicons name="library" size={24} color={collection.color ? '#fff' : colors.primary.DEFAULT} />
          </View>
        )}

        {/* コレクション情報 */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {collection.description}
            </Text>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="map" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">
                {collection.maps_count}マップ
              </Text>
            </View>
            <Text className="text-xs text-gray-400">
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* 公開/非公開アイコン + メニュー */}
        <View className="flex-row items-center">
          {!collection.is_public && (
            <View className="mr-2">
              <Ionicons name="lock-closed" size={16} color={colors.text.secondary} />
            </View>
          )}
          <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
        </View>
      </View>
    </Pressable>
  );
}

export function CollectionsTab({ userId }: CollectionsTabProps) {
  const router = useRouter();
  const segments = useSegments();
  const { data: collections, isLoading, error } = useUserCollections(userId);
  const { mutate: deleteCollection } = useDeleteCollection();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';
  const isInNotificationsTab = segments[0] === '(tabs)' && segments[1] === 'notifications';

  const handleCollectionPress = useCallback((collection: Collection) => {
    // コレクション詳細ページへ遷移
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/collections/${collection.id}` as any);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/collections/${collection.id}` as any);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/collections/${collection.id}` as any);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/collections/${collection.id}` as any);
    } else {
      router.push(`/(tabs)/mypage/collections/${collection.id}` as any);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  const handleEdit = useCallback((collectionId: string) => {
    router.push(`/edit-collection?id=${collectionId}` as any);
  }, [router]);

  const handleDelete = useCallback((collectionId: string) => {
    if (!userId) return;
    Alert.alert(
      'コレクションを削除',
      'このコレクションを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteCollection({ collectionId, userId }),
        },
      ]
    );
  }, [userId, deleteCollection]);

  const renderEmptyState = useCallback(() => (
    <View className="items-center py-12">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="library" size={40} color={colors.text.secondary} />
      </View>
      <Text className="text-base font-semibold text-gray-900 mb-2">
        コレクション
      </Text>
      <Text className="text-sm text-gray-500 text-center">
        マップをテーマ別にまとめましょう
      </Text>
    </View>
  ), []);

  // ローディング中
  if (isLoading) {
    return <Loading message="コレクションを読み込み中..." />;
  }

  // エラー
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <FlatList
      data={collections || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CollectionCard
          collection={item}
          onPress={() => handleCollectionPress(item)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      contentContainerClassName="bg-white flex-grow"
      ListEmptyComponent={renderEmptyState}
    />
  );
}
