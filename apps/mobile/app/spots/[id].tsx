/**
 * スポット詳細画面（フォールバック）
 *
 * URL: /spots/:id
 * 通常は+native-intent.tsxでタブ内ルートにリライトされる。
 * リライトが効かない場合のフォールバック。
 */

import { Redirect, useLocalSearchParams } from 'expo-router';

export default function SpotDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <Redirect href={`/(tabs)/home/articles/spots/${id}`} />;
}
