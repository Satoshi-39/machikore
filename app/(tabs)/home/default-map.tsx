/**
 * デフォルトマップ画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/default-map
 * 街コレのデフォルトマップを表示
 */

import { DefaultMapPage } from '@/pages/default-map';

export default function DefaultMapScreen() {
  return <DefaultMapPage showBackButton />;
}
