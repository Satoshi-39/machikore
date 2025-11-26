/**
 * 選択された場所データを一時的に保持するstore
 *
 * 検索結果 → スポット作成画面への遷移時にデータを渡すために使用
 * Google Places検索結果 と 手動登録（現在地/ピン刺し）の両方に対応
 */

import { create } from 'zustand';
import type { SpotLocationInput } from './types';

interface SelectedPlaceStore {
  selectedPlace: SpotLocationInput | null;
  setSelectedPlace: (place: SpotLocationInput | null) => void;
  clearSelectedPlace: () => void;
  // 登録したスポットへのジャンプ用
  jumpToSpotId: string | null;
  setJumpToSpotId: (spotId: string | null) => void;
}

export const useSelectedPlaceStore = create<SelectedPlaceStore>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  clearSelectedPlace: () => set({ selectedPlace: null }),
  jumpToSpotId: null,
  setJumpToSpotId: (spotId) => set({ jumpToSpotId: spotId }),
}));
