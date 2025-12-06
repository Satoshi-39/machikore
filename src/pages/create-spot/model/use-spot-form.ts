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
import { useCreateSpot } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { useMapStore, useUserMaps } from '@/entities/map';
import { uploadImage, STORAGE_BUCKETS, insertSpotImage, getNearbyMachi } from '@/shared/api/supabase';
import { queryClient } from '@/shared/api/query-client';
import type { SelectedImage } from '@/features/pick-images';

export interface UploadProgress {
  current: number;
  total: number;
  status: 'idle' | 'creating' | 'uploading' | 'done';
}

export function useSpotForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const storeMapId = useMapStore((state) => state.selectedMapId);
  const selectedPlace = useSelectedPlaceStore((state) => state.selectedPlace);
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);
  const { mutate: createSpot, isPending: isCreating } = useCreateSpot();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });

  // ユーザーのマップ一覧を取得
  const { data: userMaps = [], isLoading: isMapsLoading } = useUserMaps(user?.id ?? null, {
    currentUserId: user?.id,
  });

  // 選択中のマップID（ローカルstate）
  const [selectedMapId, setSelectedMapId] = useState<string | null>(storeMapId);

  const defaultProgress: UploadProgress = { current: 0, total: 0, status: 'idle' };
  const defaultReturn = {
    placeData: null,
    handleSubmit: () => {},
    isLoading: false,
    uploadProgress: defaultProgress,
    userMaps: [] as typeof userMaps,
    isMapsLoading: false,
    selectedMapId: null as string | null,
    setSelectedMapId: () => {},
  };

  // データが存在しない場合は静かにnullを返す
  // （画面遷移途中の再レンダリングでアラートが表示されないようにする）
  if (!selectedPlace) {
    return defaultReturn;
  }

  // Google Places検索結果でない場合はエラー
  if (!isPlaceSearchResult(selectedPlace)) {
    return defaultReturn;
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
    mapId: string;
  }) => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    if (!data.mapId) {
      Alert.alert('エラー', 'マップが選択されていません');
      return;
    }

    // 座標から最寄りのmachiを取得（Supabaseから）
    // SQLiteではなくSupabaseから取得することで外部キー制約エラーを防ぐ
    let machiId: string;
    try {
      const nearbyMachi = await getNearbyMachi(
        selectedPlace.latitude,
        selectedPlace.longitude,
        1
      );
      if (nearbyMachi.length === 0) {
        Alert.alert('エラー', '近くの街が見つかりません');
        return;
      }
      machiId = nearbyMachi[0]!.id;
    } catch (error) {
      console.error('最寄りの街の取得に失敗しました:', error);
      Alert.alert('エラー', '街の情報を取得できませんでした');
      return;
    }

    // スポット作成
    createSpot(
      {
        userId: user.id,
        mapId: data.mapId,
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
              // 画像キャッシュを無効化して再取得
              queryClient.invalidateQueries({ queryKey: ['spot-images', spotId] });
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
    userMaps,
    isMapsLoading,
    selectedMapId,
    setSelectedMapId,
  };
}
