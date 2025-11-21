/**
 * マップ作成フォームのビジネスロジック
 *
 * エラーハンドリング、データ送信、画面遷移を管理
 */

import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateMap } from '@/entities/user-map';
import { useUserStore } from '@/entities/user';

export function useMapForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { mutate: createMap, isPending } = useCreateMap();

  const handleSubmit = (data: {
    name: string;
    description?: string;
    category?: string;
    tags: string[];
    isPublic: boolean;
  }) => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    // マップ作成
    createMap(
      {
        userId: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.isPublic,
      },
      {
        onSuccess: () => {
          Alert.alert('作成完了', 'マップを作成しました', [
            {
              text: 'OK',
              onPress: () => {
                // マップ作成画面を閉じて前のページに戻る
                router.back();
              },
            },
          ]);
        },
        onError: (error) => {
          console.error('マップ作成エラー:', error);
          Alert.alert('エラー', 'マップの作成に失敗しました');
        },
      }
    );
  };

  return {
    handleSubmit,
    isLoading: isPending,
  };
}
