/**
 * Wikipedia要約を取得するフック
 */

import { useQuery } from '@tanstack/react-query';
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
    queryKey: ['wikipedia', 'city', cityName, prefectureName],
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
    queryKey: ['wikipedia', 'machi', machiName, cityName, prefectureName],
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
    queryKey: ['wikipedia', 'prefecture', prefectureName],
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
    queryKey: ['wikipedia', 'region', regionName],
    queryFn: () => getRegionWikipediaSummary(regionName!),
    enabled: !!regionName,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
