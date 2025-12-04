/**
 * BottomSheet関連のユーティリティ
 */

import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { useCallback, useRef } from 'react';

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
  const lastHiddenRef = useRef<boolean | null>(null);

  // JS側で呼び出すための安定した関数
  const notifyChange = useCallback((isHidden: boolean) => {
    // 前回と同じ値の場合は通知しない（無駄なレンダリング防止）
    if (lastHiddenRef.current === isHidden) return;
    lastHiddenRef.current = isHidden;
    onVisibilityChange(isHidden);
  }, [onVisibilityChange]);

  // animatedPositionの変化をUIスレッドで監視
  useAnimatedReaction(
    () => animatedPosition.value,
    (position) => {
      // positionは画面上端からカード上端までの距離（Y座標）
      // searchBarBottomYより小さい = カードが検索バー領域に入っている
      const shouldHide = position < searchBarBottomY;
      runOnJS(notifyChange)(shouldHide);
    },
    [searchBarBottomY]
  );
}
