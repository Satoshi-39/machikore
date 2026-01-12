/**
 * マップコメントモーダル画面（通知タブ内）
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { CommentModalPage } from '@/pages/comment-modal';

export default function MapCommentModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) return null;

  return (
    <CommentModalPage
      type="map"
      targetId={id}
      onClose={() => router.back()}
      onUserPress={(userId) => {
        router.dismiss();
        router.push(`/(tabs)/notifications/users/${userId}`);
      }}
    />
  );
}
