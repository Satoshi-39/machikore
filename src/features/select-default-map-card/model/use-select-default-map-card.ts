/**
 * デフォルトマップ上のカード選択状態を管理するフック
 */

import { useState, useCallback } from 'react';
import type { MachiRow, CityRow, PrefectureRow, RegionRow, CountryRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

interface UseSelectDefaultMapCardOptions {
  /** 検索バーを表示する */
  showSearchBar: () => void;
  /** 閉じる処理完了時のコールバック */
  onCloseComplete: () => void;
  /** カードが開く時のコールバック（初回ちらつき防止用） */
  onCardOpen?: () => void;
}

interface UseSelectDefaultMapCardReturn {
  /** 選択された国 */
  selectedCountry: CountryRow | null;
  /** 選択された地方 */
  selectedRegion: RegionRow | null;
  /** 選択された都道府県 */
  selectedPrefecture: PrefectureRow | null;
  /** 選択された街 */
  selectedMachi: MachiRow | null;
  /** 選択された市区 */
  selectedCity: CityRow | null;
  /** 選択されたスポット */
  selectedSpot: MasterSpotDisplay | null;
  /** 国を選択/解除 */
  handleCountrySelect: (country: CountryRow | null) => void;
  /** 地方を選択/解除 */
  handleRegionSelect: (region: RegionRow | null) => void;
  /** 都道府県を選択/解除 */
  handlePrefectureSelect: (prefecture: PrefectureRow | null) => void;
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
 * デフォルトマップ上のカード選択状態（国、地方、都道府県、街、市区、スポット）を管理するフック
 * - 一度に一つの要素のみ選択可能
 * - 選択解除時に検索バーを表示
 */
export function useSelectDefaultMapCard({
  showSearchBar,
  onCloseComplete,
  onCardOpen,
}: UseSelectDefaultMapCardOptions): UseSelectDefaultMapCardReturn {
  const [selectedCountry, setSelectedCountry] = useState<CountryRow | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionRow | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<PrefectureRow | null>(null);
  const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityRow | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<MasterSpotDisplay | null>(null);

  // すべての選択をクリアするヘルパー
  const clearAll = useCallback(() => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedPrefecture(null);
    setSelectedMachi(null);
    setSelectedCity(null);
    setSelectedSpot(null);
  }, []);

  // 国を選択/解除
  const handleCountrySelect = useCallback((country: CountryRow | null) => {
    if (!country) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedCountry(country);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // 地方を選択/解除
  const handleRegionSelect = useCallback((region: RegionRow | null) => {
    if (!region) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedRegion(region);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // 都道府県を選択/解除
  const handlePrefectureSelect = useCallback((prefecture: PrefectureRow | null) => {
    if (!prefecture) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedPrefecture(prefecture);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // 街を選択/解除
  const handleMachiSelect = useCallback((machi: MachiRow | null) => {
    if (!machi) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedMachi(machi);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // 市区を選択/解除
  const handleCitySelect = useCallback((city: CityRow | null) => {
    if (!city) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedCity(city);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // スポットを選択/解除
  const handleSpotSelect = useCallback((spot: MasterSpotDisplay | null) => {
    if (!spot) {
      onCloseComplete();
      showSearchBar();
    } else {
      onCardOpen?.();
      clearAll();
    }
    setSelectedSpot(spot);
  }, [showSearchBar, onCloseComplete, onCardOpen, clearAll]);

  // すべての選択を解除
  const clearAllSelections = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // カードが存在するかどうか
  const hasCard = !!(selectedCountry || selectedRegion || selectedPrefecture || selectedMachi || selectedCity || selectedSpot);

  return {
    selectedCountry,
    selectedRegion,
    selectedPrefecture,
    selectedMachi,
    selectedCity,
    selectedSpot,
    handleCountrySelect,
    handleRegionSelect,
    handlePrefectureSelect,
    handleMachiSelect,
    handleCitySelect,
    handleSpotSelect,
    clearAllSelections,
    hasCard,
  };
}
