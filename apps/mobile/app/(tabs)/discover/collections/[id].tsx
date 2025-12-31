/**
 * コレクション詳細画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/collections/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionDetailPage } from '@/pages/collection';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CollectionDetailPage collectionId={id} />;
}
