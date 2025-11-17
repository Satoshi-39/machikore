/**
 * クイックスポット追加 統合コンポーネント
 *
 * MenuとModalを統合し、MapPageから簡単に使えるようにする
 */

import React, { useEffect } from 'react';
import { QuickAddSpotMenu } from './QuickAddSpotMenu';
import { QuickAddSpotModal } from './QuickAddSpotModal';
import { useQuickAddSpot } from '../model/useQuickAddSpot';
import type { LocationCoords } from '@/shared/lib/map/use-location';

interface QuickAddSpotFeatureProps {
  visible: boolean;
  userId: string | null;
  selectedMapId: string | null;
  defaultMapId: string | null;
  currentLocation: LocationCoords | null;
  onClose: () => void;
  onPinModeChange: (isPinMode: boolean) => void;
  onMapTap: (handler: ((latitude: number, longitude: number) => void) | null) => void;
}

export function QuickAddSpotFeature({
  visible,
  userId,
  selectedMapId,
  defaultMapId,
  currentLocation,
  onClose,
  onPinModeChange,
  onMapTap,
}: QuickAddSpotFeatureProps) {
  const {
    isModalOpen,
    isPinMode,
    spotLocation,
    closeModal,
    handleCurrentLocation,
    handleMapPin,
    handleMapPress,
    handleSubmit,
  } = useQuickAddSpot({
    userId,
    selectedMapId,
    defaultMapId,
    currentLocation,
  });

  // ピンモードの変更を親に通知
  useEffect(() => {
    onPinModeChange(isPinMode);
  }, [isPinMode, onPinModeChange]);

  // マップタップハンドラーを親に渡す
  useEffect(() => {
    if (isPinMode) {
      onMapTap(handleMapPress);
    } else {
      onMapTap(null);
    }
  }, [isPinMode, handleMapPress, onMapTap]);

  return (
    <>
      {/* メニュー */}
      <QuickAddSpotMenu
        visible={visible}
        onClose={onClose}
        onCurrentLocation={handleCurrentLocation}
        onMapPin={handleMapPin}
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
