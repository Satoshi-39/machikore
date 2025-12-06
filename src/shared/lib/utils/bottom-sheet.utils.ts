/**
 * BottomSheet関連のユーティリティ
 */

import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useCallback } from 'react';

/** 検索バー領域の下端Y座標 */
export const SEARCH_BAR_BOTTOM_Y = 180;

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
