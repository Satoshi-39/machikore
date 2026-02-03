/**
 * マップコントロール（現在地ボタンなど）の表示制御フック
 *
 * 注意: このフックはDefaultMapView（発見タブなど）で使用されています。
 * UserMapViewでは、より高度な状態管理を行う useMapUIMode を使用しています。
 * useMapUIMode はカルーセル・詳細カード・通常状態を一元管理し、
 * 現在地ボタンの位置とopacityを状態に応じて制御します。
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { duration as durationTokens } from '@/shared/config';

interface UseMapControlsVisibilityOptions {
  /** カードが存在するかどうか */
  hasCard: boolean;
  /** カードがなくなった時に自動でボタンを表示するか（デフォルト: true） */
  autoShowOnCardClose?: boolean;
}

interface UseMapControlsVisibilityReturn {
  /** 現在地ボタンのアニメーションスタイル */
  controlButtonsAnimatedStyle: { opacity: number };
  /** 現在地ボタンを表示/非表示にする */
  setControlButtonsVisible: (visible: boolean) => void;
  /** 現在地ボタンの表示/非表示コールバック（カード高さベース） */
  handleControlButtonsVisibilityChange: (isVisible: boolean) => void;
  /** カード閉じる前のコールバック */
  handleBeforeClose: () => void;
  /** カード閉じる処理完了時に呼ぶ（refをリセット） */
  resetClosingState: () => void;
  /** カードが開く時のコールバック（初回ちらつき防止用） */
  handleCardOpen: () => void;
  /** 現在地ボタンのopacity値（pointerEvents判定用） */
  controlButtonsOpacity: { value: number };
  /** ボタンがタッチ可能かどうか（React state、pointerEvents用） */
  isButtonsTouchable: boolean;
}

/**
 * マップコントロールの表示制御を管理するフック
 * - 現在地ボタンのフェードイン/アウト
 * - カード閉じる時の表示制御
 */
export function useMapControlsVisibility({
  hasCard,
  autoShowOnCardClose = true,
}: UseMapControlsVisibilityOptions): UseMapControlsVisibilityReturn {
  // 現在地ボタンの表示状態（アニメーション用）
  const controlButtonsOpacity = useSharedValue(1);
  // カード閉じる処理中フラグ（refで管理して即座に反映）
  const isClosingRef = useRef(false);
  // ボタンがタッチ可能かどうか（React state、pointerEvents用）
  const [isButtonsTouchable, setIsButtonsTouchable] = useState(true);

  // 現在地ボタンのアニメーションスタイル
  const controlButtonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlButtonsOpacity.value,
    };
  });

  // 現在地ボタンを表示/非表示にする（アニメーション付き）
  const setControlButtonsVisible = useCallback((visible: boolean) => {
    // React stateをUI threadから安全に更新
    setIsButtonsTouchable(visible);
    controlButtonsOpacity.value = withTiming(visible ? 1 : 0, { duration: durationTokens.fast });
  }, [controlButtonsOpacity]);

  // 現在地ボタン表示/非表示のコールバック（高さベースの判定）
  // 閉じる処理中は無視（refで即座に判定）
  const handleControlButtonsVisibilityChange = useCallback((isVisible: boolean) => {
    if (isClosingRef.current) return;
    setControlButtonsVisible(isVisible);
  }, [setControlButtonsVisible]);

  // カード閉じる前のコールバック（閉じるフラグを立ててボタンを非表示）
  const handleBeforeClose = useCallback(() => {
    isClosingRef.current = true;
    setControlButtonsVisible(false);
  }, [setControlButtonsVisible]);

  // 閉じる処理完了時にrefをリセット
  const resetClosingState = useCallback(() => {
    isClosingRef.current = false;
  }, []);

  // カードが開く時のコールバック（初回ちらつき防止用）
  const handleCardOpen = useCallback(() => {
    setIsButtonsTouchable(false);
    controlButtonsOpacity.value = 0;
  }, [controlButtonsOpacity]);

  // カードがなくなったら現在地ボタンを表示（autoShowOnCardCloseがtrueの場合のみ）
  useEffect(() => {
    if (autoShowOnCardClose && !hasCard) {
      setControlButtonsVisible(true);
    }
  }, [hasCard, autoShowOnCardClose, setControlButtonsVisible]);

  return {
    controlButtonsAnimatedStyle,
    setControlButtonsVisible,
    handleControlButtonsVisibilityChange,
    handleBeforeClose,
    resetClosingState,
    handleCardOpen,
    controlButtonsOpacity,
    isButtonsTouchable,
  };
}
