/**
 * マップ選択ページ
 *
 * スポット作成時にマップを選択するページ
 */

import React from 'react';
import { MapSelectSheet } from '@/widgets/map-select-sheet';

interface SelectMapPageProps {
  onSelectMap: (mapId: string) => void;
  onCreateNewMap: () => void;
  onClose: () => void;
}

export function SelectMapPage({ onSelectMap, onCreateNewMap, onClose }: SelectMapPageProps) {
  return (
    <MapSelectSheet
      onSelectMap={onSelectMap}
      onCreateNewMap={onCreateNewMap}
      onClose={onClose}
    />
  );
}
