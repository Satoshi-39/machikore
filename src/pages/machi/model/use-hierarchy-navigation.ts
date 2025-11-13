/**
 * 階層ナビゲーション管理フック
 */

import { useState, useMemo } from 'react';

// 階層ナビゲーション状態
export interface HierarchyState {
  region?: string;
  prefectureId?: string;
  prefectureName?: string;
  cityId?: string;
  cityName?: string;
}

// 現在の階層レベル
export type HierarchyLevel = 'region' | 'prefecture' | 'city' | 'machi';

export function useHierarchyNavigation() {
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});

  // 階層ナビゲーションハンドラ
  const handleRegionPress = (region: string) => {
    setHierarchyState({ region });
  };

  const handlePrefecturePress = (prefectureId: string, prefectureName: string) => {
    setHierarchyState((prev) => ({ ...prev, prefectureId, prefectureName }));
  };

  const handleCityPress = (cityId: string, cityName: string) => {
    setHierarchyState((prev) => ({ ...prev, cityId, cityName }));
  };

  const handleBreadcrumbPress = (level: 'region' | 'prefecture' | 'city') => {
    if (level === 'region') {
      setHierarchyState({});
    } else if (level === 'prefecture') {
      setHierarchyState((prev) => ({
        region: prev.region,
      }));
    } else if (level === 'city') {
      setHierarchyState((prev) => ({
        region: prev.region,
        prefectureId: prev.prefectureId,
        prefectureName: prev.prefectureName,
      }));
    }
  };

  // 現在表示すべき階層を決定
  const currentLevel: HierarchyLevel = useMemo(() => {
    const { region, prefectureId, cityId } = hierarchyState;

    if (region && prefectureId && cityId) {
      return 'machi';
    } else if (region && prefectureId) {
      return 'city';
    } else if (region) {
      return 'prefecture';
    } else {
      return 'region';
    }
  }, [hierarchyState]);

  return {
    hierarchyState,
    currentLevel,
    handleRegionPress,
    handlePrefecturePress,
    handleCityPress,
    handleBreadcrumbPress,
  };
}
