/**
 * クイックスポット追加 統合コンポーネント
 *
 * MenuとModalを統合し、MapPageから簡単に使えるようにする
 */

import React from 'react';
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
}

export function QuickAddSpotFeature({
  visible,
  userId,
  selectedMapId,
  defaultMapId,
  currentLocation,
  onClose,
}: QuickAddSpotFeatureProps) {
  const {
    isModalOpen,
    spotLocation,
    closeModal,
    handleCurrentLocation,
    handleMapPin,
    handleSubmit,
  } = useQuickAddSpot({
    userId,
    selectedMapId,
    defaultMapId,
    currentLocation,
  });

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
