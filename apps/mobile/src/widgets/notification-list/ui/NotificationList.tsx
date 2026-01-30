/**
 * 通知リストWidget
 *
 * ユーザーへの通知一覧を表示
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { UserAvatar } from '@/shared/ui';
import { useI18n, type SupportedLocale } from '@/shared/lib/i18n';
import { formatRelativeTime } from '@/shared/lib/utils';
import { useUserStore } from '@/entities/user';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/entities/notification';
import type { NotificationWithDetails, NotificationType } from '@/shared/api/supabase/notifications';

// 通知タイプごとのアイコンと色（colors.actionを使用）
const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; labelKey: string }
> = {
  like_spot: { icon: 'heart', color: colors.action["action-like"], labelKey: 'notification.like' },
  like_map: { icon: 'heart', color: colors.action["action-like"], labelKey: 'notification.like' },
  comment_spot: { icon: 'chatbubble', color: colors.action["action-comment"], labelKey: 'notification.comment' },
  comment_map: { icon: 'chatbubble', color: colors.action["action-comment"], labelKey: 'notification.comment' },
  follow: { icon: 'person-add', color: colors.action["action-follow"], labelKey: 'notification.follow' },
  system: { icon: 'megaphone', color: colors.light.info, labelKey: 'notification.system' },
};

// 通知メッセージを生成（i18n対応のためtranslate関数を受け取る）
function getNotificationMessage(
  notification: NotificationWithDetails,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const actorName = notification.actor?.display_name || notification.actor?.username || t('mypage.defaultUser');
  const spotName =
    notification.spot?.description ||
    notification.spot?.master_spot?.name ||
    t('spot.spotName');
  const mapName = notification.map?.name || t('map.mapName');

  switch (notification.type) {
    case 'like_spot':
      return t('notification.likedYourSpot', { name: actorName, target: spotName });
    case 'like_map':
      return t('notification.likedYourMap', { name: actorName, target: mapName });
    case 'comment_spot':
      return t('notification.commentedOnYourSpot', { name: actorName, target: spotName });
    case 'comment_map':
      return t('notification.commentedOnYourMap', { name: actorName, target: mapName });
    case 'follow':
      return t('notification.followedYou', { name: actorName });
    case 'system':
      return notification.content || t('notification.system');
    default:
      return t('notification.newNotification');
  }
}

interface NotificationItemProps {
  notification: NotificationWithDetails;
  onAvatarPress: () => void;
  onContentPress: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: SupportedLocale;
}

function NotificationItem({ notification, onAvatarPress, onContentPress, t, locale }: NotificationItemProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type];
  const message = getNotificationMessage(notification, t);

  return (
    <View
      className={`flex-row p-4 border-b-hairline border-outline-variant ${
        !notification.is_read ? 'bg-primary-container' : 'bg-surface'
      }`}
    >
      {/* アバター + 通知タイプバッジ（タップでユーザープロフィールへ） */}
      <Pressable onPress={onAvatarPress} className="mr-3">
        <View className="relative">
          <UserAvatar
            url={notification.actor?.avatar_url}
            alt={notification.actor?.display_name || notification.actor?.username || 'User'}
            className="w-12 h-12"
            iconSize={24}
          />
          {/* 通知タイプのバッジ */}
          <View
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: config.color }}
          >
            <Ionicons name={config.icon} size={iconSizeNum.xs} color="white" />
          </View>
        </View>
      </Pressable>

      {/* 通知内容（タップでスポット/マップ詳細へ） */}
      <Pressable onPress={onContentPress} className="flex-1">
        <Text
          className={`text-sm ${
            !notification.is_read ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
          }`}
          numberOfLines={2}
        >
          {message}
        </Text>

        {/* コメント内容（あれば） */}
        {notification.comment?.content && (
          <Text className="text-sm text-on-surface-variant mt-1" numberOfLines={1}>
            「{notification.comment.content}」
          </Text>
        )}

        {/* 時間 */}
        <Text className="text-xs text-on-surface-variant mt-1">
          {formatRelativeTime(notification.created_at, locale)}
        </Text>
      </Pressable>

      {/* 未読インジケーター */}
      {!notification.is_read && (
        <View className="w-2 h-2 rounded-full bg-blue-500 ml-2 self-center" />
      )}
    </View>
  );
}

export function NotificationList() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const user = useUserStore((state) => state.user);
  const { data: notifications = [], isLoading, refetch, isRefetching } = useNotifications(user?.id);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  // アバタータップ: いいねした人のプロフィールへ遷移
  const handleAvatarPress = useCallback(
    (notification: NotificationWithDetails) => {
      // 既読にする
      if (!notification.is_read && user?.id) {
        markAsRead({ notificationId: notification.id, userId: user.id });
      }

      // actorのプロフィールへ遷移
      if (notification.actor_id) {
        router.push(`/(tabs)/notifications/users/${notification.actor_id}`);
      }
    },
    [router, markAsRead, user?.id]
  );

  // コンテンツタップ: いいねされたスポット/マップへ遷移
  const handleContentPress = useCallback(
    (notification: NotificationWithDetails) => {
      // 既読にする
      if (!notification.is_read && user?.id) {
        markAsRead({ notificationId: notification.id, userId: user.id });
      }

      // 遷移先を決定（notificationsタブ内のスタックナビゲーション）
      // フォロー通知の場合はコンテンツタップでもユーザープロフィールへ
      if (notification.type === 'follow' && notification.actor_id) {
        router.push(`/(tabs)/notifications/users/${notification.actor_id}`);
      } else if (notification.user_spot_id) {
        router.push(`/(tabs)/notifications/articles/spots/${notification.user_spot_id}`);
      } else if (notification.map_id) {
        router.push(`/(tabs)/notifications/articles/maps/${notification.map_id}`);
      }
    },
    [router, markAsRead, user?.id]
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (user?.id) {
      markAllAsRead({ userId: user.id });
    }
  }, [user?.id, markAllAsRead]);

  const hasUnread = notifications.some((n) => !n.is_read);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-surface">
        <Ionicons name="notifications-outline" size={80} color={themeColors['outline-variant']} />
        <Text className="text-lg font-medium text-on-surface-variant mt-6">
          {t('empty.noNotifications')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* 全て既読ボタン */}
      {hasUnread && (
        <View className="px-4 py-2 border-b-hairline border-outline-variant">
          <Pressable onPress={handleMarkAllAsRead}>
            <Text className="text-sm text-blue-500 font-medium text-right">
              {t('notification.markAllRead')}
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onAvatarPress={() => handleAvatarPress(item)}
            onContentPress={() => handleContentPress(item)}
            t={t}
            locale={locale}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.light.primary]}
          />
        }
      />
    </View>
  );
}
