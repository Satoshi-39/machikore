/**
 * スポット編集フォームのビジネスロジック
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSpotById, useUpdateSpot, useSpotImages, useUploadSpotImages } from '@/entities/user-spot/api';
import { deleteSpotImage } from '@/shared/api/supabase/images';
import type { SelectedImage } from '@/features/pick-images';

export function useEditSpotForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: spot, isLoading: isLoadingSpot } = useSpotById(id ?? null);
  const { data: existingImages, isLoading: isLoadingImages } = useSpotImages(id ?? null);
  const { mutate: updateSpot, isPending: isUpdating } = useUpdateSpot();
  const { mutateAsync: uploadImages } = useUploadSpotImages();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (data: {
    customName: string;
    description?: string;
    tags: string[];
    newImages?: SelectedImage[];
    deletedImageIds?: string[];
  }) => {
    if (!id) {
      Alert.alert('エラー', 'スポットIDが見つかりません');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 削除する画像を処理
      if (data.deletedImageIds && data.deletedImageIds.length > 0) {
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
        try {
          const result = await uploadImages({
            spotId: id,
            images: data.newImages,
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
    }
  };

  return {
    spot,
    existingImages: existingImages ?? [],
    isLoading: isLoadingSpot || isLoadingImages,
    isUpdating: isUpdating || isProcessing,
    handleSubmit,
  };
}
