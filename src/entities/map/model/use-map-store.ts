/**
 * Map選択状態管理
 *
 * デフォルトマップ（machi）とカスタムマップ（user maps）の切り替えを管理
 */

import { create } from 'zustand';

export type SourceTab = 'home' | 'discover' | 'mypage' | 'notifications';

interface MapStore {
  /**
   * 選択中のマップID
   * null = デフォルトマップ（machiマスターデータ）
   * string = カスタムマップID
   */
  selectedMapId: string | null;

  /**
   * スポット作成モーダルを開いた時の元タブ
   * スポット作成後に元のタブに戻るために使用
   */
  sourceTab: SourceTab | null;

  /**
   * マップを選択
   */
  setSelectedMapId: (id: string | null) => void;

  /**
   * 元タブを設定
   */
  setSourceTab: (tab: SourceTab | null) => void;

  /**
   * デフォルトマップに戻る
   */
  resetToDefault: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedMapId: null,
  sourceTab: null,
  setSelectedMapId: (id) => set({ selectedMapId: id }),
  setSourceTab: (tab) => set({ sourceTab: tab }),
  resetToDefault: () => set({ selectedMapId: null }),
}));
