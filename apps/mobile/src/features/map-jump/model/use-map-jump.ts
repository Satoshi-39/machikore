/**
 * マップジャンプフック
 *
 * 検索結果から場所（machi, city, prefecture, spot）へのジャンプを管理
 * Supabaseからデータを取得し、カメラ移動と詳細カード表示を行う
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSelectedPlaceStore, type MachikorePlaceSearchResult } from '@/features/search-places';
import {
  getMachiById,
  getCityById,
  getPrefectureById,
  getMasterSpotById,
} from '@/shared/api/supabase';
import { MAP_ZOOM } from '@/shared/config';
import { getRegionsData } from '@/shared/lib/utils/regions.utils';
import { getCountriesData } from '@/shared/lib/utils/countries.utils';
import type { MachiRow, CityRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';

interface CameraController {
  setCamera: (options: {
    centerCoordinate: [number, number];
    zoomLevel: number;
    animationDuration: number;
  }) => void;
}

interface UseMapJumpOptions {
  cameraRef: React.RefObject<CameraController | null>;
  onMachiSelect: (machi: MachiRow | null) => void;
  onCitySelect: (city: CityRow | null) => void;
  onSpotSelect: (spot: MasterSpotDisplay | null) => void;
  // 都道府県は詳細カード表示なし
}

interface UseMapJumpReturn {
  /** ジャンプ完了からの経過時間を判定するためのタイムスタンプ */
  lastJumpTimeRef: React.RefObject<number>;
}

/**
 * マップジャンプフック
 *
 * useSelectedPlaceStoreを監視し、ジャンプリクエストがあれば：
 * 1. Supabaseからデータを取得
 * 2. カメラを移動
 * 3. 詳細カードを表示（都道府県以外）
 */
