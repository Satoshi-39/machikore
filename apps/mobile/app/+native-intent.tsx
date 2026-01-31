/**
 * ディープリンクのURLリライト
 *
 * コールドスタート・ウォームスタート共通で、Expo Routerの自動ナビゲーションを抑制する。
 * 実際のナビゲーションは_layout.tsxで行う:
 *   - コールドスタート: Linking.getInitialURL() → ルーター準備完了後にrouter.push
 *   - ウォームスタート: Linking.addEventListener → router.push
 *
 * @see https://docs.expo.dev/router/advanced/native-intent/
 */

import { rewriteDeepLinkPath } from '@/shared/lib/navigation';

export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  // ディープリンク対象のURLはExpo Routerの自動ナビゲーションを抑制
  // _layout.tsxでrouter.pushを使って正しいスタック遷移を行う
  if (rewriteDeepLinkPath(path)) {
    return false;
  }

  // ディープリンク対象外のURLはそのまま返す
  return path;
}
