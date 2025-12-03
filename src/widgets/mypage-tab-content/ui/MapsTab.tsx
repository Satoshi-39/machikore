/**
 * マイページ マップタブ
 *
 * ユーザーが作成したカスタムマップの一覧を表示
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { colors } from '@/shared/config';
import { useUserMaps, useDeleteMap } from '@/entities/map';
import { AsyncBoundary, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

interface MapsTabProps {
  userId: string | null;
}

interface MapCardProps {
  map: MapWithUser;
  onPress?: () => void;
  onEdit?: (mapId: string) => void;
  onDelete?: (mapId: string) => void;
  onArticlePress?: (mapId: string) => void;
}

function MapCard({ map, onPress, onEdit, onDelete, onArticlePress }: MapCardProps) {
  const createdDate = new Date(map.created_at);
  const formattedDate = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;

  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'article',
      label: '記事を見る',
      icon: 'document-text-outline',
      onPress: () => onArticlePress?.(map.id),
    },
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit?.(map.id),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: () => onDelete?.(map.id),
    },
  ], [map.id, onEdit, onDelete, onArticlePress]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light"
    >
      <View className="flex-row items-start">
        {/* サムネイル or アイコン */}
        {map.thumbnail_url ? (
          <Image
            source={{ uri: map.thumbnail_url }}
            className="w-16 h-16 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-lg bg-muted dark:bg-dark-muted items-center justify-center mr-3">
            <Ionicons name="map" size={24} color={colors.primary.DEFAULT} />
          </View>
        )}

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-1">
            {map.name}
          </Text>
          {map.description && (
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2" numberOfLines={2}>
              {map.description}
            </Text>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {map.spots_count}スポット
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="heart" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                {map.likes_count}
              </Text>
            </View>
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* 公開/非公開アイコン + メニュー */}
        <View className="flex-row items-center">
          {!map.is_public && (
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

export function MapsTab({ userId }: MapsTabProps) {
  const router = useRouter();
  const segments = useSegments();
  const { data: maps, isLoading, error } = useUserMaps(userId);
  const { mutate: deleteMap } = useDeleteMap();

  // タブ内かどうかを判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';
  const isInNotificationsTab = segments[0] === '(tabs)' && segments[1] === 'notifications';

  const handleMapPress = (map: MapWithUser) => {
    // タブ内の場合は各タブ内のルートを使用
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${map.id}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/maps/${map.id}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${map.id}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/maps/${map.id}`);
    } else {
      router.push(`/maps/${map.id}`);
    }
  };

  const handleEdit = (mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  };

  const handleDelete = (mapId: string) => {
    Alert.alert(
      'マップを削除',
      'このマップを削除しますか？関連するスポットも全て削除されます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteMap(mapId),
        },
      ]
    );
  };

  const handleArticlePress = (mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/articles/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/articles/maps/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/articles/maps/${mapId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/articles/maps/${mapId}`);
    } else {
      router.push(`/(tabs)/mypage/articles/maps/${mapId}`);
    }
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps}
      loadingMessage="マップを読み込み中..."
      emptyMessage="まだマップを作成していません"
      emptyIonIcon="map"
    >
      {(data) => (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard
              map={item}
              onPress={() => handleMapPress(item)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArticlePress={handleArticlePress}
            />
          )}
          className="bg-surface dark:bg-dark-surface"
          contentContainerClassName="flex-grow"
        />
      )}
    </AsyncBoundary>
  );
}
