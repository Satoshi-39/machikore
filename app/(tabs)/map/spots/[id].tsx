/**
 * スポット詳細画面（マップタブ内スタック）
 *
 * URL: /(tabs)/map/spots/:id
 * スポットIDからmap_idを取得してMapPageを表示
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotById } from '@/entities/user-spot/api';
import { MapPage } from '@/pages/map';
import { colors } from '@/shared/config';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: spot, isLoading } = useSpotById(id ?? null);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  }

  if (!spot) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">スポットが見つかりません</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">戻る</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return <MapPage mapId={spot.map_id} initialSpotId={id} />;
}
