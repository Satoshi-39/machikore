/**
 * マップフィルター Feature 型定義
 */

/**
 * マップフィルターの種類
 */
export type MapFilter = 'nearby' | 'visited' | 'favorite' | 'recommended';

/**
 * マップフィルターボタンのProps
 */
export interface MapFilterButtonsProps {
  selectedFilters?: MapFilter[];
  onFilterToggle?: (filter: MapFilter) => void;
}
