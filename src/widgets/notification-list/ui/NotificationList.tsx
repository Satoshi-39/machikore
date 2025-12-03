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
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/shared/config';
import { useUserStore } from '@/entities/user';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/entities/notification';
import type { NotificationWithDetails, NotificationType } from '@/shared/api/supabase/notifications';

// 通知タイプごとのアイコンと色
const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
  like_spot: { icon: 'heart', color: '#EF4444', label: 'いいね' },
  like_map: { icon: 'heart', color: '#EF4444', label: 'いいね' },
  comment_spot: { icon: 'chatbubble', color: '#3B82F6', label: 'コメント' },
  comment_map: { icon: 'chatbubble', color: '#3B82F6', label: 'コメント' },
  follow: { icon: 'person-add', color: '#8B5CF6', label: 'フォロー' },
  system: { icon: 'megaphone', color: '#F59E0B', label: 'お知らせ' },
};

// 相対時間表示
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });
}

// 通知メッセージを生成
function getNotificationMessage(notification: NotificationWithDetails): string {
  const actorName = notification.actor?.display_name || notification.actor?.username || '誰か';
  const spotName =
    notification.spot?.custom_name ||
    notification.spot?.master_spot?.name ||
    'スポット';
  const mapName = notification.map?.name || 'マップ';

  switch (notification.type) {
    case 'like_spot':
      return `${actorName}さんがあなたのスポット「${spotName}」にいいねしました`;
    case 'like_map':
      return `${actorName}さんがあなたのマップ「${mapName}」にいいねしました`;
    case 'comment_spot':
      return `${actorName}さんがあなたのスポット「${spotName}」にコメントしました`;
    case 'comment_map':
      return `${actorName}さんがあなたのマップ「${mapName}」にコメントしました`;
    case 'follow':
      return `${actorName}さんがあなたをフォローしました`;
    case 'system':
      return notification.content || 'システムからのお知らせ';
    default:
      return '新しい通知があります';
  }
}

interface NotificationItemProps {
  notification: NotificationWithDetails;
  onAvatarPress: () => void;
  onContentPress: () => void;
}

function NotificationItem({ notification, onAvatarPress, onContentPress }: NotificationItemProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type];
  const message = getNotificationMessage(notification);

  return (
    <View
      className={`flex-row p-4 border-b border-border-light dark:border-dark-border-light ${
        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-surface dark:bg-dark-surface'
      }`}
    >
      {/* アイコンまたはアバター（タップでユーザープロフィールへ） */}
      <Pressable onPress={onAvatarPress} className="mr-3">
        {notification.actor?.avatar_url ? (
          <View className="relative">
            <Image
              source={{ uri: notification.actor.avatar_url }}
              className="w-12 h-12 rounded-full"
            />
            {/* 通知タイプのバッジ */}
            <View
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: config.color }}
            >
              <Ionicons name={config.icon} size={12} color="white" />
            </View>
          </View>
        ) : (
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: config.color }}
          >
            <Ionicons name={config.icon} size={24} color="white" />
          </View>
        )}
      </Pressable>

      {/* 通知内容（タップでスポット/マップ詳細へ） */}
      <Pressable onPress={onContentPress} className="flex-1">
        <Text
          className={`text-sm ${
            !notification.is_read ? 'font-semibold text-foreground dark:text-dark-foreground' : 'text-foreground-secondary dark:text-dark-foreground-secondary'
          }`}
          numberOfLines={2}
        >
          {message}
        </Text>

        {/* コメント内容（あれば） */}
        {notification.comment?.content && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1" numberOfLines={1}>
            「{notification.comment.content}」
          </Text>
        )}

        {/* 時間 */}
        <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mt-1">
          {getRelativeTime(notification.created_at)}
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
      } else if (notification.spot_id) {
        router.push(`/(tabs)/notifications/spots/${notification.spot_id}`);
      } else if (notification.map_id) {
        router.push(`/(tabs)/notifications/maps/${notification.map_id}`);
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
      <View className="flex-1 items-center justify-center bg-surface dark:bg-dark-surface">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-surface dark:bg-dark-surface">
        <Ionicons name="notifications-outline" size={80} color="#D1D5DB" />
        <Text className="text-lg font-medium text-foreground-secondary dark:text-dark-foreground-secondary mt-6">
          通知はありません
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* 全て既読ボタン */}
      {hasUnread && (
        <View className="px-4 py-2 border-b border-border-light dark:border-dark-border-light">
          <Pressable onPress={handleMarkAllAsRead}>
            <Text className="text-sm text-blue-500 font-medium text-right">
              すべて既読にする
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
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary.DEFAULT]}
          />
        }
      />
    </View>
  );
}
