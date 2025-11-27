/**
 * スポット作成フォームのビジネスロジック
 *
 * エラーハンドリング、データ送信、画面遷移を管理
 * Google Places検索結果 と 手動登録（現在地/ピン刺し）の両方に対応
 */

import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useSelectedPlaceStore,
  isPlaceSearchResult,
} from '@/features/search-places';
import { useCreateSpot } from '@/entities/spot';
import { useUserStore } from '@/entities/user';
import { useMapStore } from '@/entities/map';

export function useSpotForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const selectedPlace = useSelectedPlaceStore((state) => state.selectedPlace);
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);
  const { mutate: createSpot, isPending } = useCreateSpot();

  // データが存在しない場合は静かにnullを返す
  // （画面遷移途中の再レンダリングでアラートが表示されないようにする）
  if (!selectedPlace) {
    return { placeData: null, handleSubmit: () => {}, isLoading: false };
  }

  const handleSubmit = (data: {
    customName: string;
    description?: string;
    tags: string[];
  }) => {
    if (!user?.id) {
      Alert.alert('エラー', 'ユーザー情報が取得できません');
      return;
    }

    if (!selectedMapId) {
      Alert.alert('エラー', 'マップが選択されていません');
      return;
    }

    // TODO: 座標からmachiIdを取得する処理が必要
    // 仮実装：固定値を使用（後で修正）
    const machiId = 'temp-machi-id';

    // Google Places検索結果かどうかで分岐
    const isGooglePlace = isPlaceSearchResult(selectedPlace);

    // スポット作成
    createSpot(
      {
        userId: user.id,
        mapId: selectedMapId,
        machiId,
        name: selectedPlace.name ?? data.customName, // 手動登録の場合はcustomNameを使用
        address: selectedPlace.address,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        customName: data.customName,
        description: data.description,
        tags: data.tags,
        // Google Places情報（手動登録の場合はundefined）
        googlePlaceId: isGooglePlace ? selectedPlace.googleData.placeId : undefined,
        googleTypes: isGooglePlace ? selectedPlace.category : undefined,
        googlePhoneNumber: isGooglePlace ? selectedPlace.googleData.internationalPhoneNumber : undefined,
        googleWebsiteUri: isGooglePlace ? selectedPlace.googleData.websiteUri : undefined,
        googleRating: isGooglePlace ? selectedPlace.googleData.rating : undefined,
        googleUserRatingCount: isGooglePlace ? selectedPlace.googleData.userRatingCount : undefined,
      },
      {
        onSuccess: (spotId) => {
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
    isLoading: isPending,
  };
}
