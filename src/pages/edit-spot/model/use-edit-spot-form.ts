/**
 * スポット編集フォームのビジネスロジック
 */

import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSpotById, useUpdateSpot } from '@/entities/spot/api';

export function useEditSpotForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: spot, isLoading: isLoadingSpot } = useSpotById(id ?? null);
  const { mutate: updateSpot, isPending: isUpdating } = useUpdateSpot();

  const handleSubmit = (data: {
    customName: string;
    description?: string;
    tags: string[];
  }) => {
    if (!id) {
      Alert.alert('エラー', 'スポットIDが見つかりません');
      return;
    }

    updateSpot(
      {
        spotId: id,
        customName: data.customName || null,
        description: data.description || null,
        tags: data.tags.length > 0 ? data.tags : null,
      },
      {
        onSuccess: () => {
          Alert.alert('更新完了', 'スポットを更新しました', [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          console.error('スポット更新エラー:', error);
          Alert.alert('エラー', 'スポットの更新に失敗しました');
        },
      }
    );
  };

  return {
    spot,
    isLoading: isLoadingSpot,
    isUpdating,
    handleSubmit,
  };
}
