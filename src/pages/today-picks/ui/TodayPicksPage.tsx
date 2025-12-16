/**
 * 本日のピックアップ一覧ページ
 *
 * 本日のピックアップをリスト形式で表示（30件）
 */

import React, { useCallback, useState } from 'react';
import { View, FlatList, RefreshControl, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useTodayPicksMaps } from '@/entities/map';
import type { MapWithUser } from '@/shared/types';
import { PageHeader, AsyncBoundary, MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useSafeBack, useCurrentTab, formatRelativeTime, getMapThemeColor, showLoginRequiredAlert } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

interface MapCardProps {
  map: MapWithUser;
  onPress: () => void;
  onUserPress: () => void;
  onArticlePress: () => void;
}

function MapCard({ map, onPress, onUserPress, onArticlePress }: MapCardProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 三点リーダーメニュー
  const menuItems: PopupMenuItem[] = [
    {
      id: 'report',
      label: '報告する',
      icon: 'flag-outline',
      onPress: () => {
        if (!currentUserId) {
          showLoginRequiredAlert('報告');
          return;
        }
        router.push(`/report?targetType=map&targetId=${map.id}`);
      },
    },
  ];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
    >
      {/* サムネイル */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={80}
        height={80}
        borderRadius={8}
        defaultImagePadding={0.15}
      />

      {/* マップ情報 */}
      <View className="flex-1 ml-3">
        {/* 1行目: マップ名 + スポット数 | 記事アイコン + 三点リーダー */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Text
              className="text-base font-semibold text-foreground dark:text-dark-foreground flex-shrink"
              numberOfLines={1}
            >
              {map.name}
            </Text>
            <View className="flex-row items-center ml-1 flex-shrink-0">
              <LocationPinIcon
                size={12}
                color={getMapThemeColor(map.theme_color)}
                strokeColor={
                  map.theme_color
                    ? getThemeColorStroke(map.theme_color as UserMapThemeColor, isDarkMode)
                    : undefined
                }
              />
              <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
                {map.spots_count}
              </Text>
            </View>
          </View>
          {/* 記事アイコン + 三点リーダー（右上） */}
          <View className="flex-row items-center">
            {(isOwner || map.is_article_public) && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onArticlePress();
                }}
                className="flex-row items-center"
              >
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
                />
              </Pressable>
            )}
            <PopupMenu
              items={menuItems}
              triggerSize={16}
              triggerColor={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary}
            />
          </View>
        </View>

        {/* 2行目: ユーザー情報 */}
        {map.user && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onUserPress();
            }}
            className="flex-row items-center mt-1"
          >
            {map.user.avatar_url ? (
              <Image
                source={{ uri: map.user.avatar_url }}
                className="w-4 h-4 rounded-full mr-1"
              />
            ) : (
              <View className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-1">
                <Ionicons name="person" size={10} color={colors.gray[400]} />
              </View>
            )}
            <Text
              className="text-xs text-foreground-muted dark:text-dark-foreground-muted"
              numberOfLines={1}
            >
              {map.user.display_name || map.user.username}
            </Text>
          </Pressable>
        )}

        {/* 3行目: いいね・ブックマーク・作成日時 */}
        <View className="flex-row items-center mt-1.5 gap-3">
          {/* いいね */}
          <MapLikeButton
            mapId={map.id}
            currentUserId={currentUserId}
            likesCount={map.likes_count}
            size={14}
            inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
            onCountPress={() => setIsLikersModalVisible(true)}
          />
          {/* ブックマーク */}
          <MapBookmarkButton
            mapId={map.id}
            currentUserId={currentUserId}
            bookmarksCount={map.bookmarks_count}
            size={14}
            showCount
            inactiveColor={isDarkMode ? colors.dark.foregroundSecondary : colors.light.foreground}
          />
          {/* 作成日時 */}
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            {formatRelativeTime(map.created_at)}
          </Text>
        </View>
      </View>

      {/* いいねユーザー一覧モーダル */}
      <LikersModal
        visible={isLikersModalVisible}
        mapId={map.id}
        onClose={() => setIsLikersModalVisible(false)}
      />
    </Pressable>
  );
}

export function TodayPicksPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  const {
    data: maps,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useTodayPicksMaps(30, currentUserId);

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

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-dark-surface"
      edges={['top']}
    >
      <PageHeader title="本日のピックアップ" onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        emptyMessage="本日のピックアップはありません"
        emptyIonIcon="sparkles-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MapCard
                map={item}
                onPress={() => handleMapPress(item.id)}
                onUserPress={() => handleUserPress(item.user_id)}
                onArticlePress={() => handleArticlePress(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </AsyncBoundary>
    </SafeAreaView>
  );
}
