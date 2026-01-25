/**
 * 街エンティティ - 基本的な表示コンポーネント
 *
 * FSDの原則：Entities層は純粋なデータ表示のみ
 * ユーザーアクション（クリックなど）は含まない
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { MachiRow } from '@/shared/types/database.types';

interface MachiProps {
  machi: MachiRow;
  isVisited?: boolean;
  visitCount?: number;
}

export function Machi({ machi, isVisited = false, visitCount = 0 }: MachiProps) {
  return (
    <View
      className={`flex-row items-center p-4 mb-2 rounded-xl shadow-sm ${
        isVisited ? 'bg-surface' : 'bg-surface-variant'
      }`}
      style={{
        borderWidth: isVisited ? 2 : 1,
        borderColor: isVisited ? colors.primary.DEFAULT : colors.gray[200],
      }}
    >
      <View className={`w-10 h-10 rounded-full justify-center items-center mr-3 ${
        isVisited ? 'bg-blue-50' : 'bg-secondary'
      }`}>
        <Text className="text-xl">🏘️</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className={`text-base font-semibold ${
            isVisited ? 'text-on-surface' : 'text-on-surface-variant'
          }`}>
            {machi.name}
          </Text>
          {isVisited && (
            <View className="ml-2">
              <Ionicons name="checkmark-circle" size={18} color={colors.primary.DEFAULT} />
            </View>
          )}
        </View>
        {isVisited && visitCount > 0 && (
          <Text className="text-xs text-blue-600 mt-0.5 font-medium">
            {visitCount}回訪問
          </Text>
        )}
      </View>
      <Text className="text-xs text-on-surface-variant">{machi.prefecture_name}</Text>
    </View>
  );
}
