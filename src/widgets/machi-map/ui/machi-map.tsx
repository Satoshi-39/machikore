/**
 * 街マップWidget - マップ表示専用
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useMachi } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';
import { MachiDetailCard } from './machi-detail-card';
import type { MachiRow } from '@/shared/types/database.types';

export function MachiMap() {
  const { data: stations, isLoading, error } = useMachi();
  const [selectedMachi, setSelectedMachi] = useState<MachiRow | null>(null);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={stations}
      loadingMessage="マップを読み込み中..."
      emptyMessage="街データがありません"
      emptyIcon="🗺️"
    >
      {(stations) => (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 35.6812, // 東京
              longitude: 139.7671,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {stations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude,
                }}
                title={station.name}
                description={station.line_name}
                onPress={() => setSelectedMachi(station)}
              />
            ))}
          </MapView>

          {/* 選択された街の詳細カード */}
          {selectedMachi && (
            <MachiDetailCard
              machi={selectedMachi}
              onClose={() => setSelectedMachi(null)}
            />
          )}
        </View>
      )}
    </AsyncBoundary>
  );
}
