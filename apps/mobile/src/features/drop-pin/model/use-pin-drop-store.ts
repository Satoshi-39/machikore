/**
 * ピン刺しモードの状態管理ストア
 */

import { create } from 'zustand';
import type { PinDropState } from './types';

export const usePinDropStore = create<PinDropState>((set) => ({
  isActive: false,
  droppedPin: null,
  startPinDropMode: () => set({ isActive: true, droppedPin: null }),
  endPinDropMode: () => set({ isActive: false }),
  dropPin: (location) => set({ droppedPin: location }),
  clearPin: () => set({ droppedPin: null }),
  reset: () => set({ isActive: false, droppedPin: null }),
}));
