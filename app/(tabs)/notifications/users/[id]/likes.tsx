/**
 * ユーザーいいね一覧画面（通知タブ内スタック）
 *
 * URL: /(tabs)/notifications/users/:id/likes
 */

import { useLocalSearchParams } from 'expo-router';
import { LikesPage } from '@/pages/likes';

export default function UserLikesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LikesPage userId={id ?? ''} />;
}
