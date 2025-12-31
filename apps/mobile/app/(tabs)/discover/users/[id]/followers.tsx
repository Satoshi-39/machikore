import { useLocalSearchParams } from 'expo-router';
import { FollowListPage } from '@/pages/follow-list';

export default function FollowersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FollowListPage userId={id ?? ''} type="followers" />;
}
