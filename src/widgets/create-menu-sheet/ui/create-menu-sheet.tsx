/**
 * 作成メニューシートWidget
 *
 * マップ、スポット、ブログの作成メニュー
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheet, useBottomSheet } from '@/widgets/bottom-sheet';

interface CreateMenuSheetProps {
  onCreateMap: () => void;
  onCreateSpot: () => void;
  onCreateBlog: () => void;
  onClose: () => void;
}

function CreateMenuContent({
  onCreateMap,
  onCreateSpot,
  onCreateBlog,
}: Omit<CreateMenuSheetProps, 'onClose'>) {
  const { close } = useBottomSheet();

  const handleCreateMap = () => {
    close();
    setTimeout(() => onCreateMap(), 300);
  };

  const handleCreateSpot = () => {
    close();
    setTimeout(() => onCreateSpot(), 300);
  };

  const handleCreateBlog = () => {
    close();
    setTimeout(() => onCreateBlog(), 300);
  };

  return (
    <View className="bg-white rounded-t-3xl shadow-2xl px-5 pt-8 pb-10">
      {/* メニュー */}
      <View className="flex-row justify-center gap-12">
        {/* マップ作成 */}
        <TouchableOpacity
          onPress={handleCreateMap}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="map" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-base font-semibold text-gray-800">
            マップ
          </Text>
        </TouchableOpacity>

        {/* スポット作成 */}
        <TouchableOpacity
          onPress={handleCreateSpot}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="location" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-base font-semibold text-gray-800">
            スポット
          </Text>
        </TouchableOpacity>

        {/* ブログ作成 */}
        <TouchableOpacity
          onPress={handleCreateBlog}
          className="items-center"
          activeOpacity={0.7}
        >
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="reader-outline" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-base font-semibold text-gray-800">
            ブログ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CreateMenuSheet({
  onCreateMap,
  onCreateSpot,
  onCreateBlog,
  onClose,
}: CreateMenuSheetProps) {
  return (
    <BottomSheet onClose={onClose}>
      <CreateMenuContent
        onCreateMap={onCreateMap}
        onCreateSpot={onCreateSpot}
        onCreateBlog={onCreateBlog}
      />
    </BottomSheet>
  );
}
