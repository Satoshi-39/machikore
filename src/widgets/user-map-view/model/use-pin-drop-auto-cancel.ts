/**
 * ピン刺しモード自動キャンセルフック
 *
 * ページがフォーカスを失った時にピン刺しモードを自動的にキャンセルする
 */

import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { usePinDropStore } from '@/features/drop-pin';

/**
 * ピン刺しモードの自動キャンセル処理
 * UserMapViewがフォーカスを失った時（別ページ遷移・別タブ切り替え）に
 * ピン刺しモードを自動的にリセットする
 */
export function usePinDropAutoCancel() {
  const reset = usePinDropStore((state) => state.reset);

  useFocusEffect(
    useCallback(() => {
      return () => {
        reset();
      };
    }, [reset])
  );
}
