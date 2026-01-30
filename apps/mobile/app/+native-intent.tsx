/**
 * ディープリンクのURLリライト
 *
 * ルートレベルのディープリンクをタブ内の適切なルートに変換し、
 * タブバーの表示とバックボタンの動作を保証する
 *
 * @see https://docs.expo.dev/router/advanced/native-intent/
 */

export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  try {
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

    return path;
  } catch {
    return '/';
  }
}
