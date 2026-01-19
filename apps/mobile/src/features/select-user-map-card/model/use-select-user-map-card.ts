/**
 * ユーザーマップのカード選択状態を管理するフック
 *
 * FSDの原則：Feature層はユーザーアクション・インタラクションを担当
 *
 * スポット選択の2つの経路を統合管理：
 * 1. initialSpotId（props経由）: ページ遷移時に使用（記事→スポット詳細など）
 * 2. jumpToSpotId（グローバルストア経由）: 同じページ内でのジャンプに使用
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSelectedPlaceStore } from '@/features/search-places';
import type { SpotWithDetails } from '@/shared/types';

interface UseSelectUserMapCardOptions {
  /** スポット一覧 */
  spots: SpotWithDetails[];
  /** 初期表示するスポットID（ページ遷移時に使用） */
  initialSpotId?: string | null;
  /** マップが準備できているか */
  isMapReady: boolean;
  /** カメラをスポットに移動する関数 */
  moveCameraToSpot: (spot: SpotWithDetails) => void;
  /** ヘッダー最大化コールバック */
  onDetailCardMaximized?: (isMaximized: boolean) => void;
  /** カード表示前に呼ばれるコールバック（現在地ボタンのちらつき防止用） */
  onBeforeCardOpen?: () => void;
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
  /** カルーセルでスワイプしてスポットにフォーカス（カメラ移動なし） */
  handleCarouselSpotFocus: (spot: SpotWithDetails) => void;
  /** カメラをスポットに移動（目のアイコンタップ時） */
  handleCameraMove: (spot: SpotWithDetails) => void;
  /** カルーセルでスポットカードをタップ（詳細カードを開く） */
  handleCarouselSpotPress: (spot: SpotWithDetails) => void;
  /** 詳細カードを閉じる → カルーセルに戻る */
  handleDetailCardClose: () => void;
  /** カルーセルを閉じる */
  closeCarousel: () => void;
  /** カルーセルを開く */
  openCarousel: () => void;
  /** 選択状態をリセット（mapId変更時など） */
  resetSelection: () => void;
  /** 初回カメラ移動済みフラグをリセット */
  resetInitialCameraFlag: () => void;
  /** 初回カメラ移動が完了したか */
  hasInitialCameraMoved: boolean;
}

