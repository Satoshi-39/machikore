/**
 * ユーザーコレクション一覧画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/users/:id/collections
 */

import { useLocalSearchParams } from 'expo-router';
import { CollectionsPage } from '@/pages/collections';

export default function UserCollectionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CollectionsPage userId={id ?? ''} />;
}
