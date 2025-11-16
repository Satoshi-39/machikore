/**
 * デフォルトマップWidget - マスターデータのmachi表示
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useMachi } from '@/entities/machi';
import { AsyncBoundary } from '@/shared/ui';
import { DefaultMapDetailCard } from './default-map-detail-card';
import type { MachiRow } from '@/shared/types/database.types';

export function DefaultMap() {
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
          <Mapbox.MapView
            style={{ flex: 1 }}
            styleURL={Mapbox.StyleURL.Street}
          >
            <Mapbox.Camera
              zoomLevel={10}
              centerCoordinate={[139.7671, 35.6812]} // 東京
              animationDuration={0}
            />

            {/* マーカー表示 */}
            {stations.map((station) => (
              <Mapbox.PointAnnotation
                key={station.id}
                id={station.id}
                coordinate={[station.longitude, station.latitude]}
                onSelected={() => setSelectedMachi(station)}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#007AFF',
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                />
              </Mapbox.PointAnnotation>
            ))}
          </Mapbox.MapView>

          {/* 選択された街の詳細カード */}
          {selectedMachi && (
            <DefaultMapDetailCard
              machi={selectedMachi}
              onClose={() => setSelectedMachi(null)}
            />
          )}
        </View>
      )}
    </AsyncBoundary>
  );
}
