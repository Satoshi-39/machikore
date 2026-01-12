/**
 * スポットコメントモーダル画面（マイページタブ内）
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { CommentModalPage } from '@/pages/comment-modal';

export default function SpotCommentModalScreen() {
  const { id, autoFocus, focusCommentId } = useLocalSearchParams<{
    id: string;
    autoFocus?: string;
    focusCommentId?: string;
  }>();
  const router = useRouter();

  if (!id) return null;

  return (
    <CommentModalPage
      type="spot"
      targetId={id}
      onClose={() => router.back()}
      onUserPress={(userId) => {
        router.dismiss();
        router.push(`/(tabs)/mypage/users/${userId}`);
      }}
      autoFocus={autoFocus === 'true'}
      focusCommentId={focusCommentId}
    />
  );
}
