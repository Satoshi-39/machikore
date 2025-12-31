/**
 * ユーザースポットをGeoJSON形式に変換するhook
 */

import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import { determineSpotCategory } from '@/entities/master-spot';
import { type SpotColor, DEFAULT_SPOT_COLOR, SPOT_COLOR_LIST } from '@/shared/config';

interface UserSpotWithMasterSpot {
  id: string;
  custom_name: string | null;
  spot_color?: string | null;
  // ラベル情報（ラベルが設定されている場合、その色が優先される）
  map_label?: {
    id: string;
    name: string;
    color: string;
  } | null;
  // ピン刺し・現在地登録の場合はuser_spotに直接座標がある
  latitude?: number | null;
  longitude?: number | null;
  master_spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_types: string[] | string | null;
  } | null;
}

interface UserSpotGeoJsonProperties {
  id: string;
  name: string;
  category: SpotCategory;
  spot_color: SpotColor;
}

export function useUserSpotsGeoJson(
  spots: UserSpotWithMasterSpot[]
): FeatureCollection<Point, UserSpotGeoJsonProperties> {
  return useMemo(() => {
    const features = spots
      .filter((spot) => {
        // master_spotがあるか、user_spotに直接座標があるスポットのみ
        if (spot.master_spot) return true;
        if (spot.latitude != null && spot.longitude != null) return true;
        return false;
      })
      .map((spot) => {
        // 座標: master_spotがあればそこから、なければuser_spotから取得
        const latitude = spot.master_spot?.latitude ?? spot.latitude!;
        const longitude = spot.master_spot?.longitude ?? spot.longitude!;
        // 名前: custom_nameを優先、なければmaster_spotの名前
        const name = spot.custom_name || spot.master_spot?.name || '';
        // カテゴリ: master_spotがあればgoogle_typesから判定、なければ'other'
        const category = spot.master_spot
          ? determineSpotCategory(spot.master_spot.google_types)
          : 'other' as SpotCategory;

        // スポットカラー: ラベル色を優先、なければスポット色、それもなければデフォルト
        let spotColor: SpotColor = DEFAULT_SPOT_COLOR;
        if (spot.map_label?.color) {
          // ラベルの色（hex）からSpotColorキーを取得
          const labelColorKey = SPOT_COLOR_LIST.find((c) => c.color === spot.map_label?.color)?.key;
          if (labelColorKey) {
            spotColor = labelColorKey;
          }
        } else if (spot.spot_color) {
          spotColor = spot.spot_color as SpotColor;
        }

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [longitude, latitude],
          },
          properties: {
            id: spot.id,
            name,
            category,
            spot_color: spotColor,
          },
        };
      });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [spots]);
}
