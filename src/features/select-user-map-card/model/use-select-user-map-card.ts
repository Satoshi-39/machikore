/**
 * ユーザーマップのカード選択状態を管理するフック
 *
 * FSDの原則：Feature層はユーザーアクション・インタラクションを担当
 */

import { useState, useMemo, useCallback } from 'react';
import type { SpotWithDetails } from '@/shared/types';

interface UseSelectUserMapCardOptions {
  /** スポット一覧 */
  spots: SpotWithDetails[];
  /** 初期表示するスポットID */
  initialSpotId?: string | null;
  /** カメラをスポットに移動する関数 */
  moveCameraToSpot: (spot: SpotWithDetails) => void;
  /** ヘッダー最大化コールバック */
  onDetailCardMaximized?: (isMaximized: boolean) => void;
}

interface UseSelectUserMapCardReturn {
  /** 選択されたスポットID */
  selectedSpotId: string | null;
  /** 選択されたスポット（spotsから導出） */
  selectedSpot: SpotWithDetails | null;
  /** 詳細カードが開いているか */
  isDetailCardOpen: boolean;
  /** カルーセルが表示されているか */
  isCarouselVisible: boolean;
  /** カルーセルでフォーカスされているスポットID */
  focusedSpotId: string | null;
  /** マーカータップ時：カルーセルを表示してスポットにフォーカス */
  handleSpotSelect: (spot: SpotWithDetails | null) => void;
  /** カルーセルでスワイプしてスポットにフォーカス */
  handleCarouselSpotFocus: (spot: SpotWithDetails) => void;
  /** カルーセルでスポットカードをタップ（詳細カードを開く） */
  handleCarouselSpotPress: (spot: SpotWithDetails) => void;
  /** 詳細カードを閉じる → カルーセルに戻る */
  handleDetailCardClose: () => void;
  /** カルーセルを閉じる */
  closeCarousel: () => void;
  /** 選択状態をリセット（mapId変更時など） */
  resetSelection: () => void;
  /** 特定のスポットIDで詳細カードを開く（ジャンプ時用） */
  openSpotById: (spotId: string) => void;
}

export function useSelectUserMapCard({
  spots,
  initialSpotId = null,
  moveCameraToSpot,
  onDetailCardMaximized,
}: UseSelectUserMapCardOptions): UseSelectUserMapCardReturn {
  // selectedSpotId を管理し、selectedSpot は spots から導出
  // これによりキャッシュの楽観的更新が自動的に反映される
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const selectedSpot = useMemo(
    () => spots.find((s) => s.id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  // initialSpotIdがある場合は最初から詳細カードを開く
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(!!initialSpotId);
  // カルーセルの表示状態（initialSpotIdがある場合は非表示）
  const [isCarouselVisible, setIsCarouselVisible] = useState(!initialSpotId);
  // カルーセルで現在フォーカスされているスポットID
  const [focusedSpotId, setFocusedSpotId] = useState<string | null>(null);

  // マーカータップ時：カルーセルを表示してそのスポットにフォーカス
  const handleSpotSelect = useCallback(
    (spot: SpotWithDetails | null) => {
      if (spot) {
        setFocusedSpotId(spot.id);
        setIsCarouselVisible(true);
        setIsDetailCardOpen(false);
        moveCameraToSpot(spot);
      } else {
        setFocusedSpotId(null);
      }
    },
    [moveCameraToSpot]
  );

  // カルーセルでスワイプしてスポットにフォーカス（カメラ移動のみ）
  const handleCarouselSpotFocus = useCallback(
    (spot: SpotWithDetails) => {
      setFocusedSpotId(spot.id);
      moveCameraToSpot(spot);
    },
    [moveCameraToSpot]
  );

  // カルーセルでスポットカードをタップ（詳細カードを開く）
  const handleCarouselSpotPress = useCallback(
    (spot: SpotWithDetails) => {
      setSelectedSpotId(spot.id);
      setFocusedSpotId(spot.id);
      setIsDetailCardOpen(true);
      setIsCarouselVisible(false); // カルーセルを非表示にしてボタン表示を有効にする
      moveCameraToSpot(spot);
    },
    [moveCameraToSpot]
  );

  // 詳細カードを閉じる → カルーセルに戻る
  const handleDetailCardClose = useCallback(() => {
    setSelectedSpotId(null);
    setIsDetailCardOpen(false);
    setIsCarouselVisible(true); // カルーセルに戻る
    // ヘッダーを表示状態に戻す
    onDetailCardMaximized?.(false);
  }, [onDetailCardMaximized]);

  // カルーセルを閉じる
  const closeCarousel = useCallback(() => {
    setIsCarouselVisible(false);
  }, []);

  // 選択状態をリセット（mapId変更時など）
  const resetSelection = useCallback(() => {
    setSelectedSpotId(null);
    setIsCarouselVisible(true);
  }, []);

  // 特定のスポットIDで詳細カードを開く（ジャンプ時用）
  const openSpotById = useCallback((spotId: string) => {
    setSelectedSpotId(spotId);
    setIsDetailCardOpen(true);
    setIsCarouselVisible(false);
  }, []);

  return {
    selectedSpotId,
    selectedSpot,
    isDetailCardOpen,
    isCarouselVisible,
    focusedSpotId,
    handleSpotSelect,
    handleCarouselSpotFocus,
    handleCarouselSpotPress,
    handleDetailCardClose,
    closeCarousel,
    resetSelection,
    openSpotById,
  };
}
