/**
 * クイックスポット追加のロジック
 *
 * メニュー・モーダルの状態管理とスポット作成処理を統合
 */

import { useState, useEffect } from 'react';
import { useCreateSpot } from '@/entities/spot';
import type { LocationCoords } from '@/shared/lib/map/use-location';

interface UseQuickAddSpotParams {
  userId: string | null;
  selectedMapId: string | null;
  defaultMapId: string | null;
  currentLocation: LocationCoords | null;
}

export function useQuickAddSpot({
  userId,
  selectedMapId,
  defaultMapId,
  currentLocation,
}: UseQuickAddSpotParams) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [spotLocation, setSpotLocation] = useState<LocationCoords | null>(null);
  const { mutate: createSpot, isPending, isError, error } = useCreateSpot();

  // エラーログ出力
  useEffect(() => {
    if (isError && error) {
      console.error('❌ スポット作成エラー:', error);
    }
  }, [isError, error]);

  // メニューを開く/閉じる
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setSpotLocation(null);
  };

  // 現在地でスポット追加
  const handleCurrentLocation = () => {
    closeMenu();

    if (!currentLocation) {
      console.warn('現在地が取得できていません');
      // TODO: エラートーストを表示
      return;
    }

    setSpotLocation(currentLocation);
    setIsModalOpen(true);
  };

  // ピン刺しモード
  const handleMapPin = () => {
    closeMenu();
    setIsPinMode(true);
    console.log('ピン刺しモード開始');
  };

  // マップタップでピン配置
  const handleMapPress = (latitude: number, longitude: number) => {
    if (isPinMode) {
      console.log('📍 ピン配置:', { latitude, longitude });
      setSpotLocation({ latitude, longitude });
      setIsModalOpen(true);
      setIsPinMode(false); // モーダルが開いたらピンモード終了
    }
  };

  // ピンモードキャンセル
  const cancelPinMode = () => {
    setIsPinMode(false);
    console.log('ピン刺しモードキャンセル');
  };

  // スポット作成
  const handleSubmit = (name: string, latitude: number, longitude: number) => {
    console.log('📍 スポット作成開始:', { name, latitude, longitude, userId, selectedMapId, defaultMapId });

    if (!userId) {
      console.error('❌ ユーザーが認証されていません');
      return;
    }

    // デフォルトマップの場合は、ユーザーのデフォルトマップIDを使用
    // カスタムマップの場合は、選択されているマップIDを使用
    const targetMapId = selectedMapId || defaultMapId;

    if (!targetMapId) {
      console.error('❌ マップが選択されていません');
      return;
    }

    // TODO: machiIdの決定ロジック（緯度経度から街を特定）
    // 仮で固定値を使用
    const machiId = 'temp-machi-id';

    console.log('✅ スポット作成実行:', { userId, mapId: targetMapId, machiId, name, latitude, longitude });

    createSpot(
      {
        userId,
        mapId: targetMapId,
        machiId,
        name,
        latitude,
        longitude,
      },
      {
        onSuccess: (spotId) => {
          console.log('🎉 スポット作成成功! spotId:', spotId);
          closeModal();
        },
        onError: (err) => {
          console.error('❌ スポット作成失敗:', err);
          // モーダルは閉じずにエラーを表示（将来的にはトーストなどで通知）
        },
      }
    );
  };

  return {
    isMenuOpen,
    isModalOpen,
    isPinMode,
    spotLocation,
    openMenu,
    closeMenu,
    closeModal,
    handleCurrentLocation,
    handleMapPin,
    handleMapPress,
    cancelPinMode,
    handleSubmit,
  };
}
