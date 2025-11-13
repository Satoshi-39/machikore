/**
 * スケジュールページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from '@/shared/ui';
import { Calendar } from '@/widgets/calendar';
import { DailyContent } from '@/widgets/daily-content';
import { CreateScheduleModal } from '@/widgets/create-schedule';
import { useScheduleStore, useSchedules } from '@/entities/schedule';
import { usePosts } from '@/entities/post/api';
import { useCurrentUserId } from '@/entities/user';
import { formatLocalDateKey } from '@/shared/lib';
import { colors } from '@/shared/config';

export function SchedulePage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { selectedDate, setSelectedDate } = useScheduleStore();
  const currentUserId = useCurrentUserId();

  // データ取得
  const { data: schedules = [] } = useSchedules(currentUserId);
  const { data: posts = [] } = usePosts(currentUserId);

  // マーク表示用の日付リストを作成（ローカルタイムゾーン）
  const markedDates = useMemo(() => {
    const scheduleDates = schedules.map((s) =>
      formatLocalDateKey(new Date(s.scheduled_at))
    );
    const postDates = posts.map((p) =>
      formatLocalDateKey(new Date(p.created_at))
    );
    return [...new Set([...scheduleDates, ...postDates])]; // 重複削除
  }, [schedules, posts]);

  // 選択日付でフィルタリング（ローカルタイムゾーン）
  const filteredSchedules = useMemo(() => {
    const selectedDateKey = formatLocalDateKey(selectedDate);
    return schedules.filter((schedule) => {
      const scheduleDateKey = formatLocalDateKey(new Date(schedule.scheduled_at));
      return scheduleDateKey === selectedDateKey;
    });
  }, [schedules, selectedDate]);

  const filteredPosts = useMemo(() => {
    const selectedDateKey = formatLocalDateKey(selectedDate);
    return posts.filter((post) => {
      const postDateKey = formatLocalDateKey(new Date(post.created_at));
      return postDateKey === selectedDateKey;
    });
  }, [posts, selectedDate]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        {/* カレンダー */}
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
        />

        {/* 選択日付のデータ表示 */}
        <DailyContent
          schedules={filteredSchedules}
          posts={filteredPosts}
        />

        <FAB
          onPress={() => setIsModalVisible(true)}
          icon="calendar"
          color={colors.secondary.DEFAULT}
        />
      </View>

      <CreateScheduleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}
