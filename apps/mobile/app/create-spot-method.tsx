/**
 * スポット追加方法選択ルート
 *
 * マップ選択 + 登録方法（検索/現在地/ピン刺し）を1画面で提供
 */

import React, { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as Crypto from 'expo-crypto';
import { AddSpotMethodPage } from '@/pages/create-spot-method';
import { useMapStore, useUserMaps } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useCurrentTab, useLocation } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import {
  useSelectedPlaceStore,
  type ManualLocationInput,
  reverseGeocode,
} from '@/features/search-places';

export default function CreateSpotMethodScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const currentTab = useCurrentTab();
  const user = useUserStore((state) => state.user);
  const storeSelectedMapId = useMapStore((state) => state.selectedMapId);
  const sourceTab = useMapStore((state) => state.sourceTab);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const { refetchLocation } = useLocation();

  const { data: maps = [] } = useUserMaps(user?.id ?? null, { currentUserId: user?.id });

  const [selectedMapId, setLocalSelectedMapId] = useState<string | null>(storeSelectedMapId);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const handleMapChange = (mapId: string) => {
    setLocalSelectedMapId(mapId);
    setSelectedMapId(mapId);
  };

  const handleCreateNewMap = () => {
    router.push('/create-map');
  };

  const tab = sourceTab ?? currentTab ?? 'home';

  const handleSearchMethod = () => {
    if (!selectedMapId) return;
    router.push(`/(tabs)/${tab}/maps/${selectedMapId}?openSearch=true` as Href);
  };

  const handleCurrentLocationMethod = async () => {
    if (!selectedMapId) return;
    setIsLocationLoading(true);
    try {
      const coords = await refetchLocation();
      if (!coords) {
        Toast.show({
          type: 'error',
          text1: t('createSpotMethod.locationError'),
        });
        return;
      }

      let shortAddress: string | null = null;
      let formattedAddress: string | null = null;
      try {
        const addresses = await reverseGeocode(coords.latitude, coords.longitude);
        if (addresses) {
          shortAddress = addresses.shortAddress;
          formattedAddress = addresses.formattedAddress;
        }
      } catch {
        // 住所取得に失敗しても位置情報だけで続行
      }

      const manualInput: ManualLocationInput = {
        id: Crypto.randomUUID(),
        name: null,
        shortAddress,
        formattedAddress,
        latitude: coords.latitude,
        longitude: coords.longitude,
        category: [],
        source: 'current_location',
      };

      setSelectedPlace(manualInput);
      router.push('/create-spot');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handlePinDropMethod = () => {
    if (!selectedMapId) return;
    router.push(`/(tabs)/${tab}/maps/${selectedMapId}?openPinDrop=true` as Href);
  };

  return (
    <AddSpotMethodPage
      maps={maps}
      selectedMapId={selectedMapId}
      onMapChange={handleMapChange}
      onCreateNewMap={handleCreateNewMap}
      onSearchMethod={handleSearchMethod}
      onCurrentLocationMethod={handleCurrentLocationMethod}
      onPinDropMethod={handlePinDropMethod}
      isLocationLoading={isLocationLoading}
    />
  );
}
