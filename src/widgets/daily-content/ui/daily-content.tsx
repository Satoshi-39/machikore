/**
 * DailyContent Widget
 *
 * 選択日の予定と投稿を表示
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MachiVisitInfo } from '@/features/machi';
import { useCurrentUserId } from '@/entities/user';
import type { ScheduleRow, PostRow } from '@/shared/types/database.types';

interface DailyContentProps {
  /** 表示する予定 */
  schedules: ScheduleRow[];
  /** 表示する投稿 */
  posts: PostRow[];
}

export function DailyContent({ schedules, posts }: DailyContentProps) {
  const currentUserId = useCurrentUserId();
  const hasData = schedules.length > 0 || posts.length > 0;

  return (
    <ScrollView className="flex-1">
      {/* 予定セクション */}
      {schedules.length > 0 && (
        <View className="mb-4">
          <View className="px-4 py-2 bg-white border-b border-gray-200">
            <Text className="text-sm font-semibold text-gray-700">予定</Text>
          </View>
          {schedules.map((schedule) => (
            <View key={schedule.id} className="bg-white border-b border-gray-200 px-4 py-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base font-semibold text-gray-900">{schedule.title}</Text>
                {schedule.is_completed === 1 && (
                  <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-xs text-green-800 font-medium">完了</Text>
                  </View>
                )}
              </View>
              {schedule.memo && (
                <Text className="text-sm text-gray-500 mt-1">{schedule.memo}</Text>
              )}

              {/* 訪問記録を表示 */}
              {schedule.machi_id && (
                <View className="mt-3">
                  <MachiVisitInfo userId={currentUserId} machiId={schedule.machi_id} />
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 投稿セクション */}
      {posts.length > 0 && (
        <View>
          <View className="px-4 py-2 bg-white border-b border-gray-200">
            <Text className="text-sm font-semibold text-gray-700">投稿</Text>
          </View>
          {posts.map((post) => (
            <View key={post.id} className="bg-white border-b border-gray-200 px-4 py-3">
              <Text className="text-base text-gray-900">{post.content}</Text>
              <Text className="text-xs text-gray-500 mt-2">
                {new Date(post.created_at).toLocaleString('ja-JP')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* データがない場合 */}
      {!hasData && (
        <View className="flex-1 items-center justify-center py-16">
          <Text className="text-4xl mb-2">📅</Text>
          <Text className="text-gray-500">この日の予定や投稿はありません</Text>
        </View>
      )}
    </ScrollView>
  );
}
