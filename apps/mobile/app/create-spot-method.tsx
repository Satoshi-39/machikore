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
import { useLocation } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import {
  useSelectedPlaceStore,
  type ManualLocationInput,
  reverseGeocode,
} from '@/features/search-places';
import { useSpotLimitGuard } from '@/features/check-usage-limit';

export default function CreateSpotMethodScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const user = useUserStore((state) => state.user);
  const storeSelectedMapId = useMapStore((state) => state.selectedMapId);
  const sourceTab = useMapStore((state) => state.sourceTab);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const setPendingMapAction = useMapStore((state) => state.setPendingMapAction);
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  const { refetchLocation } = useLocation();

  const { data: maps = [] } = useUserMaps(user?.id ?? null, { currentUserId: user?.id });

  const [selectedMapId, setLocalSelectedMapId] = useState<string | null>(storeSelectedMapId);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // スポット上限チェック
  const { checkSpotLimit, isChecking: isSpotLimitChecking } = useSpotLimitGuard();

  const handleMapChange = (mapId: string) => {
    setLocalSelectedMapId(mapId);
    setSelectedMapId(mapId);
  };

  const handleCreateNewMap = () => {
    router.push('/create-map');
  };

  // sourceTab が未設定の場合のフォールバック（通常は呼び出し元でセット済み）
  const tab = sourceTab ?? 'home';

  /**
   * マップに遷移してアクションを実行する共通処理
   *
   * 1. pendingMapAction をストアにセット（UserMapPage の useFocusEffect で処理）
   * 2. dismissAll() で全モーダルを閉じる（create-menu + create-spot-method）
   * 3. navigate() でタブを初期化（indexがスタック底に入る）
   * 4. push() でマップに遷移（タブスタック上にマップを積む）
   *
   * dismissAll() 後に直接 navigate(tab/maps/xxx) すると、タブスタックが
   * [maps/xxx] のみで初期化され、戻るボタンで白画面になる問題があるため、
   * navigate(tab) → push(tab/maps/xxx) の2段階で遷移する。
   */
  const navigateToMapWithAction = (action: 'openSearch' | 'openPinDrop') => {
    if (!selectedMapId) return;
    setPendingMapAction({ type: action, mapId: selectedMapId });
    if (router.canDismiss()) router.dismissAll();
    router.navigate(`/(tabs)/${tab}` as Href);
    setTimeout(() => {
      router.push(`/(tabs)/${tab}/maps/${selectedMapId}` as Href);
    }, 100);
  };

  const handleSearchMethod = async () => {
    if (!selectedMapId) return;
    if (!(await checkSpotLimit(selectedMapId))) return;
    navigateToMapWithAction('openSearch');
  };

  const handleCurrentLocationMethod = async () => {
    if (!selectedMapId) return;
    if (!(await checkSpotLimit(selectedMapId))) return;
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
      // モーダルを全て閉じてタブを初期化してからcreate-spotに遷移
      if (router.canDismiss()) router.dismissAll();
      router.navigate(`/(tabs)/${tab}` as Href);
      setTimeout(() => {
        router.push('/create-spot');
      }, 100);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handlePinDropMethod = async () => {
    if (!selectedMapId) return;
    if (!(await checkSpotLimit(selectedMapId))) return;
    navigateToMapWithAction('openPinDrop');
  };

  const handleClose = () => {
    router.dismiss();
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
      isSpotLimitChecking={isSpotLimitChecking}
      onClose={handleClose}
    />
  );
}
