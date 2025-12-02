import { useLocalSearchParams } from 'expo-router';
import { MapCommentsPage } from '@/pages/comments';

export default function MapCommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return <MapCommentsPage mapId={id} />;
}
