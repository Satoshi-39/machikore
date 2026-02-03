/**
 * スポット追加方法コンテンツ
 *
 * マップ選択 + 3つの登録方法カードを組み合わせるWidget
 * BottomSheet内に表示される
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useBottomSheet } from '@/widgets/bottom-sheet';

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
  isSpotLimitChecking?: boolean;
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
  isSpotLimitChecking = false,
}: AddSpotMethodContentProps) {
  const { t } = useI18n();
  const { close } = useBottomSheet();
  const { bottom } = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const isMapSelected = selectedMapId != null;
  const isDisabled = !isMapSelected || isSpotLimitChecking;

  const handleSearchMethod = () => {
    close();
    setTimeout(() => onSearchMethod(), 300);
  };

  const handleCurrentLocationMethod = () => {
    close();
    setTimeout(() => onCurrentLocationMethod(), 300);
  };

  const handlePinDropMethod = () => {
    close();
    setTimeout(() => onPinDropMethod(), 300);
  };

  return (
    <View
      className="bg-surface rounded-t-3xl shadow-2xl px-5 pt-6"
      style={{ paddingBottom: bottom + 24 }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-on-surface">
          {t('createSpotMethod.title')}
        </Text>
        <TouchableOpacity
          onPress={close}
          className="w-8 h-8 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name="close"
            size={iconSizeNum['2xl']}
            color={themeColors['on-surface-variant']}
          />
        </TouchableOpacity>
      </View>

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
          onPress={handleSearchMethod}
          disabled={isDisabled}
        />

        <MethodCard
          icon="navigate-outline"
          title={t('createSpotMethod.currentLocationMethod')}
          description={t('createSpotMethod.currentLocationMethodDesc')}
          onPress={handleCurrentLocationMethod}
          disabled={isDisabled}
          loading={isLocationLoading}
        />

        <MethodCard
          icon="pin-outline"
          title={t('createSpotMethod.pinDropMethod')}
          description={t('createSpotMethod.pinDropMethodDesc')}
          onPress={handlePinDropMethod}
          disabled={isDisabled}
        />
      </View>
    </View>
  );
}
