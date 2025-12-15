/**
 * デフォルトマップ画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/default-map
 * 街コレのデフォルトマップを表示
 */

import { MapPage } from '@/pages/map';

export default function DefaultMapScreen() {
  // mapIdを渡さない = デフォルトマップ表示
  // showBackButton = true でフィードに戻るボタンを表示
  return <MapPage showBackButton />;
}
