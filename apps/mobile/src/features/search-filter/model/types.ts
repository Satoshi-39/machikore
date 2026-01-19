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
export const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'all', label: 'すべての期間' },
  { value: 'day', label: '24時間以内' },
  { value: 'week', label: '1週間以内' },
  { value: 'month', label: '1ヶ月以内' },
];

/** 並び替えオプション */
export const SORT_BY_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'created_at', label: '新着順' },
  { value: 'likes_count', label: 'いいね順' },
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
