/**
 * コレクション詳細画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/collections/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionDetailPage } from '@/pages/collection';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CollectionDetailPage collectionId={id} />;
}
