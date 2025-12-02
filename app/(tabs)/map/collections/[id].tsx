/**
 * コレクション詳細画面（マップタブ内スタック）
 *
 * URL: /(tabs)/map/collections/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionDetailPage } from '@/pages/collection';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CollectionDetailPage collectionId={id} />;
}
