/**
 * マップ中心座標の地名を取得するフック
 *
 * ズームレベルに応じて街/市区/都道府県/国の名前を表示
 * - ズーム12以上: 街名
 * - ズーム10-12: 市区名
 * - ズーム5-10: 都道府県名
 * - ズーム5未満: 国名
 *
 * 距離しきい値を超えた場合は「範囲外」として空表示
 * （海の上などで誤った地名を表示しないため）
 */

import { useMemo } from 'react';
import type { CameraState } from './use-bounds-management';
import type { MachiRow, CityRow, PrefectureRow } from '@/shared/types/database.types';
import type { CountryData } from '@/shared/lib/utils/countries.utils';
import { MAP_ZOOM, MAP_DISTANCE_THRESHOLD } from '@/shared/config';

interface UseCenterLocationNameParams {
  cameraState: CameraState;
  machiData?: MachiRow[] | null;
  cities?: CityRow[];
  prefectures?: PrefectureRow[];
  countries?: CountryData[];
}

interface LocationInfo {
  name: string;
  type: 'machi' | 'city' | 'prefecture' | 'country' | 'earth' | 'unknown';
  /** 対応するエンティティ（街または市区） */
  entity?: MachiRow | CityRow | null;
}

/**
 * 2点間の距離を計算（簡易版、キロメートル単位）
 */
function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface NearestResult<T> {
  item: T;
  distance: number;
}

/**
 * 最も近いアイテムを見つける（距離も返す）
 */
function findNearest<T extends { latitude: number; longitude: number; name: string }>(
  items: T[],
  center: { latitude: number; longitude: number }
): NearestResult<T> | null {
  if (items.length === 0) return null;

  let nearest = items[0]!;
  let minDistance = getDistance(
    center.latitude,
    center.longitude,
    nearest.latitude,
    nearest.longitude
  );

  for (let i = 1; i < items.length; i++) {
    const item = items[i]!;
    const distance = getDistance(
      center.latitude,
      center.longitude,
      item.latitude,
      item.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = item;
    }
  }

  return { item: nearest, distance: minDistance };
}

export function useCenterLocationName({
  cameraState,
  machiData,
  cities = [],
  prefectures = [],
  countries = [],
}: UseCenterLocationNameParams): LocationInfo {
  return useMemo(() => {
    const { center, zoom } = cameraState;

    // ズームレベルに応じて表示する地名の種類を決定
    // CITY(11)より少し寄った12以上で街名を表示
    // タイルベースで取得しているので、現在のビューポート内のデータは常に有効
    if (zoom >= MAP_ZOOM.CITY + 1 && machiData && machiData.length > 0) {
      // 街名を表示
      const result = findNearest(machiData, center);
      if (result && result.distance <= MAP_DISTANCE_THRESHOLD.MACHI) {
        return { name: result.item.name, type: 'machi', entity: result.item };
      }
      // 距離しきい値を超えた場合は次のレベル（市区）にフォールスルー
    }

    // INITIAL(10)以上で市区名を表示
    if (zoom >= MAP_ZOOM.INITIAL && cities.length > 0) {
      // 市区名を表示（型アサーション：座標は必ず存在する）
      const validCities = cities as Array<CityRow & { latitude: number; longitude: number }>;
      const result = findNearest(validCities, center);
      if (result && result.distance <= MAP_DISTANCE_THRESHOLD.CITY) {
        // 元のCityRowを探す
        const originalCity = cities.find(c => c.id === result.item.id);
        return { name: result.item.name, type: 'city', entity: originalCity ?? null };
      }
      // 距離しきい値を超えた場合は次のレベル（都道府県）にフォールスルー
    }

    // COUNTRY(5)以上で都道府県名を表示
    if (zoom >= MAP_ZOOM.COUNTRY && prefectures.length > 0) {
      // 都道府県名を表示（型アサーション：座標は必ず存在する）
      const validPrefectures = prefectures as Array<PrefectureRow & { latitude: number; longitude: number }>;
      const result = findNearest(validPrefectures, center);
      if (result && result.distance <= MAP_DISTANCE_THRESHOLD.PREFECTURE) {
        return { name: result.item.name, type: 'prefecture', entity: null };
      }
      // 距離しきい値を超えた場合は次のレベル（国）にフォールスルー
    }

    // EARTH(3)以上で国名を表示
    if (zoom >= MAP_ZOOM.EARTH && countries.length > 0) {
      // 国名を表示
      const result = findNearest(countries, center);
      if (result && result.distance <= MAP_DISTANCE_THRESHOLD.COUNTRY) {
        return { name: result.item.name, type: 'country', entity: null };
      }
    }

    // どの距離しきい値も満たさない場合、またはズーム3未満は地球
    return { name: '地球', type: 'earth', entity: null };
  }, [cameraState, machiData, cities, prefectures, countries]);
}
