/**
 * お知らせリストWidget
 *
 * システムからのお知らせ一覧を表示
 */

import React from 'react';
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
import { useSystemAnnouncements } from '@/entities/notification';
import type { SystemAnnouncement } from '@/shared/api/supabase/notifications';

// お知らせタイプごとのアイコンと色
const ANNOUNCEMENT_TYPE_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  info: { icon: 'information-circle', color: '#3B82F6' },
  update: { icon: 'sparkles', color: '#8B5CF6' },
  maintenance: { icon: 'construct', color: '#F59E0B' },
  promotion: { icon: 'gift', color: '#EC4899' },
};

// 日時フォーマット
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface AnnouncementItemProps {
  announcement: SystemAnnouncement;
  onPress?: () => void;
}

function AnnouncementItem({ announcement, onPress }: AnnouncementItemProps) {
  const defaultConfig = { icon: 'information-circle' as const, color: '#3B82F6' };
  const config = ANNOUNCEMENT_TYPE_CONFIG[announcement.type] || defaultConfig;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-4 border-b border-gray-100"
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
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {announcement.title}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={3}>
            {announcement.content}
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            {formatDate(announcement.published_at)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function AnnouncementList() {
  const { data: announcements = [], isLoading, refetch, isRefetching } = useSystemAnnouncements();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (announcements.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="megaphone-outline" size={80} color="#D1D5DB" />
        <Text className="text-lg font-medium text-gray-500 mt-6">
          お知らせはありません
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AnnouncementItem announcement={item} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[colors.primary.DEFAULT]}
        />
      }
    />
  );
}
