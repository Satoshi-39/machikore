/**
 * Machi階層データフック
 *
 * prefecture → city → machiの3階層構造を提供
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getAllPrefectures,
  getAllCities,
  getAllMachi,
  getAllRegions,
} from '@/shared/api/sqlite';
import type {
  RegionRow,
  PrefectureRow,
  CityRow,
  MachiRow,
} from '@/shared/types/database.types';

export interface MachiHierarchy {
  region: string;
  prefectures: PrefectureHierarchy[];
}

export interface PrefectureHierarchy {
  prefecture: PrefectureRow;
  cities: CityHierarchy[];
  totalMachiCount: number;
}

export interface CityHierarchy {
  city: CityRow;
  machis: MachiRow[];
}

/**
 * 地方→都道府県→市区町村→街の階層構造を取得
 */
export function useMachiHierarchy() {
  // 地方データ取得
  const {
    data: regions,
    isLoading: isRegionsLoading,
    error: regionsError,
  } = useQuery({
    queryKey: ['regions'],
    queryFn: () => getAllRegions(),
  });

  // 都道府県データ取得
  const {
    data: prefectures,
    isLoading: isPrefecturesLoading,
    error: prefecturesError,
  } = useQuery({
    queryKey: ['prefectures'],
    queryFn: () => getAllPrefectures(),
  });

  // 市区町村データ取得
  const {
    data: cities,
    isLoading: isCitiesLoading,
    error: citiesError,
  } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getAllCities(),
  });

  // 街データ取得
  const {
    data: machis,
    isLoading: isMachisLoading,
    error: machisError,
  } = useQuery({
    queryKey: ['machi'],
    queryFn: () => getAllMachi(),
  });

  // 階層構造を構築
  const hierarchy = useMemo(() => {
    if (!regions || !prefectures || !cities || !machis) return [];

    // 地方でグループ化
    const regionMap = new Map<string, PrefectureHierarchy[]>();

    prefectures.forEach((prefecture) => {
      // この都道府県に属する市区町村を取得
      const prefectureCities = cities.filter(
        (city) => city.prefecture_id === prefecture.id
      );

      // この都道府県に属する街を取得
      const prefectureMachis = machis.filter(
        (machi) => machi.prefecture_id === prefecture.id
      );

      // 市区町村ごとに街をグループ化
      const cityHierarchies: CityHierarchy[] = [];

      // 市区町村が登録されている街
      prefectureCities.forEach((city) => {
        const cityMachis = prefectureMachis.filter(
          (machi) => machi.city_id === city.id
        );
        if (cityMachis.length > 0) {
          cityHierarchies.push({
            city,
            machis: cityMachis,
          });
        }
      });

      // 市区町村が未登録の街（city_id = null）
      const unassignedMachis = prefectureMachis.filter(
        (machi) => machi.city_id === null
      );
      if (unassignedMachis.length > 0) {
        cityHierarchies.push({
          city: {
            id: 'unassigned',
            prefecture_id: prefecture.id,
            name: 'その他',
            name_kana: 'そのた',
            type: '',
            created_at: '',
            updated_at: '',
          },
          machis: unassignedMachis,
        });
      }

      // 都道府県階層を追加
      const prefectureHierarchy: PrefectureHierarchy = {
        prefecture,
        cities: cityHierarchies,
        totalMachiCount: prefectureMachis.length,
      };

      // 地方別にグループ化（region_idを使用）
      const regionId = prefecture.region_id;
      if (!regionId) return; // region_idがnullの場合はスキップ

      if (!regionMap.has(regionId)) {
        regionMap.set(regionId, []);
      }
      regionMap.get(regionId)!.push(prefectureHierarchy);
    });

    // 地方の配列に変換（IDから名前に変換）
    const result: MachiHierarchy[] = [];
    regionMap.forEach((prefectures, regionId) => {
      // region_idから地方名を取得
      const regionRow = regions.find((r) => r.id === regionId);
      const regionName = regionRow?.name || regionId; // 見つからない場合はIDを使用

      result.push({
        region: regionName,
        prefectures,
      });
    });

    // 地方を並び順でソート（北から南へ）
    const regionOrder = [
      '北海道',
      '東北',
      '関東',
      '中部',
      '近畿',
      '中国',
      '四国',
      '九州',
      '沖縄',
    ];
    result.sort((a, b) => {
      const indexA = regionOrder.indexOf(a.region);
      const indexB = regionOrder.indexOf(b.region);
      return indexA - indexB;
    });

    return result;
  }, [regions, prefectures, cities, machis]);

  const isLoading = isRegionsLoading || isPrefecturesLoading || isCitiesLoading || isMachisLoading;
  const error = regionsError || prefecturesError || citiesError || machisError;

  return {
    data: hierarchy,
    isLoading,
    error,
  };
}
