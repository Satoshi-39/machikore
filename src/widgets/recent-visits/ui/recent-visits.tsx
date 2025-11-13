/**
 * 最近訪問した街ウィジェット
 *
 * 最近訪問した街を縦一覧で表示
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { VisitRow, MachiRow } from '@/shared/types/database.types';

interface RecentVisitsProps {
  visits: (VisitRow & { machi: MachiRow })[];
  onVisitPress?: (visit: VisitRow & { machi: MachiRow }) => void;
}

interface VisitCardProps {
  visit: VisitRow & { machi: MachiRow };
  onPress?: () => void;
}

function VisitCard({ visit, onPress }: VisitCardProps) {
  const visitDate = new Date(visit.visited_at);
  const formattedDate = `${visitDate.getMonth() + 1}/${visitDate.getDate()}`;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Ionicons name="location" size={20} color={colors.primary.DEFAULT} />
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {visit.machi.name}
        </Text>
        <Text className="text-sm text-gray-500">
          {visit.machi.line_name}
        </Text>
      </View>

      <Text className="text-sm text-gray-400 ml-2">
        {formattedDate}
      </Text>
    </Pressable>
  );
}

export function RecentVisits({ visits, onVisitPress }: RecentVisitsProps) {
  return (
    <View className="bg-white border-b border-gray-200 mt-2">
      <Text className="text-base font-semibold text-gray-900 px-4 py-3 border-b border-gray-100">
        最近訪問した街
      </Text>
      {visits.length === 0 ? (
        <View className="py-8 px-4">
          <Text className="text-sm text-gray-500 text-center">
            まだ街を訪問していません
          </Text>
        </View>
      ) : (
        <View>
          {visits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() => onVisitPress?.(visit)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
