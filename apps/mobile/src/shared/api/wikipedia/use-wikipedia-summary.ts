/**
 * Wikipedia要約を取得するフック
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  getCityWikipediaSummary,
  getMachiWikipediaSummary,
  getPrefectureWikipediaSummary,
  getRegionWikipediaSummary,
} from './index';

/**
 * 市区町村のWikipedia要約を取得するフック
 */
export function useCityWikipediaSummary(cityName?: string, prefectureName?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.wikipediaCity(cityName || '', prefectureName || ''),
    queryFn: () => getCityWikipediaSummary(cityName!, prefectureName!),
    enabled: !!cityName && !!prefectureName,
    staleTime: 1000 * 60 * 60, // 1時間キャッシュ
    gcTime: 1000 * 60 * 60 * 24, // 24時間保持
  });
}

/**
 * 街のWikipedia要約を取得するフック
 */
export function useMachiWikipediaSummary(
  machiName?: string,
  cityName?: string,
  prefectureName?: string
) {
  return useQuery({
    queryKey: QUERY_KEYS.wikipediaMachi(machiName || '', cityName, prefectureName),
    queryFn: () => getMachiWikipediaSummary(machiName!, cityName, prefectureName),
    enabled: !!machiName,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * 都道府県のWikipedia要約を取得するフック
 */
export function usePrefectureWikipediaSummary(prefectureName?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.wikipediaPrefecture(prefectureName || ''),
    queryFn: () => getPrefectureWikipediaSummary(prefectureName!),
    enabled: !!prefectureName,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * 地方のWikipedia要約を取得するフック
 */
export function useRegionWikipediaSummary(regionName?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.wikipediaRegion(regionName || ''),
    queryFn: () => getRegionWikipediaSummary(regionName!),
    enabled: !!regionName,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
