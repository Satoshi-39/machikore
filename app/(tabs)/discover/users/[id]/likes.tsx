/**
 * ユーザーいいね一覧画面（発見タブ内スタック）
 *
 * URL: /(tabs)/discover/users/:id/likes
 */

import { useLocalSearchParams } from 'expo-router';
import { LikesPage } from '@/pages/likes';

export default function UserLikesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LikesPage userId={id ?? ''} />;
}
