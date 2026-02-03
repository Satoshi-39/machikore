/**
 * スポット追加方法選択ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * BottomSheetでAddSpotMethodContentをラップ
 */

import React from 'react';
import { BottomSheet } from '@/widgets/bottom-sheet';
import { AddSpotMethodContent } from '@/widgets/create-spot-method';

import type { MapWithUser } from '@/shared/types/composite.types';

interface AddSpotMethodPageProps {
  maps: MapWithUser[];
  selectedMapId: string | null;
  onMapChange: (mapId: string) => void;
  onCreateNewMap: () => void;
  onSearchMethod: () => void;
  onCurrentLocationMethod: () => void;
  onPinDropMethod: () => void;
  isLocationLoading?: boolean;
  isSpotLimitChecking?: boolean;
  onClose: () => void;
}

export function AddSpotMethodPage({
  maps,
  selectedMapId,
  onMapChange,
  onCreateNewMap,
  onSearchMethod,
  onCurrentLocationMethod,
  onPinDropMethod,
  isLocationLoading,
  isSpotLimitChecking,
  onClose,
}: AddSpotMethodPageProps) {
  return (
    <BottomSheet onClose={onClose}>
      <AddSpotMethodContent
        maps={maps}
        selectedMapId={selectedMapId}
        onMapChange={onMapChange}
        onCreateNewMap={onCreateNewMap}
        onSearchMethod={onSearchMethod}
        onCurrentLocationMethod={onCurrentLocationMethod}
        onPinDropMethod={onPinDropMethod}
        isLocationLoading={isLocationLoading}
        isSpotLimitChecking={isSpotLimitChecking}
      />
    </BottomSheet>
  );
}
