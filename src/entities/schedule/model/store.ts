/**
 * スケジュール状態管理ストア
 *
 * カレンダーで選択された日付を管理
 */

import { create } from 'zustand';

interface ScheduleStore {
  /** 選択中の日付 */
  selectedDate: Date;
  /** 日付を選択する */
  setSelectedDate: (date: Date) => void;
  /** 今日の日付にリセット */
  resetToToday: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetToToday: () => set({ selectedDate: new Date() }),
}));