export function useMapJump({
  cameraRef,
  onMachiSelect,
  onCitySelect,
  onSpotSelect,
}: UseMapJumpOptions): UseMapJumpReturn {
  const lastJumpTimeRef = useRef<number>(0);

  useEffect(() => {
    let isCancelled = false;

    const unsubscribe = useSelectedPlaceStore.subscribe((state, prevState) => {
      // マスタースポットへのジャンプ
      const newSpotId = state.jumpToMasterSpotId;
      const prevSpotId = prevState.jumpToMasterSpotId;
      if (newSpotId && newSpotId !== prevSpotId) {
        getMasterSpotById(newSpotId).then((spot) => {
          if (isCancelled) return;
          if (spot) {
            lastJumpTimeRef.current = Date.now();
            onSpotSelect(spot);
            requestAnimationFrame(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [spot.longitude, spot.latitude],
                  zoomLevel: MAP_ZOOM.SPOT,
                  animationDuration: 500,
                });
              }
            });
          }
          state.setJumpToMasterSpotId(null);
        });
      }

      // 街へのジャンプ
      const newMachiId = state.jumpToMachiId;
      const prevMachiId = prevState.jumpToMachiId;
      if (newMachiId && newMachiId !== prevMachiId) {
        getMachiById(newMachiId).then((machi) => {
          if (isCancelled) return;
          if (machi && machi.longitude != null && machi.latitude != null) {
            lastJumpTimeRef.current = Date.now();
            onMachiSelect(machi);
            requestAnimationFrame(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [machi.longitude!, machi.latitude!],
                  zoomLevel: MAP_ZOOM.MACHI,
                  animationDuration: 500,
                });
              }
            });
          }
          state.setJumpToMachiId(null);
        });
      }

      // 市区へのジャンプ
      const newCityId = state.jumpToCityId;
      const prevCityId = prevState.jumpToCityId;
      if (newCityId && newCityId !== prevCityId) {
        getCityById(newCityId).then((city) => {
          if (isCancelled) return;
          if (city && city.latitude && city.longitude) {
            lastJumpTimeRef.current = Date.now();
            onCitySelect(city);
            requestAnimationFrame(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [city.longitude!, city.latitude!],
                  zoomLevel: MAP_ZOOM.CITY,
                  animationDuration: 500,
                });
              }
            });
          }
          state.setJumpToCityId(null);
        }).catch(() => {
          state.setJumpToCityId(null);
        });
      }

      // 都道府県へのジャンプ（詳細カードなし、カメラ移動のみ）
      const newPrefId = state.jumpToPrefectureId;
      const prevPrefId = prevState.jumpToPrefectureId;
      if (newPrefId && newPrefId !== prevPrefId) {
        getPrefectureById(newPrefId).then((pref) => {
          if (isCancelled) return;
          if (pref && pref.latitude && pref.longitude) {
            lastJumpTimeRef.current = Date.now();
            // 都道府県は詳細カードを表示せず、他の選択もクリア
            onMachiSelect(null);
            onCitySelect(null);
            onSpotSelect(null);
            requestAnimationFrame(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [pref.longitude!, pref.latitude!],
                  zoomLevel: MAP_ZOOM.PREFECTURE,
                  animationDuration: 500,
                });
              }
            });
          }
          state.setJumpToPrefectureId(null);
        });
      }

      // 地方へのジャンプ（詳細カードなし、カメラ移動のみ）
      const newRegionId = state.jumpToRegionId;
      const prevRegionId = prevState.jumpToRegionId;
      if (newRegionId && newRegionId !== prevRegionId) {
        // 地方データはローカルJSONから取得
        const regions = getRegionsData();
        const region = regions.find((r) => r.id === newRegionId);
        if (region) {
          lastJumpTimeRef.current = Date.now();
          // 地方は詳細カードを表示せず、他の選択もクリア
          onMachiSelect(null);
          onCitySelect(null);
          onSpotSelect(null);
          if (region.longitude != null && region.latitude != null) {
            requestAnimationFrame(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [region.longitude!, region.latitude!],
                  zoomLevel: MAP_ZOOM.REGION,
                  animationDuration: 500,
                });
              }
            });
          }
        }
        state.setJumpToRegionId(null);
      }

      // 国へのジャンプ（詳細カードなし、カメラ移動のみ）
      const newCountryId = state.jumpToCountryId;
      const prevCountryId = prevState.jumpToCountryId;
      if (newCountryId && newCountryId !== prevCountryId) {
        // 国データはローカルJSONから取得
        const countries = getCountriesData();
        const country = countries.find((c) => c.id === newCountryId);
        if (country && country.longitude != null && country.latitude != null) {
          lastJumpTimeRef.current = Date.now();
          // 国は詳細カードを表示せず、他の選択もクリア
          onMachiSelect(null);
          onCitySelect(null);
          onSpotSelect(null);
          requestAnimationFrame(() => {
            if (cameraRef.current) {
              cameraRef.current.setCamera({
                centerCoordinate: [country.longitude!, country.latitude!],
                zoomLevel: MAP_ZOOM.COUNTRY,
                animationDuration: 500,
              });
            }
          });
        }
        state.setJumpToCountryId(null);
      }
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [cameraRef, onMachiSelect, onCitySelect, onSpotSelect]);

  return { lastJumpTimeRef };
}

/**
 * 検索結果からジャンプを実行するフック
 *
 * 検索結果のtypeに応じて適切なジャンプ処理を呼び出す
 */
export function useSearchResultJump() {
  const setJumpToMachiId = useSelectedPlaceStore((s) => s.setJumpToMachiId);
  const setJumpToCityId = useSelectedPlaceStore((s) => s.setJumpToCityId);
  const setJumpToPrefectureId = useSelectedPlaceStore((s) => s.setJumpToPrefectureId);
  const setJumpToRegionId = useSelectedPlaceStore((s) => s.setJumpToRegionId);
  const setJumpToCountryId = useSelectedPlaceStore((s) => s.setJumpToCountryId);
  const setJumpToMasterSpotId = useSelectedPlaceStore((s) => s.setJumpToMasterSpotId);

  const jumpToSearchResult = useCallback((place: MachikorePlaceSearchResult) => {
    switch (place.type) {
      case 'country':
        setJumpToCountryId(place.id);
        break;
      case 'region':
        setJumpToRegionId(place.id);
        break;
      case 'prefecture':
        setJumpToPrefectureId(place.id);
        break;
      case 'city':
        setJumpToCityId(place.id);
        break;
      case 'machi':
        setJumpToMachiId(place.id);
        break;
      case 'spot':
        // デフォルトマップ: master_spot_id
        // ユーザーマップ: user_spot_id（現状はジャンプ非対応）
        setJumpToMasterSpotId(place.id);
        break;
    }
  }, [setJumpToMachiId, setJumpToCityId, setJumpToPrefectureId, setJumpToRegionId, setJumpToCountryId, setJumpToMasterSpotId]);

  return { jumpToSearchResult };
}