export function useSelectUserMapCard({
  spots,
  initialSpotId = null,
  isMapReady,
  moveCameraToSpot,
  onDetailCardMaximized,
  onBeforeCardOpen,
}: UseSelectUserMapCardOptions): UseSelectUserMapCardReturn {
  // グローバルストアからjumpToSpotIdを取得
  const jumpToSpotId = useSelectedPlaceStore((state) => state.jumpToSpotId);
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

  // selectedSpotId を管理し、selectedSpot は spots から導出
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const selectedSpot = useMemo(
    () => spots.find((s) => s.id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  // initialSpotIdがある場合は最初から詳細カードを開く状態で初期化
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(!!initialSpotId);
  // カルーセルの表示状態（initialSpotIdがある場合は非表示）
  const [isCarouselVisible, setIsCarouselVisible] = useState(!initialSpotId);
  // カルーセルで現在フォーカスされているスポットID
  const [focusedSpotId, setFocusedSpotId] = useState<string | null>(null);
  // 初回カメラ移動済みフラグ
  const [hasInitialCameraMoved, setHasInitialCameraMoved] = useState(false);

  // 処理済みのスポットIDを追跡（二重処理防止）
  const processedSpotIdRef = useRef<string | null>(null);

  // initialSpotIdまたはjumpToSpotIdでスポットを開く（統合処理）
  useEffect(() => {
    // マップの準備ができていない、またはスポットがない場合は待機
    if (!isMapReady || spots.length === 0) return;

    // 処理するスポットID（jumpToSpotIdを優先 - ユーザーの明示的なアクション）
    const targetSpotId = jumpToSpotId || initialSpotId;
    if (!targetSpotId) return;

    // initialSpotIdの場合のみ二重処理防止チェック（jumpToSpotIdは毎回処理する）
    if (!jumpToSpotId && processedSpotIdRef.current === targetSpotId) return;

    const targetSpot = spots.find((s) => s.id === targetSpotId);
    if (!targetSpot) return;

    // initialSpotIdの場合のみ処理済みとしてマーク（jumpToSpotIdがない場合）
    if (!jumpToSpotId && initialSpotId) {
      processedSpotIdRef.current = targetSpotId;
    }

    // カード表示前のコールバック（現在地ボタンのちらつき防止）
    onBeforeCardOpen?.();

    // 少し遅延させてカードを開く（アニメーションのため）
    setTimeout(() => {
      setSelectedSpotId(targetSpot.id);
      setFocusedSpotId(targetSpot.id);
      setIsDetailCardOpen(true);
      setIsCarouselVisible(false);
      moveCameraToSpot(targetSpot);
      setHasInitialCameraMoved(true);

      // jumpToSpotIdの場合はクリア
      if (jumpToSpotId) {
        setJumpToSpotId(null);
      }
    }, 100);
  }, [
    initialSpotId,
    jumpToSpotId,
    spots,
    isMapReady,
    moveCameraToSpot,
    setJumpToSpotId,
    onBeforeCardOpen,
  ]);

  // マーカータップ時：カルーセルを表示してそのスポットにフォーカス（カメラ移動なし）
  const handleSpotSelect = useCallback(
    (spot: SpotWithDetails | null) => {
      if (spot) {
        setFocusedSpotId(spot.id);
        setIsCarouselVisible(true);
        setIsDetailCardOpen(false);
      } else {
        setFocusedSpotId(null);
      }
    },
    []
  );

  // カルーセルでスワイプしてスポットにフォーカス（カメラ移動なし）
  const handleCarouselSpotFocus = useCallback((spot: SpotWithDetails) => {
    setFocusedSpotId(spot.id);
  }, []);

  // カメラをスポットに移動（目のアイコンタップ時）
  const handleCameraMove = useCallback(
    (spot: SpotWithDetails) => {
      setFocusedSpotId(spot.id);
      moveCameraToSpot(spot);
    },
    [moveCameraToSpot]
  );

  // カルーセルでスポットカードをタップ（詳細カードを開く）
  const handleCarouselSpotPress = useCallback(
    (spot: SpotWithDetails) => {
      onBeforeCardOpen?.();
      setSelectedSpotId(spot.id);
      setFocusedSpotId(spot.id);
      setIsDetailCardOpen(true);
      setIsCarouselVisible(false);
    },
    [onBeforeCardOpen]
  );

  // 詳細カードを閉じる → カルーセルに戻る
  const handleDetailCardClose = useCallback(() => {
    setSelectedSpotId(null);
    setIsDetailCardOpen(false);
    setIsCarouselVisible(true);
    onDetailCardMaximized?.(false);
  }, [onDetailCardMaximized]);

  // カルーセルを閉じる（フォーカスも解除）
  const closeCarousel = useCallback(() => {
    setIsCarouselVisible(false);
    setFocusedSpotId(null);
  }, []);

  // カルーセルを開く
  const openCarousel = useCallback(() => {
    setIsCarouselVisible(true);
  }, []);

  // 選択状態をリセット（mapId変更時など）
  const resetSelection = useCallback(() => {
    setSelectedSpotId(null);
    setIsDetailCardOpen(false);
    setIsCarouselVisible(true);
    setFocusedSpotId(null);
    processedSpotIdRef.current = null;
  }, []);

  // 初回カメラ移動済みフラグをリセット
  const resetInitialCameraFlag = useCallback(() => {
    setHasInitialCameraMoved(false);
    processedSpotIdRef.current = null;
  }, []);

  return {
    selectedSpotId,
    selectedSpot,
    isDetailCardOpen,
    isCarouselVisible,
    focusedSpotId,
    handleSpotSelect,
    handleCarouselSpotFocus,
    handleCameraMove,
    handleCarouselSpotPress,
    handleDetailCardClose,
    closeCarousel,
    openCarousel,
    resetSelection,
    resetInitialCameraFlag,
    hasInitialCameraMoved,
  };
}
