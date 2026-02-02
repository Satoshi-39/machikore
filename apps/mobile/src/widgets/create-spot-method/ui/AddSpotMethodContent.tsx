/**
 * スポット追加方法コンテンツ
 *
 * マップ選択 + 3つの登録方法カードを組み合わせるWidget
 */

import React from 'react';
import { View } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';

import type { MapWithUser } from '@/shared/types/composite.types';
import { MapSelectorDropdown } from './MapSelectorDropdown';
import { MethodCard } from './MethodCard';

interface AddSpotMethodContentProps {
  maps: MapWithUser[];
  selectedMapId: string | null;
  onMapChange: (mapId: string) => void;
  onCreateNewMap: () => void;
  onSearchMethod: () => void;
  onCurrentLocationMethod: () => void;
  onPinDropMethod: () => void;
  isLocationLoading?: boolean;
}

export function AddSpotMethodContent({
  maps,
  selectedMapId,
  onMapChange,
  onCreateNewMap,
  onSearchMethod,
  onCurrentLocationMethod,
  onPinDropMethod,
  isLocationLoading = false,
}: AddSpotMethodContentProps) {
  const { t } = useI18n();
  const isMapSelected = selectedMapId != null;

  return (
    <View className="flex-1 px-4 pt-4">
      <MapSelectorDropdown
        maps={maps}
        selectedMapId={selectedMapId}
        onMapChange={onMapChange}
        onCreateNewMap={onCreateNewMap}
      />

      <View className="gap-3">
        <MethodCard
          icon="search-outline"
          title={t('createSpotMethod.searchMethod')}
          description={t('createSpotMethod.searchMethodDesc')}
          onPress={onSearchMethod}
          disabled={!isMapSelected}
        />

        <MethodCard
          icon="navigate-outline"
          title={t('createSpotMethod.currentLocationMethod')}
          description={t('createSpotMethod.currentLocationMethodDesc')}
          onPress={onCurrentLocationMethod}
          disabled={!isMapSelected}
          loading={isLocationLoading}
        />

        <MethodCard
          icon="pin-outline"
          title={t('createSpotMethod.pinDropMethod')}
          description={t('createSpotMethod.pinDropMethodDesc')}
          onPress={onPinDropMethod}
          disabled={!isMapSelected}
        />
      </View>
    </View>
  );
}
