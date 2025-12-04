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

  // /mypage または /mypage/xxx にマッチ
  if (pathname === '/mypage' || pathname.startsWith('/mypage/')) return 'mypage';
  if (pathname === '/notifications' || pathname.startsWith('/notifications/')) return 'notifications';
  if (pathname === '/map' || pathname.startsWith('/map/')) return 'map';
  if (pathname === '/discover' || pathname.startsWith('/discover/')) return 'discover';
  return 'discover'; // デフォルト
}
