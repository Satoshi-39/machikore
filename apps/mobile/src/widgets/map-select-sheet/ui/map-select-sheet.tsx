/**
 * マップ選択シートWidget
 *
 * スポット作成時にマップを選択するためのボトムシート
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { BottomSheet, useBottomSheet } from '@/widgets/bottom-sheet';
import { useUserStore } from '@/entities/user';
import { useUserMaps } from '@/entities/map';

interface MapSelectSheetProps {
  onSelectMap: (mapId: string) => void;
  onCreateNewMap: () => void;
  onClose: () => void;
}

function MapSelectContent({
  onSelectMap,
  onCreateNewMap,
}: Omit<MapSelectSheetProps, 'onClose'>) {
  const user = useUserStore((state) => state.user);
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  // 自分のマップ一覧を取得（公開・非公開両方）
  const { data: userMaps = [], isLoading } = useUserMaps(user?.id ?? null, { currentUserId: user?.id });
  const maps = userMaps;
  const { close } = useBottomSheet();

  const handleSelectMap = (mapId: string) => {
    close();
    setTimeout(() => onSelectMap(mapId), 300);
  };

  const handleCreateNew = () => {
    close();
    setTimeout(() => onCreateNewMap(), 300);
  };

  return (
    <View className="bg-surface rounded-t-3xl shadow-2xl px-5 pt-6 pb-10">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-on-surface">
          マップを選択
        </Text>
        <TouchableOpacity
          onPress={close}
          className="w-8 h-8 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={iconSizeNum.xl} color={themeColors['on-surface-variant']} />
        </TouchableOpacity>
      </View>

      {/* マップ一覧 */}
      <ScrollView
        className="max-h-96"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color={colors.light.primary} />
          </View>
        ) : maps.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="map-outline" size={iconSizeNum['3xl']} color={themeColors['outline-variant']} />
            <Text className="text-on-surface-variant mt-4">
              マップがありません
            </Text>
            <Text className="text-on-surface-variant text-sm mt-1">
              新しいマップを作成してください
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {maps.map((map) => (
              <TouchableOpacity
                key={map.id}
                onPress={() => handleSelectMap(map.id)}
                className="bg-surface-variant rounded-xl p-4 flex-row items-center active:bg-secondary"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                  <Ionicons name="map" size={iconSizeNum.lg} color={colors.light['on-primary']} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-on-surface">
                    {map.name}
                  </Text>
                  {map.description && (
                    <Text className="text-sm text-on-surface-variant mt-1" numberOfLines={1}>
                      {map.description}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={iconSizeNum.md}
                  color={themeColors['on-surface-variant']}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 新規マップ作成ボタン */}
      <TouchableOpacity
        onPress={handleCreateNew}
        className="mt-6 bg-blue-500 rounded-xl p-4 flex-row items-center justify-center active:bg-blue-600"
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={iconSizeNum.lg} color={colors.light['on-primary']} />
        <Text className="text-white font-bold text-base ml-2">
          新規マップを作成
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function MapSelectSheet({
  onSelectMap,
  onCreateNewMap,
  onClose,
}: MapSelectSheetProps) {
  return (
    <BottomSheet onClose={onClose}>
      <MapSelectContent
        onSelectMap={onSelectMap}
        onCreateNewMap={onCreateNewMap}
      />
    </BottomSheet>
  );
}
