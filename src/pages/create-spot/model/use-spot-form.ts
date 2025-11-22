/**
 * スポット作成フォームのビジネスロジック
 *
 * エラーハンドリング、データ送信、画面遷移を管理
 */

import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelectedPlaceStore } from '@/features/search-places';
import { useCreateSpot } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { useMapStore } from '@/entities/user-map';

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

    // スポット作成
    createSpot(
      {
        userId: user.id,
        mapId: selectedMapId,
        machiId,
        name: selectedPlace.name,
        address: selectedPlace.address,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        customName: data.customName,
        description: data.description,
        tags: data.tags,
        googlePlaceId: selectedPlace.googleData.placeId,
        googleTypes: selectedPlace.category,
        googlePhoneNumber: selectedPlace.googleData.internationalPhoneNumber,
        googleWebsiteUri: selectedPlace.googleData.websiteUri,
        googleRating: selectedPlace.googleData.rating,
        googleUserRatingCount: selectedPlace.googleData.userRatingCount,
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
