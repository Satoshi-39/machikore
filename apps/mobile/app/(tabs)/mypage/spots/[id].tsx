/**
 * スポット詳細画面（マイページタブ内スタック）
 *
 * URL: /(tabs)/mypage/spots/:id
 * スポットIDからmap_idを取得してUserMapPageを表示
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotById } from '@/entities/user-spot/api';
import { UserMapPage } from '@/pages/user-map';
import { colors } from '@/shared/config';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: spot, isLoading } = useSpotById(id ?? null);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  }

  if (!spot) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface justify-center items-center">
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">スポットが見つかりません</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">戻る</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return <UserMapPage mapId={spot.map_id} initialSpotId={id} />;
}
