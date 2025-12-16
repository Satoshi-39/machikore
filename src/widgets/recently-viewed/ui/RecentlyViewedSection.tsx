/**
 * 最近見たマップセクションWidget
 *
 * 横スクロールで最近閲覧したマップを表示
 * ログイン時のみ表示
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { MapWithUser } from '@/shared/types';
import { colors, getThemeColorStroke, type UserMapThemeColor } from '@/shared/config';
import { getMapThemeColor, showLoginRequiredAlert, formatRelativeTime } from '@/shared/lib';
import { useIsDarkMode } from '@/shared/lib/providers';
import { MapThumbnail, LocationPinIcon, PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { useCurrentUserId } from '@/entities/user';
import { useRecentViewHistory } from '@/entities/view-history';
import { MapLikeButton } from '@/features/map-like';
import { MapBookmarkButton } from '@/features/map-bookmark';
import { LikersModal } from '@/features/view-likers';

interface RecentlyViewedCardProps {
  map: MapWithUser;
  onPress: () => void;
}

function RecentlyViewedCard({ map, onPress }: RecentlyViewedCardProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const [isLikersModalVisible, setIsLikersModalVisible] = useState(false);

  // 自分のマップかどうか
  const isOwner = currentUserId && map.user_id === currentUserId;

  // 記事ハンドラー
  const handleArticlePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      router.push(`/(tabs)/discover/articles/maps/${map.id}` as Href);
    },
    [router, map.id]
  );

  // 三点リーダメニュー
  const menuItems: PopupMenuItem[] = useMemo(() => {
    return [
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
  }, [currentUserId, router, map.id]);

  return (
    <Pressable
      onPress={onPress}
      style={{ width: 160 }}
      className="mr-3 active:opacity-80"
    >
      {/* サムネイル */}
      <View className="relative">
        <MapThumbnail
          url={map.thumbnail_url}
          width={160}
          height={100}
          borderRadius={12}
          defaultImagePadding={0.15}
        />
      </View>

      {/* マップ情報 */}
      <View className="mt-2">
        {/* マップ名 + スポット数 */}
        <View className="flex-row items-center">
          <Text
            className="text-sm font-semibold text-foreground dark:text-dark-foreground flex-shrink"
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
                  ? getThemeColorStroke(
                      map.theme_color as UserMapThemeColor,
                      isDarkMode
                    )
                  : undefined
              }
            />
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted ml-0.5">
              {map.spots_count}
            </Text>
          </View>
        </View>
        {/* ユーザー情報 */}
        {map.user && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(tabs)/discover/users/${map.user_id}` as Href);
            }}
            className="flex-row items-center mt-0.5"
          >
            {map.user.avatar_url ? (
              <Image
                source={{ uri: map.user.avatar_url }}
                className="w-4 h-4 rounded-full mr-1"
              />
            ) : (
              <View className="w-4 h-4 rounded-full bg-gray-200 items-center justify-center mr-1">
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
        {/* いいね、ブックマーク、閲覧日時、記事アイコン、三点リーダ */}
        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center gap-3">
            {/* いいね */}
            <MapLikeButton
              mapId={map.id}
              currentUserId={currentUserId}
              likesCount={map.likes_count}
              size={12}
              inactiveColor={
                isDarkMode
                  ? colors.dark.foregroundSecondary
                  : colors.light.foreground
              }
              onCountPress={() => setIsLikersModalVisible(true)}
            />
            {/* ブックマーク */}
            <MapBookmarkButton
              mapId={map.id}
              currentUserId={currentUserId}
              size={12}
              inactiveColor={
                isDarkMode
                  ? colors.dark.foregroundSecondary
                  : colors.light.foreground
              }
            />
            {/* 作成日時 */}
            <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
              {formatRelativeTime(map.created_at)}
            </Text>
          </View>
          {/* 記事アイコン + 三点リーダ */}
          <View className="flex-row items-center">
            {(isOwner || map.is_article_public) && (
              <Pressable onPress={handleArticlePress}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color={
                    isDarkMode
                      ? colors.dark.foregroundSecondary
                      : colors.text.secondary
                  }
                />
              </Pressable>
            )}
            <PopupMenu
              items={menuItems}
              triggerSize={14}
              triggerColor={colors.text.secondary}
            />
          </View>
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

export function RecentlyViewedSection() {
  const router = useRouter();
  const currentUserId = useCurrentUserId();
  const { data: viewHistory, isLoading, error } = useRecentViewHistory(currentUserId, 10);

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // 未ログインの場合は表示しない
  if (!currentUserId) {
    return null;
  }

  // データがない場合は表示しない
  if (!isLoading && (!viewHistory || viewHistory.length === 0)) {
    return null;
  }

  const handleTitlePress = useCallback(() => {
    router.push('/(tabs)/discover/view-history' as Href);
  }, [router]);

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <Pressable
        onPress={handleTitlePress}
        className="flex-row items-center justify-between px-4 mb-3"
      >
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          最近見たマップ
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted mr-1">すべて見る</Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </Pressable>

      {isLoading ? (
        <View className="h-32 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-32 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {viewHistory?.map((item) => (
            <RecentlyViewedCard
              key={item.id}
              map={item.map}
              onPress={() => handleMapPress(item.map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
