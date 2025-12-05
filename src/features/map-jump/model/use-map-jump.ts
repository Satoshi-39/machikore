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
import type { MachiRow, CityRow } from '@/shared/types/database.types';
import type { MasterSpotDisplay } from '@/shared/api/supabase/spots';

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
    const unsubscribe = useSelectedPlaceStore.subscribe((state, prevState) => {
      // マスタースポットへのジャンプ
      const newSpotId = state.jumpToMasterSpotId;
      const prevSpotId = prevState.jumpToMasterSpotId;
      if (newSpotId && newSpotId !== prevSpotId) {
        getMasterSpotById(newSpotId).then((spot) => {
          if (spot) {
            lastJumpTimeRef.current = Date.now();
            onSpotSelect(spot);
            setTimeout(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [spot.longitude, spot.latitude],
                  zoomLevel: 15,
                  animationDuration: 500,
                });
              }
            }, 100);
          }
          state.setJumpToMasterSpotId(null);
        });
      }

      // 街へのジャンプ
      const newMachiId = state.jumpToMachiId;
      const prevMachiId = prevState.jumpToMachiId;
      if (newMachiId && newMachiId !== prevMachiId) {
        getMachiById(newMachiId).then((machi) => {
          if (machi) {
            lastJumpTimeRef.current = Date.now();
            onMachiSelect(machi);
            setTimeout(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [machi.longitude, machi.latitude],
                  zoomLevel: 14,
                  animationDuration: 500,
                });
              }
            }, 100);
          }
          state.setJumpToMachiId(null);
        });
      }

      // 市区へのジャンプ
      const newCityId = state.jumpToCityId;
      const prevCityId = prevState.jumpToCityId;
      if (newCityId && newCityId !== prevCityId) {
        console.log('🏙️ City jump requested:', newCityId);
        getCityById(newCityId).then((city) => {
          console.log('🏙️ City data from Supabase:', city);
          if (city && city.latitude && city.longitude) {
            lastJumpTimeRef.current = Date.now();
            onCitySelect(city);
            setTimeout(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [city.longitude!, city.latitude!],
                  zoomLevel: 11,
                  animationDuration: 500,
                });
              }
            }, 100);
          } else {
            console.warn('🏙️ City not found or missing coordinates:', newCityId);
          }
          state.setJumpToCityId(null);
        }).catch((error) => {
          console.error('🏙️ City fetch error:', error);
          state.setJumpToCityId(null);
        });
      }

      // 都道府県へのジャンプ（詳細カードなし、カメラ移動のみ）
      const newPrefId = state.jumpToPrefectureId;
      const prevPrefId = prevState.jumpToPrefectureId;
      if (newPrefId && newPrefId !== prevPrefId) {
        getPrefectureById(newPrefId).then((pref) => {
          if (pref && pref.latitude && pref.longitude) {
            lastJumpTimeRef.current = Date.now();
            // 都道府県は詳細カードを表示せず、他の選択もクリア
            onMachiSelect(null);
            onCitySelect(null);
            onSpotSelect(null);
            setTimeout(() => {
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: [pref.longitude!, pref.latitude!],
                  zoomLevel: 8,
                  animationDuration: 500,
                });
              }
            }, 100);
          }
          state.setJumpToPrefectureId(null);
        });
      }
    });

    return () => unsubscribe();
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
  const setJumpToMasterSpotId = useSelectedPlaceStore((s) => s.setJumpToMasterSpotId);

  const jumpToSearchResult = useCallback((place: MachikorePlaceSearchResult) => {
    switch (place.type) {
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
  }, [setJumpToMachiId, setJumpToCityId, setJumpToPrefectureId, setJumpToMasterSpotId]);

  return { jumpToSearchResult };
}
