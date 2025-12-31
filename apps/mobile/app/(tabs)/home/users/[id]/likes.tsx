/**
 * ユーザーいいね一覧画面（ホームタブ内スタック）
 *
 * URL: /(tabs)/home/users/:id/likes
 */

import { useLocalSearchParams } from 'expo-router';
import { LikesPage } from '@/pages/likes';

export default function UserLikesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LikesPage userId={id ?? ''} />;
}
