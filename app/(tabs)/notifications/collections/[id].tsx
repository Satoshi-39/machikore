/**
 * コレクション詳細画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/collections/:id
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionDetailPage } from '@/pages/collection';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <CollectionDetailPage collectionId={id} />;
}
