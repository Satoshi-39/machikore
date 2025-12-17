/**
 * スポットラベルレイヤー（アイコン + テキスト、カテゴリ別色分け）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import type { MasterSpotDisplay } from '@/shared/api/supabase/master-spots';
import { SPOT_CATEGORY_COLORS } from '@/shared/config';
import type { MapboxOnPressEvent } from '@/shared/types/common.types';

// カテゴリ別アイコン画像
const spotIcons = {
  'spot-food': require('@assets/icons/spot-food.png'),
  'spot-shopping': require('@assets/icons/spot-shopping.png'),
  'spot-tourism': require('@assets/icons/spot-tourism.png'),
  'spot-transit': require('@assets/icons/spot-transit.png'),
  'spot-other': require('@assets/icons/spot-other.png'),
};

interface SpotLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; category: SpotCategory }>;
  spotMap?: Map<string, MasterSpotDisplay>;
  onPress?: (spot: MasterSpotDisplay) => void;
  /** 選択中のスポットID（選択中は常に表示） */
  selectedSpotId?: string | null;
  /** お気に入りフィルターが適用されているか（trueの場合はズーム制限なし） */
  isFavoriteFilter?: boolean;
}

export function SpotLabels({ geoJson, spotMap, onPress, selectedSpotId, isFavoriteFilter = false }: SpotLabelsProps) {
  // お気に入りフィルター時はズーム制限なし、通常時はズーム13以上
  const minZoom = isFavoriteFilter ? 0 : 13;

  const handlePress = (event: MapboxOnPressEvent) => {
    const feature = event.features?.[0];
    if (!feature || !onPress || !spotMap) return;

    const spotId = feature.properties?.id as string | undefined;
    if (spotId) {
      const spot = spotMap.get(spotId);
      if (spot) {
        onPress(spot);
      }
    }
  };

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={spotIcons} />

      <Mapbox.ShapeSource
        id="master-spots-source"
        shape={geoJson}
        onPress={handlePress}
      >
        {/* 飲食店系 - アイコン + テキストオレンジ */}
        <Mapbox.SymbolLayer
          id="master-spots-food"
          minZoomLevel={minZoom}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'category'], 'food'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'category'], 'food']
          }
          style={{
            iconImage: 'spot-food',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.food,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* ショッピング系 - アイコン + テキスト紫 */}
        <Mapbox.SymbolLayer
          id="master-spots-shopping"
          minZoomLevel={minZoom}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'category'], 'shopping'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'category'], 'shopping']
          }
          style={{
            iconImage: 'spot-shopping',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.shopping,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* 公園・観光地系 - アイコン + テキスト緑 */}
        <Mapbox.SymbolLayer
          id="master-spots-tourism"
          minZoomLevel={minZoom}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'category'], 'tourism'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'category'], 'tourism']
          }
          style={{
            iconImage: 'spot-tourism',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.tourism,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* 交通系 - アイコン + テキスト青 */}
        <Mapbox.SymbolLayer
          id="master-spots-transit"
          minZoomLevel={minZoom}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'category'], 'transit'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'category'], 'transit']
          }
          style={{
            iconImage: 'spot-transit',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.transit,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* その他 - アイコン + テキスト薄紫 */}
        <Mapbox.SymbolLayer
          id="master-spots-other"
          minZoomLevel={minZoom}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'category'], 'other'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'category'], 'other']
          }
          style={{
            iconImage: 'spot-other',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.other,
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />

        {/* 選択中のスポット（常に優先表示） */}
        <Mapbox.SymbolLayer
          id="selected-master-spot"
          filter={selectedSpotId
            ? ['==', ['get', 'id'], selectedSpotId]
            : ['==', 'dummy', 'never-match']
          }
          style={{
            iconImage: [
              'match',
              ['get', 'category'],
              'food', 'spot-food',
              'shopping', 'spot-shopping',
              'tourism', 'spot-tourism',
              'transit', 'spot-transit',
              'spot-other',
            ],
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: [
              'match',
              ['get', 'category'],
              'food', SPOT_CATEGORY_COLORS.food,
              'shopping', SPOT_CATEGORY_COLORS.shopping,
              'tourism', SPOT_CATEGORY_COLORS.tourism,
              'transit', SPOT_CATEGORY_COLORS.transit,
              SPOT_CATEGORY_COLORS.other,
            ],
            textHaloColor: '#FFFFFF',
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: true,
            iconAllowOverlap: true,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}
