/**
 * Map選択状態管理
 *
 * デフォルトマップ（machi）とカスタムマップ（user maps）の切り替えを管理
 */

import { create } from 'zustand';

interface MapStore {
  /**
   * 選択中のマップID
   * null = デフォルトマップ（machiマスターデータ）
   * string = カスタムマップID
   */
  selectedMapId: string | null;

  /**
   * マップを選択
   */
  setSelectedMapId: (id: string | null) => void;

  /**
   * デフォルトマップに戻る
   */
  resetToDefault: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedMapId: null,
  setSelectedMapId: (id) => set({ selectedMapId: id }),
  resetToDefault: () => set({ selectedMapId: null }),
}));
