/**
 * チュートリアル状態 Store (Zustand)
 *
 * コーチマーク（react-native-copilot）の表示管理
 * - hasSeenTutorial: 永続化（初回表示済みフラグ）
 * - shouldStartTutorial: 一時的（開始トリガー）
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface TutorialState {
  /** チュートリアル表示済みフラグ（永続化） */
  hasSeenTutorial: boolean;
  /** チュートリアル開始トリガー（一時的、永続化しない） */
  shouldStartTutorial: boolean;

  /** チュートリアル開始をリクエスト */
  requestStartTutorial: () => void;
  /** チュートリアル表示済みとしてマーク */
  markTutorialSeen: () => void;
  /** 開始トリガーをリセット */
  clearStartRequest: () => void;
  /** チュートリアルをリセット（再表示可能にする） */
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      shouldStartTutorial: false,

      requestStartTutorial: () => set({ shouldStartTutorial: true }),
      markTutorialSeen: () =>
        set({ hasSeenTutorial: true, shouldStartTutorial: false }),
      clearStartRequest: () => set({ shouldStartTutorial: false }),
      resetTutorial: () =>
        set({ hasSeenTutorial: false, shouldStartTutorial: false }),
    }),
    {
      name: STORAGE_KEYS.TUTORIAL,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenTutorial: state.hasSeenTutorial,
      }),
    }
  )
);
