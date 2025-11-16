/**
 * 街の訪問記録情報表示（マップ用）
 *
 * features/machi: 「街を見る」機能の一部として訪問情報を表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useVisitByMachi } from '@/entities/visit/api';
import type { UUID } from '@/shared/types';

interface MachiVisitInfoProps {
  userId: UUID;
  machiId: string;
}

export function MachiVisitInfo({ userId, machiId }: MachiVisitInfoProps) {
  const { data: visit, isLoading } = useVisitByMachi(userId, machiId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (isLoading) {
    return null;
  }

  return (
    <View className="bg-gray-50 rounded-lg p-3">
      {visit ? (
        <>
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary.DEFAULT}
            />
            <Text className="text-sm font-semibold text-gray-900 ml-2">
              訪問済み（{visit.visit_count}回）
            </Text>
          </View>
          <Text className="text-xs text-gray-600 mb-1">
            最終訪問: {formatDate(visit.visited_at)}
          </Text>
          {visit.memo && (
            <Text className="text-sm text-gray-700 mt-2">
              メモ: {visit.memo}
            </Text>
          )}
        </>
      ) : (
        <View className="flex-row items-center">
          <Ionicons
            name="footsteps-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-2">
            まだ訪問していません
          </Text>
        </View>
      )}
    </View>
  );
}
