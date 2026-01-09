/**
 * 投稿後トリガーのグローバル状態管理
 *
 * 画面遷移後もモーダルを表示し続けるため、Zustandストアで状態を管理
 */

import { create } from 'zustand';

interface PostTriggerState {
  /** プッシュ通知の事前説明モーダルを表示中か */
  isPushPromptVisible: boolean;
  /** プッシュ通知モーダルを表示 */
  showPushPrompt: () => void;
  /** プッシュ通知モーダルを非表示 */
  hidePushPrompt: () => void;
}

export const usePostTriggerStore = create<PostTriggerState>((set) => ({
  isPushPromptVisible: false,
  showPushPrompt: () => set({ isPushPromptVisible: true }),
  hidePushPrompt: () => set({ isPushPromptVisible: false }),
}));
