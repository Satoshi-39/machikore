/**
 * 検索フィルター状態ストア（Zustand）
 *
 * SearchPageとFilterModalPageで状態を共有
 * - draftFilters: モーダルで編集中のフィルター
 * - appliedFilters: 適用済みのフィルター（検索に使用）
 */

import { create } from 'zustand';
import type { DateRange, SortBy } from '@/shared/api/supabase';
import { DEFAULT_SEARCH_FILTERS, type SearchFilters } from './types';

interface SearchFiltersState {
  /** 編集中のフィルター（モーダル内で使用） */
  draftFilters: SearchFilters;
  /** 適用済みのフィルター（検索に使用） */
  appliedFilters: SearchFilters;
  /** 編集中フィルターを更新 */
  setCountry: (id: string | null, name: string | null) => void;
  setPrefecture: (id: string | null, name: string | null) => void;
  setCity: (id: string | null, name: string | null) => void;
  setDateRange: (dateRange: DateRange) => void;
  setSortBy: (sortBy: SortBy) => void;
  /** 編集中フィルターをリセット */
  resetDraftFilters: () => void;
  /** 編集中フィルターを適用 */
  applyFilters: () => void;
  /** モーダルを開く時に適用済みフィルターをdraftにコピー */
  initDraftFromApplied: () => void;
}

export const useSearchFiltersStore = create<SearchFiltersState>((set) => ({
  draftFilters: DEFAULT_SEARCH_FILTERS,
  appliedFilters: DEFAULT_SEARCH_FILTERS,

  setCountry: (id, name) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        countryId: id,
        countryName: name,
        // 国が変わったら都道府県と市区町村をリセット
        prefectureId: null,
        prefectureName: null,
        cityId: null,
        cityName: null,
      },
    })),

  setPrefecture: (id, name) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        prefectureId: id,
        prefectureName: name,
        // 都道府県が変わったら市区町村をリセット
        cityId: null,
        cityName: null,
      },
    })),

  setCity: (id, name) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        cityId: id,
        cityName: name,
      },
    })),

  setDateRange: (dateRange) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        dateRange,
      },
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      draftFilters: {
        ...state.draftFilters,
        sortBy,
      },
    })),

  resetDraftFilters: () =>
    set({
      draftFilters: DEFAULT_SEARCH_FILTERS,
    }),

  applyFilters: () =>
    set((state) => ({
      appliedFilters: { ...state.draftFilters },
    })),

  initDraftFromApplied: () =>
    set((state) => ({
      draftFilters: { ...state.appliedFilters },
    })),
}));
