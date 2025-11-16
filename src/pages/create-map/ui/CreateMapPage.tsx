/**
 * マップ作成ページ
 *
 * FSDの原則：Pagesはルーティング可能な画面。Featureの組み合わせのみ
 */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreateMapForm } from '@/features/create-map';
import { createMap } from '@/entities/map';
import { useUserStore } from '@/entities/user';

export function CreateMapPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (data: {
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

    setIsCreating(true);

    try {
      // マップ作成
      createMap({
        userId: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.isPublic,
      });

      Alert.alert(
        '作成完了',
        'マップを作成しました',
        [
          {
            text: 'OK',
            onPress: () => {
              // マイページのマップタブへ遷移
              router.push('/(tabs)/mypage');
            },
          },
        ]
      );
    } catch (error) {
      console.error('マップ作成エラー:', error);
      Alert.alert('エラー', 'マップの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return <CreateMapForm onSubmit={handleSubmit} isLoading={isCreating} />;
}
