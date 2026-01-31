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
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  // pathの形式がコールドスタートとウォームスタートで異なる:
  //   コールドスタート: "/spots/{id}"
  //   ウォームスタート: "machikore://spots/{id}"
  // カスタムスキームURLの場合はhostname + pathnameに正規化する
  let normalizedPath = path;
  if (path.includes('://')) {
    try {
      const urlObj = new URL(path);
      normalizedPath = `/${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      // パース失敗時はそのまま
    }
  }

  if (rewriteDeepLinkPath(normalizedPath)) {
    if (initial) {
      // コールドスタート: ホームタブに遷移させる
      // 記事へのナビゲーションは_layout.tsxのLinking.getInitialURL()でrouter.pushする
      // ※ falseを返すとExpo Router内部でエラーになるため文字列を返す
      return '/(tabs)/home';
    }
    // ウォームスタート: Expo Routerの自動ナビゲーションを抑制
    // 記事へのナビゲーションは_layout.tsxのLinking.addEventListenerでrouter.pushする
    return false;
  }

  // ディープリンク対象外のURLはそのまま返す
  return path;
}
