/**
 * デフォルトマップ画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/bookmarks/default-map
 * ブックマークしたマスタースポットを表示
 */

import { DefaultMapPage } from '@/pages/default-map';

export default function DefaultMapScreen() {
  return <DefaultMapPage showBackButton />;
}
