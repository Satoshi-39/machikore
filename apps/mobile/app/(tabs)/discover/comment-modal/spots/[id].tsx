/**
 * スポットコメントモーダル画面（発見タブ内）
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { CommentModalScreen } from '@/pages/comment-modal';

export default function SpotCommentModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) return null;

  return (
    <CommentModalScreen
      type="spot"
      targetId={id}
      onClose={() => router.back()}
      onUserPress={(userId) => {
        router.dismiss();
        router.push(`/(tabs)/discover/users/${userId}`);
      }}
    />
  );
}
