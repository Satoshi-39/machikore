/**
 * デフォルトマップ上のカード選択状態を管理するフック
 */

import { useState, useCallback } from 'react';
import type { MachiRow, CityRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

interface UseSelectDefaultMapCardOptions {
  /** 検索バーを表示する */
  showSearchBar: () => void;
  /** 閉じる処理完了時のコールバック */
  onCloseComplete: () => void;
}

interface UseSelectDefaultMapCardReturn {
  /** 選択された街 */
  selectedMachi: MachiRow | null;
  /** 選択された市区 */
  selectedCity: CityRow | null;
  /** 選択されたスポット */
  selectedSpot: MasterSpotDisplay | null;
  /** 街を選択/解除 */
  handleMachiSelect: (machi: MachiRow | null) => void;
  /** 市区を選択/解除 */
  handleCitySelect: (city: CityRow | null) => void;
  /** スポットを選択/解除 */
  handleSpotSelect: (spot: MasterSpotDisplay | null) => void;
  /** すべての選択を解除 */
  clearAllSelections: () => void;
  /** カードが存在するかどうか */
  hasCard: boolean;
}

/**
 * デフォルトマップ上のカード選択状態（街、市区、スポット）を管理するフック
 * - 一度に一つの要素のみ選択可能
 * - 選択解除時に検索バーを表示
 */
export function useSelectDefaultMapCard({
  showSearchBar,
  onCloseComplete,
}: UseSelectDefaultMapCardOptions): UseSelectDefaultMapCardReturn {
  const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityRow | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<MasterSpotDisplay | null>(null);

  // 街を選択/解除
  const handleMachiSelect = useCallback((machi: MachiRow | null) => {
    if (!machi) {
      // 閉じる処理完了
      onCloseComplete();
      showSearchBar();
    } else {
      setSelectedCity(null);
      setSelectedSpot(null);
    }
    setSelectedMachi(machi);
  }, [showSearchBar, onCloseComplete]);

  // 市区を選択/解除
  const handleCitySelect = useCallback((city: CityRow | null) => {
    if (!city) {
      onCloseComplete();
      showSearchBar();
    } else {
      setSelectedMachi(null);
      setSelectedSpot(null);
    }
    setSelectedCity(city);
  }, [showSearchBar, onCloseComplete]);

  // スポットを選択/解除
  const handleSpotSelect = useCallback((spot: MasterSpotDisplay | null) => {
    if (!spot) {
      onCloseComplete();
      showSearchBar();
    } else {
      setSelectedMachi(null);
      setSelectedCity(null);
    }
    setSelectedSpot(spot);
  }, [showSearchBar, onCloseComplete]);

  // すべての選択を解除
  const clearAllSelections = useCallback(() => {
    setSelectedMachi(null);
    setSelectedCity(null);
    setSelectedSpot(null);
  }, []);

  // カードが存在するかどうか
  const hasCard = !!(selectedMachi || selectedCity || selectedSpot);

  return {
    selectedMachi,
    selectedCity,
    selectedSpot,
    handleMachiSelect,
    handleCitySelect,
    handleSpotSelect,
    clearAllSelections,
    hasCard,
  };
}
