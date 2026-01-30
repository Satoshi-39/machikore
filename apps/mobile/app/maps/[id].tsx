/**
 * マップ詳細画面（フォールバック）
 *
 * URL: /maps/:id
 * 通常は+native-intent.tsxでタブ内ルートにリライトされる。
 * リライトが効かない場合のフォールバック。
 */

import { Redirect, useLocalSearchParams } from 'expo-router';

export default function MapDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <Redirect href={`/(tabs)/home/articles/maps/${id}`} />;
}
