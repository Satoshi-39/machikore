/**
 * スポット作成フォームのビジネスロジック
 *
 * エラーハンドリング、データ送信、画面遷移を管理
 * Google Places検索結果からのみスポット追加可能
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useSelectedPlaceStore,
  isPlaceSearchResult,
} from '@/features/search-places';
import { useCreateSpot } from '@/entities/spot';
import { useUserStore } from '@/entities/user';
import { useMapStore } from '@/entities/map';
import { getNearbyMachi } from '@/shared/api/sqlite';
import { uploadImage, STORAGE_BUCKETS, insertSpotImage } from '@/shared/api/supabase';
import type { SelectedImage } from '@/features/pick-images';

export interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'creating' | 'uploading' | 'done';
}

export function useSpotForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const selectedPlace = useSelectedPlaceStore((state) => state.selectedPlace);
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);
  const { mutate: createSpot, isPending: isCreating } = useCreateSpot();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });

  const defaultProgress: UploadProgress = { current: 0, total: 0, status: 'idle' };

  // データが存在しない場合は静かにnullを返す
  // （画面遷移途中の再レンダリングでアラートが表示されないようにする）
  if (!selectedPlace) {
    return { placeData: null, handleSubmit: () => {}, isLoading: false, uploadProgress: defaultProgress };
  }

  // Google Places検索結果でない場合はエラー
  if (!isPlaceSearchResult(selectedPlace)) {
    return { placeData: null, handleSubmit: () => {}, isLoading: false, uploadProgress: defaultProgress };
  }

  // 画像をアップロードするヘルパー関数（進捗状況を更新しながら）
  const uploadSpotImages = async (spotId: string, images: SelectedImage[]) => {
    let uploaded = 0;
    let failed = 0;

    setUploadProgress({ current: 0, total: images.length, status: 'uploading' });

    // 最初のリクエスト前に少し待機（ネットワーク初期化のタイミング問題を回避）
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < images.length; i++) {
      const image = images[i]!;
      const extension = image.uri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${i}.${extension}`;
      const path = `${spotId}/${fileName}`;

      try {
        const result = await uploadImage({
          uri: image.uri,
          bucket: STORAGE_BUCKETS.SPOT_IMAGES,
          path,
          contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
        });

        if (result.success) {
          // imagesテーブルに保存
          await insertSpotImage({
            spot_id: spotId,
            cloud_path: result.data.url,
            local_path: image.uri,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: i,
          });
          uploaded++;
        } else {
          console.error('画像アップロード失敗:', result.error);
          failed++;
        }
      } catch (error) {
        console.error('画像処理エラー:', error);
        failed++;
      }

      // 進捗を更新
      setUploadProgress({ current: i + 1, total: images.length, status: 'uploading' });
    }

    setUploadProgress({ current: images.length, total: images.length, status: 'done' });
    return { uploaded, failed };
  };

  const handleSubmit = async (data: {
    customName: string;
    description?: string;
    tags: string[];
    images: SelectedImage[];
  }) => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    if (!selectedMapId) {
      Alert.alert('エラー', 'マップが選択されていません');
      return;
    }

    // 座標から最寄りのmachiを取得（SQLiteから）
    const nearbyMachi = getNearbyMachi(selectedPlace.latitude, selectedPlace.longitude, 1);
    const nearestMachi = nearbyMachi[0];
    if (!nearestMachi) {
      Alert.alert('エラー', '近くの街が見つかりません');
      return;
    }
    const machiId = nearestMachi.id;

    // スポット作成
    createSpot(
      {
        userId: user.id,
        mapId: selectedMapId,
        machiId,
        name: selectedPlace.name,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        googlePlaceId: selectedPlace.googleData.placeId,
        googleFormattedAddress: selectedPlace.address,
        googleTypes: selectedPlace.category,
        googlePhoneNumber: selectedPlace.googleData.internationalPhoneNumber,
        googleWebsiteUri: selectedPlace.googleData.websiteUri,
        googleRating: selectedPlace.googleData.rating,
        googleUserRatingCount: selectedPlace.googleData.userRatingCount,
        customName: data.customName,
        description: data.description,
        tags: data.tags,
      },
      {
        onSuccess: async (spotId) => {
          // 画像がある場合はアップロード
          if (data.images.length > 0) {
            try {
              const result = await uploadSpotImages(spotId, data.images);
              console.log(`📸 画像アップロード完了: ${result.uploaded}枚成功, ${result.failed}枚失敗`);
            } catch (error) {
              console.error('画像アップロードエラー:', error);
              // 画像アップロード失敗してもスポット自体は作成済み
            }
          }

          Alert.alert('登録完了', 'スポットを登録しました', [
            {
              text: 'OK',
              onPress: () => {
                console.log('🎯 [useSpotForm] setJumpToSpotId呼び出し:', spotId);
                setJumpToSpotId(spotId);
                router.back();
              },
            },
          ]);
        },
        onError: (error) => {
          console.error('スポット作成エラー:', error);
          Alert.alert('エラー', 'スポットの登録に失敗しました');
        },
      }
    );
  };

  return {
    placeData: selectedPlace,
    handleSubmit,
    isLoading: isCreating || uploadProgress.status === 'uploading',
    uploadProgress,
  };
}
