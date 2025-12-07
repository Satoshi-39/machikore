/**
 * スポット編集フォームのビジネスロジック
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSpotById, useUpdateSpot, useSpotImages, useUploadSpotImages } from '@/entities/user-spot/api';
import { useUserMaps } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { deleteSpotImage } from '@/shared/api/supabase/images';
import { INPUT_LIMITS } from '@/shared/config';
import type { SelectedImage } from '@/features/pick-images';

interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'updating' | 'uploading' | 'deleting' | 'done';
}

export function useEditSpotForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUserStore((state) => state.user);
  const { data: spot, isLoading: isLoadingSpot } = useSpotById(id ?? null);
  const { data: existingImages, isLoading: isLoadingImages } = useSpotImages(id ?? null);
  const { mutate: updateSpot, isPending: isUpdating } = useUpdateSpot();
  const { mutateAsync: uploadImages } = useUploadSpotImages();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });

  // ユーザーのマップ一覧を取得
  const { data: userMaps = [], isLoading: isMapsLoading } = useUserMaps(user?.id ?? null, {
    currentUserId: user?.id,
  });

  // 選択中のマップID（スポットの現在のマップIDで初期化）
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  // スポットデータが読み込まれたら、現在のマップIDで初期化
  useEffect(() => {
    if (spot && selectedMapId === null) {
      setSelectedMapId(spot.map_id);
    }
  }, [spot, selectedMapId]);

  const handleSubmit = async (data: {
    customName: string;
    description?: string;
    tags: string[];
    newImages?: SelectedImage[];
    deletedImageIds?: string[];
    mapId?: string;
  }) => {
    if (!id) {
      Alert.alert('エラー', 'スポットIDが見つかりません');
      return;
    }

    // マップを変更する場合、移動先のスポット数をチェック
    if (data.mapId && spot && data.mapId !== spot.map_id) {
      const targetMap = userMaps.find((m) => m.id === data.mapId);
      if (targetMap && targetMap.spots_count >= INPUT_LIMITS.MAX_SPOTS_PER_MAP) {
        Alert.alert(
          'スポット数の上限',
          `移動先のマップには既に${INPUT_LIMITS.MAX_SPOTS_PER_MAP}個のスポットが登録されています。\n別のマップを選択するか、既存のスポットを削除してください。`
        );
        return;
      }
    }

    setIsProcessing(true);
    setUploadProgress({ current: 0, total: 0, status: 'updating' });

    try {
      // 1. 削除する画像を処理
      if (data.deletedImageIds && data.deletedImageIds.length > 0) {
        setUploadProgress({ current: 0, total: data.deletedImageIds.length, status: 'deleting' });
        for (const imageId of data.deletedImageIds) {
          try {
            await deleteSpotImage(imageId);
          } catch (error) {
            console.error('画像削除エラー:', error);
            // 削除エラーは続行
          }
        }
      }

      // 2. 新しい画像をアップロード
      if (data.newImages && data.newImages.length > 0) {
        setUploadProgress({ current: 0, total: data.newImages.length, status: 'uploading' });
        try {
          const result = await uploadImages({
            spotId: id,
            images: data.newImages,
            onProgress: (current, total) => {
              setUploadProgress({ current, total, status: 'uploading' });
            },
          });

          if (result.failed > 0) {
            console.warn(`${result.failed}枚の画像アップロードに失敗`);
          }
        } catch (error) {
          console.error('画像アップロードエラー:', error);
          Alert.alert('警告', '一部の画像のアップロードに失敗しましたが、他の変更は保存されます');
        }
      }

      // 3. スポット情報を更新
      updateSpot(
        {
          spotId: id,
          customName: data.customName || null,
          description: data.description || null,
          tags: data.tags.length > 0 ? data.tags : null,
          mapId: data.mapId,
        },
        {
          onSuccess: () => {
            // 画像キャッシュを更新
            queryClient.invalidateQueries({ queryKey: ['spot-images', id] });

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
    } catch (error) {
      console.error('処理エラー:', error);
      Alert.alert('エラー', '処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
      setUploadProgress({ current: 0, total: 0, status: 'idle' });
    }
  };

  return {
    spot,
    existingImages: existingImages ?? [],
    isLoading: isLoadingSpot || isLoadingImages,
    isUpdating: isUpdating || isProcessing,
    uploadProgress,
    handleSubmit,
    userMaps,
    isMapsLoading,
    selectedMapId,
    setSelectedMapId,
  };
}
