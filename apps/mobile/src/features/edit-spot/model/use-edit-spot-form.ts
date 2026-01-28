/**
 * スポット編集フォームのビジネスロジック
 *
 * FSD: features/edit-spot/model に配置
 * - データ取得
 * - 画像アップロード/削除
 * - タグ更新
 * - 画面遷移
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSpotById, useUpdateSpot, useSpotImages, useUploadSpotImages } from '@/entities/user-spot/api';
import { useUserMaps } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useSpotLimit } from '@/entities/subscription';
import { useSpotTags, useUpdateSpotTags } from '@/entities/tag';
import { deleteSpotImage } from '@/shared/api/supabase/images';
import { getPublicSpotsCount } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import type { SelectedImage } from '@/features/pick-images';
import type { SpotColor } from '@/shared/config';
import type { UploadProgress } from './types';
import { useEditSpotStore } from './use-edit-spot-store';

export function useEditSpotForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUserStore((state) => state.user);
  const { data: spot, isLoading: isLoadingSpot, refetch: refetchSpot } = useSpotById(id ?? null);
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

  // 公開スポット数（最後のスポット非公開時の警告用）
  const [publicSpotsCount, setPublicSpotsCount] = useState<number>(0);

  // スポットデータが読み込まれたら、現在のマップIDで初期化
  useEffect(() => {
    if (spot && selectedMapId === null) {
      setSelectedMapId(spot.map_id);
    }
  }, [spot, selectedMapId]);

  // 公開スポット数を取得
  useEffect(() => {
    if (!spot?.map_id) return;

    getPublicSpotsCount(spot.map_id)
      .then((count) => {
        setPublicSpotsCount(count);
      })
      .catch((error) => {
        log.error('[useEditSpotForm] 公開スポット数取得エラー:', error);
        setPublicSpotsCount(0);
      });
  }, [spot?.map_id]);

  // Zustandストアから状態を取得（一言のみ管理）
  const storeSpotId = useEditSpotStore((state) => state.spotId);
  const initializeEdit = useEditSpotStore((state) => state.initializeEdit);
  const clearEdit = useEditSpotStore((state) => state.clearEdit);
  const getChangedValues = useEditSpotStore((state) => state.getChangedValues);
  const draftDescription = useEditSpotStore((state) => state.draftDescription);
  // 変更検知フラグを直接購読（リアクティブに変更を検知するため）
  const isDescriptionChanged = useEditSpotStore((state) => state.isDescriptionChanged);

  // スポットデータが読み込まれたら、ストアを初期化（一言のみ）
  useEffect(() => {
    if (spot && storeSpotId !== spot.id) {
      initializeEdit({
        spotId: spot.id,
        description: spot.description || '',
      });
    }
  }, [spot, storeSpotId, initializeEdit]);

  // 画面にフォーカスが戻った時にスポットデータを再取得
  // （記事編集ページでの一言変更がサーバーに保存されているため）
  useFocusEffect(
    useCallback(() => {
      // 初回マウント時は不要（useSpotByIdで取得済み）
      // 2回目以降（記事編集ページから戻った時）に再取得
      if (spot && storeSpotId === spot.id) {
        refetchSpot().then((result) => {
          if (result.data) {
            // サーバーの最新値でストアを再初期化
            // ただし、ローカルで未保存の変更がある場合は上書きしない
            if (!isDescriptionChanged) {
              initializeEdit({
                spotId: result.data.id,
                description: result.data.description || '',
              });
            }
          }
        });
      }
    }, [spot, storeSpotId, refetchSpot, initializeEdit, isDescriptionChanged])
  );

  const handleSubmit = async (data: {
    // descriptionは別ページで編集・保存するため除外
    tags: string[];
    newImages?: SelectedImage[];
    deletedImageIds?: string[];
    mapId?: string;
    spotColor?: SpotColor;
    labelId?: string | null;
    /** 現在地/ピン刺し登録のスポット名（編集） */
    spotName?: string;
    /** スポットの公開/非公開設定 */
    isPublic?: boolean;
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
          // 既存画像数を計算（削除予定の画像を除く）
          const remainingImagesCount = (existingImages?.length ?? 0) - (data.deletedImageIds?.length ?? 0);
          const result = await uploadImages({
            spotId: id,
            images: data.newImages,
            existingImagesCount: remainingImagesCount,
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

      // 4. スポット情報を更新（Zustandからの変更も含める）
      const changedValues = getChangedValues();

      updateSpot(
        {
          spotId: id,
          // フォームからの変更
          mapId: data.mapId,
          spotColor: data.spotColor,
          labelId: data.labelId,
          spotName: data.spotName,
          isPublic: data.isPublic,
          // Zustandストアからの変更（一言のみ）
          description: changedValues.description,
        },
        {
          onSuccess: () => {
            // 画像キャッシュを更新
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsImages(id) });
            // ストアをクリア
            clearEdit();

            // 保存完了のメッセージを表示（ページには留まる）
            Alert.alert('更新完了', 'スポットを更新しました');
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
    publicSpotsCount,
    // Zustandストアからの変更検知（一言のみ）
    hasStoreChanges: isDescriptionChanged,
    // 一言の表示用（ストアから取得）
    draftDescription,
  };
}
