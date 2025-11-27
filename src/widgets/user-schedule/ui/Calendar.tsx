/**
 * カレンダー（user-schedule専用内部コンポーネント）
 *
 * 月表示カレンダーで日付選択とマーク表示
 */

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import {
  formatLocalDateKey,
  isSameDay,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '@/shared/lib';

interface CalendarProps {
  /** 日付選択時のコールバック */
  onDateSelect: (date: Date) => void;
  /** 選択中の日付 */
  selectedDate: Date;
  /** マークする日付のリスト（YYYY-MM-DD形式） */
  markedDates?: string[];
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function Calendar({ onDateSelect, selectedDate, markedDates = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);

  // 前月・次月への移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 日付選択
  const handleDateSelect = (day: number) => {
    const selected = new Date(year, month, day);
    onDateSelect(selected);
  };

  // マークされた日付かどうかを判定
  const isMarkedDate = (day: number): boolean => {
    const date = new Date(year, month, day);
    const dateKey = formatLocalDateKey(date);
    return markedDates.includes(dateKey);
  };

  // カレンダーのグリッドを生成
  const calendarDays: (number | null)[] = [];

  // 前月の空白
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View className="bg-white border-b border-gray-200">
      {/* ヘッダー: 年月と前月・次月ボタン */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Pressable onPress={goToPreviousMonth} className="p-2 active:opacity-50">
          <Ionicons name="chevron-back" size={24} color={colors.text.secondary} />
        </Pressable>

        <Text className="text-lg font-semibold text-gray-900">
          {year}年 {month + 1}月
        </Text>

        <Pressable onPress={goToNextMonth} className="p-2 active:opacity-50">
          <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
        </Pressable>
      </View>

      {/* 曜日ヘッダー */}
      <View className="flex-row px-2 py-2 bg-gray-50">
        {WEEKDAYS.map((weekday, index) => (
          <View key={weekday} className="flex-1 items-center">
            <Text
              className={`text-xs font-medium ${
                index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {weekday}
            </Text>
          </View>
        ))}
      </View>

      {/* 日付グリッド */}
      <View className="px-2 pb-2">
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) => {
            if (day === null) {
              // 空白セル
              return <View key={`empty-${index}`} className="w-[14.28%] aspect-square" />;
            }

            const date = new Date(year, month, day);
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);
            const hasMarker = isMarkedDate(day);
            const dayOfWeek = index % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <View key={day} className="w-[14.28%] aspect-square p-0.5">
                <Pressable
                  onPress={() => handleDateSelect(day)}
                  className={`flex-1 items-center justify-center rounded-lg active:opacity-50 ${
                    isSelected ? 'bg-blue-500' : isToday ? 'bg-blue-50 border border-blue-300' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-blue-600'
                        : isSunday
                        ? 'text-red-600'
                        : isSaturday
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {day}
                  </Text>
                  {hasMarker && !isSelected && (
                    <View className="absolute bottom-1">
                      <View className="w-1 h-1 rounded-full bg-blue-500" />
                    </View>
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
