/**
 * デフォルトマップ画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/bookmarks/default-map
 * ブックマークしたマスタースポットを表示
 */

import { DefaultMapPage } from '@/pages/default-map';

export default function DefaultMapScreen() {
  return <DefaultMapPage showBackButton />;
}
