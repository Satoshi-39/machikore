/**
 * 作成メニューシートWidget
 *
 * マップ、スポット、コレクションの作成メニュー
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, iconSizeNum } from '@/shared/config';
import { useCollectionLimitGuard } from '@/features/check-usage-limit';
import { useI18n } from '@/shared/lib/i18n';
import { BottomSheet, useBottomSheet } from '@/widgets/bottom-sheet';

interface CreateMenuSheetProps {
  onCreateMap: () => void;
  onCreateSpot: () => void;
  onCreateCollection: () => void;
  onClose: () => void;
}

function CreateMenuContent({
  onCreateMap,
  onCreateSpot,
  onCreateCollection,
}: Omit<CreateMenuSheetProps, 'onClose'>) {
  const { close } = useBottomSheet();
  const { t } = useI18n();
  const { checkCollectionLimit } = useCollectionLimitGuard();

  const handleCreateMap = () => {
    close();
    setTimeout(() => onCreateMap(), 300);
  };

  const handleCreateSpot = () => {
    close();
    setTimeout(() => onCreateSpot(), 300);
  };

  const handleCreateCollection = async () => {
    const canCreate = await checkCollectionLimit();
    if (!canCreate) return;
    close();
    setTimeout(() => onCreateCollection(), 300);
  };

  return (
    <View className="bg-surface rounded-t-3xl shadow-2xl px-5 pt-8 pb-10">
      {/* メニュー */}
      <View className="flex-row justify-center gap-12">
        {/* マップ作成 */}
        <TouchableOpacity
          onPress={handleCreateMap}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.light.primary }}>
            <Ionicons name="map" size={iconSizeNum['2xl']} color={colors.light['on-primary']} />
          </View>
          <Text className="text-base font-semibold text-on-surface">
            {t('create.map')}
          </Text>
        </TouchableOpacity>

        {/* スポット作成 */}
        <TouchableOpacity
          onPress={handleCreateSpot}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.light.primary }}>
            <Ionicons name="location-outline" size={iconSizeNum['2xl']} color={colors.light['on-primary']} />
          </View>
          <Text className="text-base font-semibold text-on-surface">
            {t('create.spot')}
          </Text>
        </TouchableOpacity>

        {/* コレクション作成 */}
        <TouchableOpacity
          onPress={handleCreateCollection}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.light.primary }}>
            <Ionicons name="grid" size={iconSizeNum['2xl']} color={colors.light['on-primary']} />
          </View>
          <Text className="text-base font-semibold text-on-surface">
            {t('create.collection')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CreateMenuSheet({
  onCreateMap,
  onCreateSpot,
  onCreateCollection,
  onClose,
}: CreateMenuSheetProps) {
  return (
    <BottomSheet onClose={onClose}>
      <CreateMenuContent
        onCreateMap={onCreateMap}
        onCreateSpot={onCreateSpot}
        onCreateCollection={onCreateCollection}
      />
    </BottomSheet>
  );
}
