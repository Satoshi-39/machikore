/**
 * 現在のタブを判定するhook
 * スタックナビゲーションで正しいタブ内に遷移するために使用
 */

import { usePathname } from 'expo-router';

export type TabName = 'discover' | 'map' | 'mypage' | 'notifications';

/**
 * 現在のURLパスからタブ名を判定
 */
export function useCurrentTab(): TabName {
  const pathname = usePathname();

  if (pathname.includes('/discover/')) return 'discover';
  if (pathname.includes('/map/')) return 'map';
  if (pathname.includes('/mypage/')) return 'mypage';
  if (pathname.includes('/notifications/')) return 'notifications';
  return 'discover'; // デフォルト
}
