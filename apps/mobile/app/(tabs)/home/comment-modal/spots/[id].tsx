/**
 * スポットコメントモーダル画面（ホームタブ内）
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
      autoFocus={autoFocus === 'true'}
      focusCommentId={focusCommentId}
    />
  );
}
