/**
 * ユーザースケジュールWidget
 *
 * ユーザーの訪問予定スケジュールを表示
 * カレンダーと予定リストを組み合わせた表示
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Calendar } from '@/widgets/calendar';

interface UserScheduleProps {
  userId: string | null;
}

export function UserSchedule({ userId }: UserScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // TODO: スケジュールデータの取得
  // const { data: schedules } = useUserSchedules(userId);
  // const markedDates = schedules?.map(s => formatDateKey(new Date(s.scheduled_at))) ?? [];

  // 現在はプレースホルダー実装のためuserIdは未使用
  // スケジュールAPI実装時に使用予定
  console.log('UserSchedule for userId:', userId);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* カレンダー */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        markedDates={[]} // TODO: スケジュールがある日付をマーク
      />

      {/* 選択日の予定リスト */}
      <View className="bg-white mt-2 px-4 py-4">
        <Text className="text-base font-semibold text-gray-900 mb-3">
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日の予定
        </Text>

        {/* プレースホルダー */}
        <View className="items-center py-8">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
            <Ionicons name="calendar-outline" size={32} color={colors.text.secondary} />
          </View>
          <Text className="text-sm text-gray-500 text-center">
            予定はありません
          </Text>
          <Text className="text-xs text-gray-400 text-center mt-2">
            スケジュール機能は今後実装予定です
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
