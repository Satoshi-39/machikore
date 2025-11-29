/**
 * マップ編集フォームのビジネスロジック
 */

import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMap, useUpdateMap } from '@/entities/map';

export function useEditMapForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: map, isLoading: isLoadingMap } = useMap(id ?? null);
  const { mutate: updateMap, isPending: isUpdating } = useUpdateMap();

  const handleSubmit = (data: {
    name: string;
    description?: string;
    category?: string;
    tags: string[];
    isPublic: boolean;
  }) => {
    if (!id) {
      Alert.alert('エラー', 'マップIDが見つかりません');
      return;
    }

    updateMap(
      {
        id,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        tags: data.tags.length > 0 ? data.tags : null,
        is_public: data.isPublic,
      },
      {
        onSuccess: () => {
          Alert.alert('更新完了', 'マップを更新しました', [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          console.error('マップ更新エラー:', error);
          Alert.alert('エラー', 'マップの更新に失敗しました');
        },
      }
    );
  };

  return {
    map,
    isLoading: isLoadingMap,
    isUpdating,
    handleSubmit,
  };
}
