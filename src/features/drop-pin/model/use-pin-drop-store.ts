/**
 * ピン刺しモードの状態管理ストア
 */

import { create } from 'zustand';

interface PinLocation {
  latitude: number;
  longitude: number;
}

interface PinDropState {
  /** ピン刺しモードが有効かどうか */
  isActive: boolean;
  /** 落としたピンの位置 */
  droppedPin: PinLocation | null;
  /** ピン刺しモードを開始 */
  startPinDropMode: () => void;
  /** ピン刺しモードを終了 */
  endPinDropMode: () => void;
  /** ピンを落とす */
  dropPin: (location: PinLocation) => void;
  /** ピンをクリア */
  clearPin: () => void;
  /** すべてリセット */
  reset: () => void;
}

export const usePinDropStore = create<PinDropState>((set) => ({
  isActive: false,
  droppedPin: null,
  startPinDropMode: () => set({ isActive: true, droppedPin: null }),
  endPinDropMode: () => set({ isActive: false }),
  dropPin: (location) => set({ droppedPin: location }),
  clearPin: () => set({ droppedPin: null }),
  reset: () => set({ isActive: false, droppedPin: null }),
}));
