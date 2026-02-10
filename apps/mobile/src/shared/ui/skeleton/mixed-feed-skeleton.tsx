/**
 * MixedFeedSkeleton - 混合フィードのスケルトン
 *
 * MapCard x 2 + SpotCard x 1 のパターンで構成
 */

import React from 'react';
import { View } from 'react-native';
import { MapCardSkeleton } from './map-card-skeleton';
import { SpotCardSkeleton } from './spot-card-skeleton';

export function MixedFeedSkeleton() {
  return (
    <View>
      <MapCardSkeleton />
      <MapCardSkeleton />
      <SpotCardSkeleton />
    </View>
  );
}
