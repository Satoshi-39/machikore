/**
 * デフォルトマップ画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/bookmarks/default-map
 * ブックマークしたマスタースポットを表示
 */

import { DefaultMapPage } from '@/pages/default-map';

export default function DefaultMapScreen() {
  return <DefaultMapPage showBackButton />;
}
