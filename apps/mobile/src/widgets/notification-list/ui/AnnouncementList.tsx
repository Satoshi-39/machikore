/**
 * お知らせリストWidget
 *
 * システムからのお知らせ一覧を表示
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
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { formatLocalizedDate } from '@/shared/lib/utils';
import {
  useSystemAnnouncements,
  useReadAnnouncementIds,
  useMarkAnnouncementAsRead,
  useMarkAllAnnouncementsAsRead,
} from '@/entities/notification';
import { useUserStore } from '@/entities/user';
import type { SystemAnnouncement } from '@/shared/api/supabase/notifications';

// お知らせタイプごとのアイコンと色
const ANNOUNCEMENT_TYPE_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  info: { icon: 'information-circle', color: colors.info },
  update: { icon: 'sparkles', color: colors.action.follow },
  maintenance: { icon: 'construct', color: colors.action.system },
  promotion: { icon: 'gift', color: '#EC4899' },
};

interface AnnouncementItemProps {
  announcement: SystemAnnouncement;
  isRead: boolean;
  onPress?: () => void;
}

function AnnouncementItem({ announcement, isRead, onPress }: AnnouncementItemProps) {
  const defaultConfig = { icon: 'information-circle' as const, color: '#3B82F6' };
  const config = (announcement.type && ANNOUNCEMENT_TYPE_CONFIG[announcement.type]) || defaultConfig;

  return (
    <Pressable
      onPress={onPress}
      className={`p-4 border-b border-outline-variant ${!isRead ? 'bg-primary-container' : 'bg-surface'}`}
    >
      <View className="flex-row items-start">
        {/* アイコン */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>

        {/* 内容 */}
        <View className="flex-1">
          <Text
            className={`text-base mb-1 ${!isRead ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant'}`}
          >
            {announcement.title}
          </Text>
          <Text className="text-sm text-on-surface-variant" numberOfLines={3}>
            {announcement.content}
          </Text>
          {announcement.published_at && (
            <Text className="text-xs text-on-surface-variant mt-2">
              {formatLocalizedDate(new Date(announcement.published_at))}
            </Text>
          )}
        </View>

        {/* 未読インジケーター */}
        {!isRead && (
          <View className="w-2 h-2 rounded-full bg-blue-500 ml-2 self-center" />
        )}
      </View>
    </Pressable>
  );
}

export function AnnouncementList() {
  const { t } = useI18n();
  const user = useUserStore((state) => state.user);
  // ユーザー作成日以降のお知らせのみ取得（新規ユーザーに過去のお知らせを表示しない）
  const { data: announcements = [], isLoading, refetch, isRefetching } = useSystemAnnouncements(
    user?.created_at
  );
  const { data: readIds = new Set<string>() } = useReadAnnouncementIds(user?.id);
  const { mutate: markAsRead } = useMarkAnnouncementAsRead();
  const { mutate: markAllAsRead } = useMarkAllAnnouncementsAsRead();

  const handleAnnouncementPress = useCallback(
    (announcement: SystemAnnouncement) => {
      // 既読にする
      const isRead = readIds.has(announcement.id);
      if (!isRead && user?.id) {
        markAsRead({ userId: user.id, announcementId: announcement.id });
      }
    },
    [readIds, markAsRead, user?.id]
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (user?.id) {
      markAllAsRead({ userId: user.id });
    }
  }, [user?.id, markAllAsRead]);

  const hasUnread = announcements.some((a) => !readIds.has(a.id));

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (announcements.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-surface">
        <Ionicons name="megaphone-outline" size={80} color="#D1D5DB" />
        <Text className="text-lg font-medium text-on-surface-variant mt-6">
          {t('empty.noAnnouncements')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* 全て既読ボタン */}
      {hasUnread && (
        <View className="px-4 py-2 border-b border-outline-variant bg-surface">
          <Pressable onPress={handleMarkAllAsRead}>
            <Text className="text-sm text-blue-500 font-medium text-right">
              {t('notification.markAllRead')}
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnnouncementItem
            announcement={item}
            isRead={readIds.has(item.id)}
            onPress={() => handleAnnouncementPress(item)}
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
