/**
 * デフォルトマップ画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/default-map
 * 街コレのデフォルトマップを表示
 */

import { DefaultMapPage } from '@/pages/default-map';

export default function DefaultMapScreen() {
  return <DefaultMapPage showBackButton />;
}
