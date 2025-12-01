import { useLocalSearchParams } from 'expo-router';
import { LikesPage } from '@/pages/likes';

export default function UserLikesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LikesPage userId={id ?? ''} />;
}
