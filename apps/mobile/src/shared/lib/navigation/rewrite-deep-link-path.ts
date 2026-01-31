/**
 * ディープリンクURLのリライト
 *
 * ルートレベルのディープリンクパスをタブ内の適切なルートに変換する。
 * +native-intent.tsx とウォームスタートのリンクハンドラで共有。
 */

/**
 * ディープリンクのパスをタブ内ルートに変換
 *
 * @returns 変換後のパス。変換不要な場合はnull
 */
export function rewriteDeepLinkPath(path: string): string | null {
  // machikore://spots/{id} → /(tabs)/home/articles/spots/{id}
  const spotsMatch = path.match(/^\/spots\/([^/?]+)/);
  if (spotsMatch) {
    return `/(tabs)/home/articles/spots/${spotsMatch[1]}`;
  }

  // machikore://maps/{id} → /(tabs)/home/articles/maps/{id}
  const mapsMatch = path.match(/^\/maps\/([^/?]+)/);
  if (mapsMatch) {
    return `/(tabs)/home/articles/maps/${mapsMatch[1]}`;
  }

  return null;
}
