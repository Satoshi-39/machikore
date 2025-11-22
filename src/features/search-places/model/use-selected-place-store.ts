/**
 * 選択された場所データを一時的に保持するstore
 *
 * 検索結果 → スポット作成画面への遷移時にデータを渡すために使用
 */

import { create } from 'zustand';
import type { PlaceSearchResult } from '../api/types';

interface SelectedPlaceStore {
  selectedPlace: PlaceSearchResult | null;
  setSelectedPlace: (place: PlaceSearchResult | null) => void;
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
