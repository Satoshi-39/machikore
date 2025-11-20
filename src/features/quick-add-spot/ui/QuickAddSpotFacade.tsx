/**
 * クイックスポット追加 Facadeコンポーネント
 *
 * Menu、Modal、useQuickAddSpotロジックを統合する窓口
 * MapPageから簡単に使えるようにする
 */

import React, { useEffect } from 'react';
import { QuickAddSpotMenu } from './QuickAddSpotMenu';
import { QuickAddSpotModal } from './QuickAddSpotModal';
import { PinModeOverlay } from './PinModeOverlay';
import { useQuickAddSpot } from '../model/useQuickAddSpot';
import type { LocationCoords } from '@/shared/lib/map/use-location';

interface QuickAddSpotFacadeProps {
  visible: boolean;
  userId: string | null;
  selectedMapId: string | null;
  defaultMapId: string | null;
  currentLocation: LocationCoords | null;
  centerCoords: { latitude: number; longitude: number };
  onClose: () => void;
  onPinModeChange: (isPinMode: boolean) => void;
  onMapTap: (handler: ((latitude: number, longitude: number) => void) | null) => void;
  onCancelPinMode: (handler: (() => void) | null) => void;
  onSearchRequest?: () => void;
}

export function QuickAddSpotFacade({
  visible,
  userId,
  selectedMapId,
  defaultMapId,
  currentLocation,
  centerCoords,
  onClose,
  onPinModeChange,
  onMapTap,
  onCancelPinMode,
  onSearchRequest,
}: QuickAddSpotFacadeProps) {
  const {
    isModalOpen,
    isPinMode,
    spotLocation,
    closeModal,
    handleCurrentLocation,
    handleMapPin,
    handleConfirmPin,
    cancelPinMode,
    handleSubmit,
  } = useQuickAddSpot({
    userId,
    selectedMapId,
    defaultMapId,
    currentLocation,
    onMenuClose: onClose, // メニューを閉じるコールバックを渡す
  });

  // ピンモードの変更を親に通知
  useEffect(() => {
    onPinModeChange(isPinMode);
  }, [isPinMode, onPinModeChange]);

  // 確定ハンドラーを親に渡す
  useEffect(() => {
    if (isPinMode) {
      // 座標を受け取ってLocationCoords形式に変換
      onMapTap((latitude, longitude) => handleConfirmPin({ latitude, longitude }));
    } else {
      onMapTap(null);
    }
  }, [isPinMode, handleConfirmPin, onMapTap]);

  // キャンセルハンドラーを親に渡す
  useEffect(() => {
    if (isPinMode) {
      onCancelPinMode(cancelPinMode);
    } else {
      onCancelPinMode(null);
    }
  }, [isPinMode, cancelPinMode, onCancelPinMode]);

  // ピンモード確定ハンドラー（centerCoordsを使用）
  const handlePinModeConfirm = () => {
    if (isPinMode) {
      console.log('📍 中央座標で確定:', centerCoords);
      handleConfirmPin(centerCoords);
    }
  };

  // 検索ハンドラー
  const handleSearch = () => {
    onClose(); // メニューを閉じる
    onSearchRequest?.(); // 親に検索リクエストを通知
  };

  return (
    <>
      {/* メニュー */}
      <QuickAddSpotMenu
        visible={visible}
        onClose={onClose}
        onCurrentLocation={handleCurrentLocation}
        onMapPin={handleMapPin}
        onSearch={handleSearch}
      />

      {/* ピンモードオーバーレイ */}
      <PinModeOverlay
        visible={isPinMode}
        onConfirm={handlePinModeConfirm}
        onCancel={cancelPinMode}
      />

      {/* スポット作成モーダル */}
      {spotLocation && (
        <QuickAddSpotModal
          visible={isModalOpen}
          latitude={spotLocation.latitude}
          longitude={spotLocation.longitude}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
