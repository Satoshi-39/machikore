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
    <View className="bg-surface dark:bg-dark-surface rounded-t-3xl shadow-2xl px-5 pt-6 pb-10">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-foreground dark:text-dark-foreground">
          マップを選択
        </Text>
        <TouchableOpacity
          onPress={close}
          className="w-8 h-8 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* マップ一覧 */}
      <ScrollView
        className="max-h-96"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : maps.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="map-outline" size={48} color="#D1D5DB" />
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
              マップがありません
            </Text>
            <Text className="text-foreground-muted dark:text-dark-foreground-muted text-sm mt-1">
              新しいマップを作成してください
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {maps.map((map) => (
              <TouchableOpacity
                key={map.id}
                onPress={() => handleSelectMap(map.id)}
                className="bg-background-secondary dark:bg-dark-background-secondary rounded-xl p-4 flex-row items-center active:bg-muted dark:bg-dark-muted"
                activeOpacity={0.7}
              >
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                  <Ionicons name="map" size={24} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
                    {map.name}
                  </Text>
                  {map.description && (
                    <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1" numberOfLines={1}>
                      {map.description}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
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
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
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
