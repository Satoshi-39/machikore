/**
 * マップコントロール（現在地ボタンなど）の表示制御フック
 */

import { useCallback, useEffect, useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface UseMapControlsVisibilityOptions {
  /** カードが存在するかどうか */
  hasCard: boolean;
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
  /** 現在地ボタンのopacity値（pointerEvents判定用） */
  controlButtonsOpacity: { value: number };
}

/**
 * マップコントロールの表示制御を管理するフック
 * - 現在地ボタンのフェードイン/アウト
 * - カード閉じる時の表示制御
 */
export function useMapControlsVisibility({
  hasCard,
}: UseMapControlsVisibilityOptions): UseMapControlsVisibilityReturn {
  // 現在地ボタンの表示状態（アニメーション用）
  const controlButtonsOpacity = useSharedValue(1);
  // カード閉じる処理中フラグ（refで管理して即座に反映）
  const isClosingRef = useRef(false);

  // 現在地ボタンのアニメーションスタイル
  const controlButtonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlButtonsOpacity.value,
    };
  });

  // 現在地ボタンを表示/非表示にする（アニメーション付き）
  const setControlButtonsVisible = useCallback((visible: boolean) => {
    controlButtonsOpacity.value = withTiming(visible ? 1 : 0, { duration: 150 });
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

  // カードがなくなったら現在地ボタンを表示
  useEffect(() => {
    if (!hasCard) {
      setControlButtonsVisible(true);
    }
  }, [hasCard, setControlButtonsVisible]);

  return {
    controlButtonsAnimatedStyle,
    setControlButtonsVisible,
    handleControlButtonsVisibilityChange,
    handleBeforeClose,
    resetClosingState,
    controlButtonsOpacity,
  };
}
