/**
 * BottomSheet関連のユーティリティ
 */

import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useCallback } from 'react';
import { Dimensions } from 'react-native';

/** 検索バー領域の下端Y座標 */
export const SEARCH_BAR_BOTTOM_Y = 180;

/** 現在地ボタンを非表示にする閾値（カード上端がこのY座標より上に来たら非表示） */
const SCREEN_HEIGHT = Dimensions.get('window').height;
// 小(18%: position=0.82)で表示、中(45%: position=0.55)以上で非表示
// 閾値を0.70に設定（小と中の間）
export const LOCATION_BUTTON_HIDE_THRESHOLD_Y = SCREEN_HEIGHT * 0.70;

interface UseSearchBarSyncOptions {
  /** 検索バー領域の下端Y座標（この位置より上にカードが来たら検索バーを非表示） */
  searchBarBottomY: number;
  /** 検索バーの表示/非表示が変化した時のコールバック */
  onVisibilityChange: (isHidden: boolean) => void;
}

/**
 * BottomSheetのanimatedPositionを監視して、検索バーの表示/非表示を同期
 * - カードが検索バー領域に入ったら非表示
 * - カードが検索バー領域から出たら表示
 *
 * 注意: このフックはBottomSheetの内部コンポーネントでのみ使用可能
 * （useBottomSheetはBottomSheet内でのみ動作するため）
 */
export function useSearchBarSync({
  searchBarBottomY,
  onVisibilityChange,
}: UseSearchBarSyncOptions) {
  const { animatedPosition } = useBottomSheet();
  // UIスレッドで前回の状態を保持（-1: 未初期化, 0: false, 1: true）
  const lastHiddenShared = useSharedValue(-1);

  // JS側で呼び出すための安定した関数
  const notifyChange = useCallback((isHidden: boolean) => {
    onVisibilityChange(isHidden);
  }, [onVisibilityChange]);

  // animatedPositionの変化をUIスレッドで監視
  // 状態が変化した時だけrunOnJSを呼ぶ（パフォーマンス最適化）
  useAnimatedReaction(
    () => animatedPosition.value,
    (position) => {
      'worklet';
      // positionは画面上端からカード上端までの距離（Y座標）
      // searchBarBottomYより小さい = カードが検索バー領域に入っている
      const shouldHide = position < searchBarBottomY;
      const shouldHideNum = shouldHide ? 1 : 0;

      // 状態が変化した時だけJSスレッドに通知
      if (lastHiddenShared.value !== shouldHideNum) {
        lastHiddenShared.value = shouldHideNum;
        scheduleOnRN(notifyChange, shouldHide);
      }
    },
    [searchBarBottomY, notifyChange]
  );
}

interface UseLocationButtonSyncOptions {
  /** 現在地ボタンの表示/非表示が変化した時のコールバック */
  onVisibilityChange: (isVisible: boolean) => void;
}

/**
 * BottomSheetのanimatedPositionを監視して、現在地ボタンの表示/非表示を同期
 * - カードが一定の高さ以下なら表示
 * - カードが一定の高さを超えたら非表示
 *
 * 注意: このフックはBottomSheetの内部コンポーネントでのみ使用可能
 * （useBottomSheetはBottomSheet内でのみ動作するため）
 */
export function useLocationButtonSync({
  onVisibilityChange,
}: UseLocationButtonSyncOptions) {
  const { animatedPosition } = useBottomSheet();
  // UIスレッドで前回の状態を保持（-1: 未初期化, 0: false, 1: true）
  const lastVisibleShared = useSharedValue(-1);

  // JS側で呼び出すための安定した関数
  const notifyChange = useCallback((isVisible: boolean) => {
    onVisibilityChange(isVisible);
  }, [onVisibilityChange]);

  // animatedPositionの変化をUIスレッドで監視
  // 状態が変化した時だけrunOnJSを呼ぶ（パフォーマンス最適化）
  useAnimatedReaction(
    () => animatedPosition.value,
    (position) => {
      'worklet';
      // positionは画面上端からカード上端までの距離（Y座標）
      // LOCATION_BUTTON_HIDE_THRESHOLD_Yより大きい = カードが低い位置にある = ボタン表示
      const shouldShow = position > LOCATION_BUTTON_HIDE_THRESHOLD_Y;
      const shouldShowNum = shouldShow ? 1 : 0;

      // 状態が変化した時だけJSスレッドに通知
      if (lastVisibleShared.value !== shouldShowNum) {
        lastVisibleShared.value = shouldShowNum;
        scheduleOnRN(notifyChange, shouldShow);
      }
    },
    [notifyChange]
  );
}
