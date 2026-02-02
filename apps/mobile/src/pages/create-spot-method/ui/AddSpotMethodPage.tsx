/**
 * スポット追加方法選択ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader } from '@/shared/ui';
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
}: AddSpotMethodPageProps) {
  const { t } = useI18n();

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('createSpotMethod.title')} />
      <AddSpotMethodContent
        maps={maps}
        selectedMapId={selectedMapId}
        onMapChange={onMapChange}
        onCreateNewMap={onCreateNewMap}
        onSearchMethod={onSearchMethod}
        onCurrentLocationMethod={onCurrentLocationMethod}
        onPinDropMethod={onPinDropMethod}
        isLocationLoading={isLocationLoading}
      />
    </View>
  );
}
