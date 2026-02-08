/**
 * 街の訪問記録情報表示（マップ用）
 *
 * features/machi: 「街を見る」機能の一部として訪問情報を表示
 * 訪問済み/未訪問をトグルするボタンを含む
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useCheckMachiVisited, useToggleVisit, useVisitInfo } from '@/entities/visit/api';
import type { UUID } from '@/shared/types';

interface MachiVisitInfoProps {
  userId: UUID;
  machiId: string;
}

export function MachiVisitInfo({ userId, machiId }: MachiVisitInfoProps) {
  const { t } = useI18n();
  const { data: isVisited, isLoading: isCheckingVisit } = useCheckMachiVisited(userId, machiId);
  const { data: visitInfo, isLoading: isLoadingInfo } = useVisitInfo(userId, machiId);
  const toggleVisitMutation = useToggleVisit();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleToggleVisit = useCallback(() => {
    if (toggleVisitMutation.isPending) return;
    toggleVisitMutation.mutate({ userId, machiId });
  }, [userId, machiId, toggleVisitMutation]);

  const isLoading = isCheckingVisit || isLoadingInfo;
  const isPending = toggleVisitMutation.isPending;

  if (isLoading) {
    return (
      <View className="bg-surface-variant rounded-lg p-3 items-center justify-center h-16">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }

  return (
    <View className="bg-surface-variant rounded-lg p-3">
      <View className="flex-row items-center justify-between">
        {/* 左側: 訪問ステータス */}
        <View className="flex-1">
          {isVisited ? (
            <>
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={iconSizeNum.md}
                  className="text-primary"
                />
                <Text className="text-sm font-semibold text-on-surface ml-2">
                  {t('visit.visited')}
                </Text>
              </View>
              {visitInfo?.visited_at && (
                <Text className="text-xs text-on-surface-variant ml-7">
                  {formatDate(visitInfo.visited_at)}
                </Text>
              )}
            </>
          ) : (
            <View className="flex-row items-center">
              <Ionicons
                name="footsteps-outline"
                size={iconSizeNum.md}
                className="text-on-surface-variant"
              />
              <Text className="text-sm text-on-surface-variant ml-2">
                {t('visit.notVisitedYet')}
              </Text>
            </View>
          )}
        </View>

        {/* 右側: トグルボタン */}
        <Pressable
          onPress={handleToggleVisit}
          disabled={isPending}
          className={`px-4 py-2 rounded-full ${
            isVisited
              ? 'bg-gray-200'
              : 'bg-primary'
          } ${isPending ? 'opacity-50' : ''}`}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={isVisited ? colors.light["on-surface-variant"] : 'white'} />
          ) : (
            <Text className={`text-sm font-medium ${isVisited ? 'text-on-surface-variant' : 'text-white'}`}>
              {isVisited ? t('visit.undo') : t('visit.markVisited')}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
