/**
 * Map選択状態管理
 *
 * デフォルトマップ（machi）とカスタムマップ（user maps）の切り替えを管理
 */

import { create } from 'zustand';

export type SourceTab = 'home' | 'discover' | 'mypage' | 'notifications';

export type PendingMapAction = {
  type: 'openSearch' | 'openPinDrop';
  mapId: string;
} | null;

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
   * モーダルdismiss後にマップページで実行するアクション
   * useFocusEffectで画面フォーカス時に処理される
   */
  pendingMapAction: PendingMapAction;

  /**
   * マップを選択
   */
  setSelectedMapId: (id: string | null) => void;

  /**
   * 元タブを設定
   */
  setSourceTab: (tab: SourceTab | null) => void;

  /**
   * 保留中のマップアクションを設定
   */
  setPendingMapAction: (action: PendingMapAction) => void;

  /**
   * デフォルトマップに戻る
   */
  resetToDefault: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedMapId: null,
  sourceTab: null,
  pendingMapAction: null,
  setSelectedMapId: (id) => set({ selectedMapId: id }),
  setSourceTab: (tab) => set({ sourceTab: tab }),
  setPendingMapAction: (action) => set({ pendingMapAction: action }),
  resetToDefault: () => set({ selectedMapId: null }),
}));
