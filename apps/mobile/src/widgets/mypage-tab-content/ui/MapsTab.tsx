/**
 * マイページ マップタブ
 *
 * ユーザーが作成したカスタムマップの一覧を表示
 * コンパクトなカードレイアウト（サムネイル左、情報右）
 */

import React from 'react';
import { FlatList, Alert, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useUserMaps, useDeleteMap } from '@/entities/map';
import { EmptyState, ErrorView } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import { colors } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

interface MapsTabProps {
  /** 表示対象のユーザーID */
  userId: string | null;
  /** 現在ログイン中のユーザーID */
  currentUserId?: string | null;
  /** リストのヘッダーコンポーネント（プロフィール+タブフィルター） */
  ListHeaderComponent?: React.ReactElement;
  /** スクロールイベントコールバック */
  onScroll?: (event: any) => void;
}

export function MapsTab({ userId, currentUserId, ListHeaderComponent, onScroll }: MapsTabProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const { t } = useI18n();
  const { data: maps, isLoading, error } = useUserMaps(userId, { currentUserId });
  const { mutate: deleteMap } = useDeleteMap();

  // 自分のマップかどうか
  const isOwner = userId === currentUserId;

  const handleMapPress = (map: MapWithUser) => {
    router.push(`/(tabs)/${currentTab}/maps/${map.id}` as any);
  };

  const handleEdit = (mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  };

  const handleDelete = (mapId: string) => {
    Alert.alert(
      t('map.deleteMap'),
      t('mypage.deleteMapConfirmDetail'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteMap(mapId),
        },
      ]
    );
  };

  const handleArticlePress = (mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as any);
  };

  const handleUserPress = (targetUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${targetUserId}` as any);
  };

  // エラー状態（プロフィールは表示しつつエラーを表示）
  if (error) {
    return (
      <FlatList
        data={[]}
        keyExtractor={() => 'error'}
        renderItem={() => null}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<ErrorView error={error} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="bg-surface dark:bg-dark-surface"
        contentContainerClassName="flex-grow"
      />
    );
  }

  return (
    <FlatList
      data={maps ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MapListCard
          map={item}
          currentUserId={currentUserId}
          isOwner={isOwner}
          onPress={() => handleMapPress(item)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArticlePress={handleArticlePress}
          onUserPress={handleUserPress}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        isLoading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          </View>
        ) : (
          <EmptyState
            message={t('empty.noMapsYet')}
            ionIcon="map"
            variant="inline"
          />
        )
      }
      onScroll={onScroll}
      scrollEventThrottle={16}
      className="bg-surface dark:bg-dark-surface"
      contentContainerClassName="flex-grow"
    />
  );
}
