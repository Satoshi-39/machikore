/**
 * 検索フィルター型定義
 */

import type { DateRange, SortBy } from '@/shared/api/supabase';

/** 検索フィルター状態 */
export interface SearchFilters {
  /** 国ID（国コード: jp, kr, cn...） */
  countryId: string | null;
  /** 国名（表示用） */
  countryName: string | null;
  /** 都道府県ID */
  prefectureId: string | null;
  /** 都道府県名（表示用） */
  prefectureName: string | null;
  /** 市区町村ID */
  cityId: string | null;
  /** 市区町村名（表示用） */
  cityName: string | null;
  /** 期間フィルター */
  dateRange: DateRange;
  /** 並び替え */
  sortBy: SortBy;
}

/** 期間フィルターオプション */
export const DATE_RANGE_OPTIONS: { value: DateRange; labelKey: string }[] = [
  { value: 'all', labelKey: 'filter.allPeriods' },
  { value: 'day', labelKey: 'filter.within24h' },
  { value: 'week', labelKey: 'filter.within1Week' },
  { value: 'month', labelKey: 'filter.within1Month' },
];

/** 並び替えオプション */
export const SORT_BY_OPTIONS: { value: SortBy; labelKey: string }[] = [
  { value: 'created_at', labelKey: 'filter.newest' },
  { value: 'likes_count', labelKey: 'filter.byLikes' },
];

/** デフォルトのフィルター状態 */
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  countryId: null,
  countryName: null,
  prefectureId: null,
  prefectureName: null,
  cityId: null,
  cityName: null,
  dateRange: 'all',
  sortBy: 'created_at',
};
