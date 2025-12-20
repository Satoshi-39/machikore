/**
 * スポット編集フォームのビジネスロジック
 *
 * FSD: features/edit-spot/model に配置
 * - データ取得
 * - 画像アップロード/削除
 * - タグ更新
 * - 画面遷移
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSpotById, useUpdateSpot, useSpotImages, useUploadSpotImages } from '@/entities/user-spot/api';
import { useUserMaps } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useSpotLimit } from '@/entities/subscription';
import { useSpotTags, useUpdateSpotTags } from '@/entities/tag';
import { deleteSpotImage } from '@/shared/api/supabase/images';
import type { SelectedImage } from '@/features/pick-images';
import { log } from '@/shared/config/logger';
import type { SpotColor } from '@/shared/config';

export interface UploadProgress {
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
  const { data: spotTags = [], isLoading: isLoadingTags } = useSpotTags(id ?? '');
  const { mutate: updateSpot, isPending: isUpdating } = useUpdateSpot();
  const { mutateAsync: uploadImages } = useUploadSpotImages();
  const { mutateAsync: updateSpotTags } = useUpdateSpotTags();
  const spotLimit = useSpotLimit();

  // タグ名の配列を取得
  const initialTags = spotTags.map((tag) => tag.name);
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
    spotColor?: SpotColor;
  }) => {
    if (!id) {
      Alert.alert('エラー', 'スポットIDが見つかりません');
      return;
    }

    // マップを変更する場合、移動先のスポット数をチェック（プレミアム状態に応じた上限）
    if (data.mapId && spot && data.mapId !== spot.map_id) {
      const targetMap = userMaps.find((m) => m.id === data.mapId);
      if (targetMap && (targetMap.spots_count ?? 0) >= spotLimit) {
        Alert.alert(
          'スポット数の上限',
          `移動先のマップには既に${spotLimit}個のスポットが登録されています。\n別のマップを選択するか、既存のスポットを削除してください。`,
          [
            { text: 'OK' },
            {
              text: 'プレミアムに登録',
              onPress: () => router.push('/settings/premium'),
            },
          ]
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
            log.error('[useEditSpotForm] 画像削除エラー:', error);
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
            log.warn('[useEditSpotForm]', `${result.failed}枚の画像アップロードに失敗`);
          }
        } catch (error) {
          log.error('[useEditSpotForm] 画像アップロードエラー:', error);
          Alert.alert('警告', '一部の画像のアップロードに失敗しましたが、他の変更は保存されます');
        }
      }

      // 3. タグを中間テーブルに保存
      try {
        await updateSpotTags({ spotId: id, tagNames: data.tags });
      } catch (error) {
        log.error('[useEditSpotForm] タグ更新エラー:', error);
        // タグ更新エラーは警告のみで続行
      }

      // 4. スポット情報を更新
      updateSpot(
        {
          spotId: id,
          customName: data.customName, // NOT NULL制約があるため、nullは渡さない
          description: data.description || null,
          // 記事は別ページで編集（EditSpotArticlePage）
          // タグは中間テーブルに保存するため、ここでは更新しない（将来的にカラム削除予定）
          mapId: data.mapId,
          spotColor: data.spotColor,
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
            log.error('[useEditSpotForm] スポット更新エラー:', error);
            Alert.alert('エラー', 'スポットの更新に失敗しました');
          },
        }
      );
    } catch (error) {
      log.error('[useEditSpotForm] 処理エラー:', error);
      Alert.alert('エラー', '処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
      setUploadProgress({ current: 0, total: 0, status: 'idle' });
    }
  };

  return {
    spot,
    existingImages: existingImages ?? [],
    initialTags,
    isLoading: isLoadingSpot || isLoadingImages || isLoadingTags,
    isUpdating: isUpdating || isProcessing,
    uploadProgress,
    handleSubmit,
    userMaps,
    isMapsLoading,
    selectedMapId,
    setSelectedMapId,
  };
}
