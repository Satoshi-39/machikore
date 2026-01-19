/**
 * 検索フィルター状態管理hook
 *
 * Zustandストアをラップし、派生データ（prefectures, cities, spotFilters, mapFilters等）を提供
 * - draftFilters: モーダルで編集中のフィルター
 * - appliedFilters: 適用済みのフィルター（検索に使用）
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getCitiesByPrefectureId } from '@/shared/api/supabase';
import { getPrefecturesByCountryId } from '@/shared/api/sqlite';
import type { SpotSearchFilters, MapSearchFilters, DateRange, SortBy } from '@/shared/api/supabase';
import type { CityRow, PrefectureRow } from '@/shared/types/database.types';
import { useSearchFiltersStore } from './store';
import type { SearchFilters } from './types';

interface UseSearchFiltersReturn {
  /** 編集中のフィルター状態（モーダル用） */
  draftFilters: SearchFilters;
  /** 適用済みのフィルター状態（検索用） */
  appliedFilters: SearchFilters;
  /** 国を選択（draft更新） */
  setCountry: (id: string | null, name: string | null) => void;
  /** 都道府県を選択（draft更新） */
  setPrefecture: (id: string | null, name: string | null) => void;
  /** 市区町村を選択（draft更新） */
  setCity: (id: string | null, name: string | null) => void;
  /** 期間を選択（draft更新） */
  setDateRange: (dateRange: DateRange) => void;
  /** 並び替えを選択（draft更新） */
  setSortBy: (sortBy: SortBy) => void;
  /** 編集中フィルターをリセット */
  resetDraftFilters: () => void;
  /** フィルターを適用（draft → applied） */
  applyFilters: () => void;
  /** モーダルを開く時に適用済みをdraftにコピー */
  initDraftFromApplied: () => void;
  /** 選択中の国の都道府県一覧（draft基準） */
  prefectures: PrefectureRow[];
  /** 都道府県ロード中 */
  prefecturesLoading: boolean;
  /** 選択中の都道府県の市区町村一覧（draft基準） */
  cities: CityRow[];
  /** 市区町村ロード中 */
  citiesLoading: boolean;
  /** 適用済みフィルターが有効かどうか */
  hasActiveFilters: boolean;
  /** スポット検索用フィルター（適用済み基準） */
  spotFilters: SpotSearchFilters;
  /** マップ検索用フィルター（適用済み基準） */
  mapFilters: MapSearchFilters;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const {
    draftFilters,
    appliedFilters,
    setCountry,
    setPrefecture,
    setCity,
    setDateRange,
    setSortBy,
    resetDraftFilters,
    applyFilters,
    initDraftFromApplied,
  } = useSearchFiltersStore();

  // 国選択時に都道府県を取得（draftFilters基準）
  const { data: prefectures = [], isLoading: prefecturesLoading } = useQuery<PrefectureRow[], Error>({
    queryKey: ['prefectures', 'country', draftFilters.countryId],
    queryFn: () => getPrefecturesByCountryId(draftFilters.countryId!),
    enabled: !!draftFilters.countryId,
    staleTime: Infinity,
  });

  // 都道府県選択時に市区町村を取得（draftFilters基準）
  const { data: cities = [], isLoading: citiesLoading } = useQuery<CityRow[], Error>({
    queryKey: [...QUERY_KEYS.citiesList(), 'prefecture', draftFilters.prefectureId],
    queryFn: () => getCitiesByPrefectureId(draftFilters.prefectureId!),
    enabled: !!draftFilters.prefectureId,
  });

  // 適用済みフィルターが有効かどうか
  const hasActiveFilters = useMemo(() => {
    return !!(
      appliedFilters.countryId ||
      appliedFilters.prefectureId ||
      appliedFilters.cityId ||
      appliedFilters.dateRange !== 'all'
    );
  }, [appliedFilters.countryId, appliedFilters.prefectureId, appliedFilters.cityId, appliedFilters.dateRange]);

  // スポット検索用フィルター（適用済み基準）
  const spotFilters: SpotSearchFilters = useMemo(() => ({
    prefectureId: appliedFilters.prefectureId,
    cityId: appliedFilters.cityId,
    dateRange: appliedFilters.dateRange,
    sortBy: appliedFilters.sortBy,
  }), [appliedFilters.prefectureId, appliedFilters.cityId, appliedFilters.dateRange, appliedFilters.sortBy]);

  // マップ検索用フィルター（適用済み基準）
  const mapFilters: MapSearchFilters = useMemo(() => ({
    dateRange: appliedFilters.dateRange,
    sortBy: appliedFilters.sortBy,
    // 都道府県名でテキスト検索
    regionText: appliedFilters.prefectureName || undefined,
  }), [appliedFilters.dateRange, appliedFilters.sortBy, appliedFilters.prefectureName]);

  return {
    draftFilters,
    appliedFilters,
    setCountry,
    setPrefecture,
    setCity,
    setDateRange,
    setSortBy,
    resetDraftFilters,
    applyFilters,
    initDraftFromApplied,
    prefectures,
    prefecturesLoading,
    cities,
    citiesLoading,
    hasActiveFilters,
    spotFilters,
    mapFilters,
  };
}
