/**
 * 街フィルター Feature 型定義
 */

/**
 * 街フィルターの種類
 */
export type MachiFilter = 'nearby' | 'visited' | 'favorite' | 'recommended';

/**
 * 街フィルターボタンのProps
 */
export interface MachiFilterButtonsProps {
  selectedFilters?: MachiFilter[];
  onFilterToggle?: (filter: MachiFilter) => void;
}
