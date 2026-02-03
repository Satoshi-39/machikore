/**
 * マップ選択ドロップダウン
 *
 * ユーザーのマップ一覧からスポット追加先を選択するアコーディオン
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useBottomSheet } from '@/widgets/bottom-sheet';

import type { MapWithUser } from '@/shared/types/composite.types';

interface MapSelectorDropdownProps {
  maps: MapWithUser[];
  selectedMapId: string | null;
  onMapChange: (mapId: string) => void;
  onCreateNewMap: () => void;
}

export function MapSelectorDropdown({
  maps,
  selectedMapId,
  onMapChange,
  onCreateNewMap,
}: MapSelectorDropdownProps) {
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const { close } = useBottomSheet();
  const [isOpen, setIsOpen] = useState(false);

  const selectedMap = maps.find((m) => m.id === selectedMapId);

  const handleSelect = (mapId: string) => {
    onMapChange(mapId);
    setIsOpen(false);
  };

  const handleCreateNewMap = () => {
    close();
    setTimeout(() => onCreateNewMap(), 300);
  };

  return (
    <View className="mb-6" style={{ zIndex: 10 }}>
      <Text className="text-sm font-medium text-on-surface-variant mb-2">
        {t('createSpotMethod.selectMap')}
      </Text>

      {/* 選択ヘッダー */}
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between bg-surface-variant px-4 py-3"
        style={{
          borderWidth: 1,
          borderColor: themeColors.outline,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomLeftRadius: isOpen ? 0 : 12,
          borderBottomRightRadius: isOpen ? 0 : 12,
          borderBottomWidth: 1,
        }}
      >
        <Text
          className={selectedMap ? 'text-base text-on-surface' : 'text-base text-on-surface-variant'}
        >
          {selectedMap?.name ?? t('createSpotMethod.selectMapPlaceholder')}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={themeColors['on-surface-variant']}
        />
      </Pressable>

      {/* ドロップダウンリスト（absoluteで重ねて表示） */}
      {isOpen && (
        <View
          className="absolute left-0 right-0 bg-surface-variant overflow-hidden"
          style={{
            top: '100%',
            borderWidth: 1,
            borderColor: themeColors.outline,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            zIndex: 20,
            elevation: 5,
          }}
        >
          <ScrollView style={{ maxHeight: 240 }} nestedScrollEnabled>
            {maps.map((map) => (
              <Pressable
                key={map.id}
                onPress={() => handleSelect(map.id)}
                className="flex-row items-center px-4 py-3 border-b-thin border-outline"
                style={
                  map.id === selectedMapId
                    ? { backgroundColor: `${themeColors.primary}15` }
                    : undefined
                }
              >
                <Ionicons
                  name="map-outline"
                  size={20}
                  color={
                    map.id === selectedMapId
                      ? themeColors.primary
                      : themeColors['on-surface-variant']
                  }
                />
                <Text
                  className={
                    map.id === selectedMapId
                      ? 'flex-1 ml-3 text-base font-medium text-primary'
                      : 'flex-1 ml-3 text-base text-on-surface'
                  }
                  numberOfLines={1}
                >
                  {map.name}
                </Text>
                {map.id === selectedMapId && (
                  <Ionicons name="checkmark" size={20} color={themeColors.primary} />
                )}
              </Pressable>
            ))}

            {/* 新規マップを作成 */}
            <Pressable
              onPress={handleCreateNewMap}
              className="flex-row items-center px-4 py-3"
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={themeColors.primary}
              />
              <Text className="flex-1 ml-3 text-base font-medium text-primary">
                {t('createSpotMethod.createNewMap')}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
