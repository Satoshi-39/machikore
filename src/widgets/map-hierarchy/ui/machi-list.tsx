/**
 * 街一覧Widget
 */

import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useMachiHierarchy } from '@/entities/machi';
import { useVisits } from '@/entities/visit/api';
import { useCurrentUserId } from '@/entities/user';
import { MachiCard } from '@/features/machi';
import { AsyncBoundary } from '@/shared/ui';

interface MachiListProps {
  region: string;
  prefectureId: string;
  cityId: string;
}

export function MachiList({
  region,
  prefectureId,
  cityId,
}: MachiListProps) {
  const currentUserId = useCurrentUserId();
  const { data: hierarchy, isLoading, error } = useMachiHierarchy();
  const { data: visits } = useVisits(currentUserId);

  // 街IDから訪問情報へのマップを作成
  const visitMap = useMemo(() => {
    if (!visits) return new Map();
    const map = new Map();
    visits.forEach((visit) => {
      map.set(visit.machi_id, visit);
    });
    return map;
  }, [visits]);

  // 指定された市区町村のデータを取得
  const regionData = hierarchy?.find((r) => r.region === region);
  const prefectureData = regionData?.prefectures.find(
    (p) => p.prefecture.id === prefectureId
  );
  const cityData = prefectureData?.cities.find((c) => c.city.id === cityId);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={cityData}
      loadingMessage="街データを読み込み中..."
      emptyMessage="街データがありません"
      emptyIcon="🏙️"
    >
      {(cityData) => (
        <ScrollView className="flex-1 bg-gray-100 px-4 py-2">
            {cityData.machis.map((machi) => {
              const visit = visitMap.get(machi.id);
              return (
                <View key={machi.id} className="mb-2">
                  <MachiCard
                    station={machi}
                    isVisited={!!visit}
                    visitCount={visit?.visit_count ?? 0}
                  />
                </View>
              );
            })}
        </ScrollView>
      )}
    </AsyncBoundary>
  );
}
