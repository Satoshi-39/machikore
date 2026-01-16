/**
 * マガジン詳細画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/magazines/:id
 * マガジンIDをMagazinePageに渡して表示
 */

import { useLocalSearchParams } from 'expo-router';
import { MagazinePage } from '@/pages/magazine';

export default function MagazineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;
  return <MagazinePage magazineId={id} />;
}
