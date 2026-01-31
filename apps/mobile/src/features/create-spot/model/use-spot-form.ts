/**
 * スポット作成フォームのビジネスロジック
 *
 * FSD: features/create-spot/model に配置
 * - データ送信ロジック
 * - 画像アップロード
 * - 画面遷移
 *
 * Google Places検索結果からのみスポット追加可能
 */

import { useState, useRef } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useSelectedPlaceStore,
  isPlaceSearchResult,
  isManualLocationInput,
} from '@/features/search-places';
import { useCreateSpot, useUpdateSpot } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { useMapStore, useUserMaps } from '@/entities/map';
import { useSpotLimit } from '@/entities/subscription';
import { useUpdateSpotTags } from '@/entities/tag';
import { uploadImage, STORAGE_BUCKETS, insertSpotImage, getSpotLocationInfo } from '@/shared/api/supabase';
import { queryClient, QUERY_KEYS } from '@/shared/api/query-client';
import type { SelectedImage } from '@/features/pick-images';
import { log } from '@/shared/config/logger';
import type { SpotColor } from '@/shared/config';
import type { ProseMirrorDoc } from '@/shared/types';
import type { UploadProgress } from './types';
import { useFirstPostTriggers } from './use-first-post-triggers';

export function useSpotForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const storeMapId = useMapStore((state) => state.selectedMapId);
  const selectedPlace = useSelectedPlaceStore((state) => state.selectedPlace);
  const draftThumbnailIndex = useSelectedPlaceStore((state) => state.draftThumbnailIndex);
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);
  const clearAllDraftData = useSelectedPlaceStore((state) => state.clearAllDraftData);
  const { mutate: createSpot, isPending: isCreating } = useCreateSpot();
  const isSubmittingRef = useRef(false);
  const { mutateAsync: updateSpot } = useUpdateSpot();
  const { mutateAsync: updateSpotTags } = useUpdateSpotTags();
  const spotLimit = useSpotLimit();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    current: 0,
    total: 0,
    status: 'idle',
  });

  // 初投稿トリガー（プッシュ通知許可・レビュー依頼）
  const { triggerPostActions } = useFirstPostTriggers();

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

  // Google Places検索結果でも手動入力でもない場合はエラー
  if (!isPlaceSearchResult(selectedPlace) && !isManualLocationInput(selectedPlace)) {
    return defaultReturn;
  }

  // 画像をアップロードするヘルパー関数（進捗状況を更新しながら）
  // 各画像のDBに保存されたIDを返す（アップロード失敗時はnull）
  const uploadSpotImages = async (spotId: string, images: SelectedImage[]) => {
    let uploaded = 0;
    let failed = 0;
    const uploadedImageIds: (string | null)[] = [];

    setUploadProgress({ current: 0, total: images.length, status: 'uploading' });

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
          // imagesテーブルに保存し、DBで生成されたIDを取得
          const insertedImage = await insertSpotImage({
            user_spot_id: spotId,
            cloud_path: result.data.url,
            local_path: image.uri,
            width: image.width,
            height: image.height,
            file_size: image.fileSize ?? null,
            order_index: i,
          });
          uploaded++;
          uploadedImageIds.push(insertedImage.id);
        } else {
          log.error('[useSpotForm] 画像アップロード失敗:', result.error);
          failed++;
          uploadedImageIds.push(null);
        }
      } catch (error) {
        log.error('[useSpotForm] 画像処理エラー:', error);
        failed++;
        uploadedImageIds.push(null);
      }

      // 進捗を更新
      setUploadProgress({ current: i + 1, total: images.length, status: 'uploading' });
    }

    setUploadProgress({ current: images.length, total: images.length, status: 'done' });
    return { uploaded, failed, uploadedImageIds };
  };

  const handleSubmit = async (data: {
    description: string;
    articleContent?: ProseMirrorDoc | null;
    tags: string[];
    images: SelectedImage[];
    mapId: string;
    spotColor: SpotColor;
    labelId?: string | null;
    spotName?: string; // 現在地/ピン刺し登録用のスポット名
    isPublic?: boolean; // スポットの公開/非公開設定
  }) => {
    // 二重送信ガード（getSpotLocationInfoのawait中にボタンが再タップされるのを防止）
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      isSubmittingRef.current = false;
      return;
    }

    if (!data.mapId) {
      Alert.alert('エラー', 'マップが選択されていません');
      isSubmittingRef.current = false;
      return;
    }

    // スポット数の上限チェック（プレミアム状態に応じた上限）
    const selectedMap = userMaps.find((m) => m.id === data.mapId);
    if (selectedMap && (selectedMap.spots_count ?? 0) >= spotLimit) {
      Alert.alert(
        'スポット数の上限',
        `1つのマップには最大${spotLimit}個までスポットを登録できます。\n別のマップを選択するか、既存のスポットを削除してください。`,
        [
          { text: 'OK' },
          {
            text: 'プレミアムに登録',
            onPress: () => router.push('/settings/premium'),
          },
        ]
      );
      isSubmittingRef.current = false;
      return;
    }

    // スポットの地理情報を取得（座標から都道府県・市区町村を判定）
    let prefectureId: string | null = null;
    let cityId: string | null = null;
    try {
      const locationInfo = await getSpotLocationInfo(
        selectedPlace.latitude,
        selectedPlace.longitude
      );
      prefectureId = locationInfo.prefectureId;
      cityId = locationInfo.cityId;
      if (!prefectureId) {
        log.info('[useSpotForm] 都道府県が特定できませんでした。prefecture_idなしで登録します');
      }
    } catch (error) {
      log.error('[useSpotForm] 地理情報の取得に失敗しました:', error);
      // エラーが発生しても続行（prefecture_id, city_idはnullのまま）
    }

    // スポット作成（Google Places検索結果か手動入力かで分岐）
    const isGooglePlace = isPlaceSearchResult(selectedPlace);

    createSpot(
      {
        userId: user.id,
        mapId: data.mapId,
        machiId: null, // machi_idは後で一括更新
        prefectureId,
        cityId,
        name: selectedPlace.name ?? data.description,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        googlePlaceId: isGooglePlace ? selectedPlace.googleData.placeId : null,
        googleFormattedAddress: isGooglePlace ? selectedPlace.formattedAddress : selectedPlace.formattedAddress,
        googleShortAddress: isGooglePlace ? selectedPlace.shortAddress : selectedPlace.shortAddress,
        googleTypes: isGooglePlace ? selectedPlace.category : [],
        googlePhoneNumber: isGooglePlace ? selectedPlace.googleData.internationalPhoneNumber : null,
        googleWebsiteUri: isGooglePlace ? selectedPlace.googleData.websiteUri : null,
        googleRating: isGooglePlace ? selectedPlace.googleData.rating : null,
        googleUserRatingCount: isGooglePlace ? selectedPlace.googleData.userRatingCount : null,
        description: data.description,
        articleContent: data.articleContent,
        spotColor: data.spotColor,
        labelId: data.labelId,
        // 現在地/ピン刺し登録用のスポット名
        spotName: data.spotName,
        // スポットの公開/非公開設定
        isPublic: data.isPublic,
      },
      {
        onSuccess: async (spotId) => {
          // タグを中間テーブルに保存
          if (data.tags.length > 0) {
            try {
              await updateSpotTags({ spotId, tagNames: data.tags });
              log.info('[useSpotForm] タグ保存完了:', data.tags);
            } catch (error) {
              log.error('[useSpotForm] タグ保存エラー:', error);
              // タグ保存失敗してもスポット自体は作成済み
            }
          }

          // 画像がある場合はアップロード
          if (data.images.length > 0) {
            try {
              const result = await uploadSpotImages(spotId, data.images);
              log.info('[useSpotForm] 画像アップロード完了:', `${result.uploaded}枚成功, ${result.failed}枚失敗`);
              // 画像キャッシュを無効化して再取得
              queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsImages(spotId) });

              // サムネイルが選択されている場合はthumbnail_image_idを設定
              if (draftThumbnailIndex !== null && result.uploadedImageIds[draftThumbnailIndex]) {
                const thumbnailImageId = result.uploadedImageIds[draftThumbnailIndex];
                try {
                  await updateSpot({ spotId, thumbnailImageId });
                  log.info('[useSpotForm] サムネイル画像ID設定完了:', thumbnailImageId);
                } catch (error) {
                  log.error('[useSpotForm] サムネイル画像ID設定エラー:', error);
                  // サムネイル設定失敗してもスポット自体は作成済み
                }
              }
            } catch (error) {
              log.error('[useSpotForm] 画像アップロードエラー:', error);
              // 画像アップロード失敗してもスポット自体は作成済み
            }
          }

          // 下書きデータをすべてクリア（ローカル画像も削除）
          await clearAllDraftData();

          Alert.alert('登録完了', 'スポットを登録しました', [
            {
              text: 'OK',
              onPress: async () => {
                log.debug('[useSpotForm] setJumpToSpotId呼び出し:', spotId);
                setJumpToSpotId(spotId);
                router.back();

                // 初投稿トリガー（プッシュ通知許可・レビュー依頼）
                // 画面遷移アニメーション完了後に実行
                InteractionManager.runAfterInteractions(() => {
                  log.info('[useSpotForm] Calling triggerPostActions after interactions');
                  triggerPostActions();
                });
              },
            },
          ]);
        },
        onError: (error) => {
          isSubmittingRef.current = false;
          log.error('[useSpotForm] スポット作成エラー:', error);
          Alert.alert('エラー', 'スポットの登録に失敗しました');
        },
      }
    );
  };

  return {
    placeData: selectedPlace,
    handleSubmit,
    isLoading: isSubmittingRef.current || isCreating || uploadProgress.status === 'uploading',
    uploadProgress,
    userMaps,
    isMapsLoading,
    selectedMapId,
    setSelectedMapId,
  };
}
