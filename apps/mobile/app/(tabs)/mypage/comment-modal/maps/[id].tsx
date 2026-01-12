/**
 * マップコメントモーダル画面（マイページタブ内）
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { CommentModalPage } from '@/pages/comment-modal';

export default function MapCommentModalScreen() {
  const { id, autoFocus, focusCommentId } = useLocalSearchParams<{
    id: string;
    autoFocus?: string;
    focusCommentId?: string;
  }>();
  const router = useRouter();

  if (!id) return null;

  return (
    <CommentModalPage
      type="map"
      targetId={id}
      onClose={() => router.back()}
      autoFocus={autoFocus === 'true'}
      focusCommentId={focusCommentId}
    />
  );
}
