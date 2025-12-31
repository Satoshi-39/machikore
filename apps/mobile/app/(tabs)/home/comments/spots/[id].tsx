import { useLocalSearchParams } from 'expo-router';
import { SpotCommentsPage } from '@/pages/comments';

export default function SpotCommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <SpotCommentsPage spotId={id} />;
}
