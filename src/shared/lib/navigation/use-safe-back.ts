/**
 * 安全な戻るナビゲーションフック
 *
 * router.canGoBack()をチェックし、戻れない場合はdismiss()を呼ぶ
 */

import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * 安全に前の画面に戻るためのフック
 *
 * @returns goBack - 戻れる場合はback()、戻れない場合はdismiss()を呼ぶ関数
 */
export function useSafeBack() {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.dismiss();
    }
  }, [router]);

  return { goBack };
}
