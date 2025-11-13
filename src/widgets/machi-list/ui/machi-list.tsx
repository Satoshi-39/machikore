/**
 * 街リストWidget - 一覧表示専用
 */

import React, { useMemo } from 'react';
import { FlatList } from 'react-native';
import { useMachi } from '@/entities/machi';
import { useVisits } from '@/entities/visit/api';
import { useCurrentUserId } from '@/entities/user';
import { MachiCard } from '@/features/machi';
import { AsyncBoundary } from '@/shared/ui';

export function MachiList() {
  const currentUserId = useCurrentUserId();
  const { data: stations, isLoading, error } = useMachi();
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

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={stations}
      loadingMessage="街データを読み込み中..."
      emptyMessage="街データがありません"
      emptyIcon="🏘️"
    >
      {(stations) => (
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const visit = visitMap.get(item.id);
            return (
              <MachiCard
                station={item}
                isVisited={!!visit}
                visitCount={visit?.visit_count || 0}
              />
            );
          }}
          contentContainerClassName="p-4"
        />
      )}
    </AsyncBoundary>
  );
}
