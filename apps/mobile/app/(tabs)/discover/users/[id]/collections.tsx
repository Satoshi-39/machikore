/**
 * ユーザーコレクション一覧画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/users/:id/collections
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionsPage } from '@/pages/collections';

export default function UserCollectionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CollectionsPage userId={id ?? ''} />;
}
