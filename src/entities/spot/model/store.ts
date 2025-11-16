/**
 * スポットに関する状態管理
 */

import { create } from 'zustand';

/**
 * スポットのソート順
 */
export type SpotSortOrder = 'latest' | 'oldest' | 'popular' | 'order';

/**
 * スポットのフィルターモード
 */
export type SpotFilterMode = 'all' | 'my-spots';

interface SpotStore {
  /** ソート順 */
  sortOrder: SpotSortOrder;
  /** フィルターモード */
  filterMode: SpotFilterMode;
  /** 選択中のスポットID（詳細表示用） */
  selectedSpotId: string | null;

  /** ソート順を変更 */
  setSortOrder: (order: SpotSortOrder) => void;
  /** フィルターモードを変更 */
  setFilterMode: (mode: SpotFilterMode) => void;
  /** スポットを選択 */
  selectSpot: (spotId: string | null) => void;
  /** ストアをリセット */
  reset: () => void;
}

const initialState = {
  sortOrder: 'order' as SpotSortOrder,
  filterMode: 'all' as SpotFilterMode,
  selectedSpotId: null,
};

export const useSpotStore = create<SpotStore>((set) => ({
  ...initialState,

  setSortOrder: (order) => set({ sortOrder: order }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  selectSpot: (spotId) => set({ selectedSpotId: spotId }),
  reset: () => set(initialState),
}));
