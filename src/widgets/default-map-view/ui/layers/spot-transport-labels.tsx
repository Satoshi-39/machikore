/**
 * デフォルトマップ用の統合ラベルレイヤー
 *
 * スポットと交通データを同じShapeSourceにまとめることで、
 * symbolSortKeyによる優先度制御を実現し、スポットが交通データに隠れないようにする
 */

import React, { useMemo } from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point, Feature } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import type { TransportHubGeoJsonProperties } from '@/entities/transport-hub';
import {
  SPOT_CATEGORY_COLORS,
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  TRANSPORT_HUB_MIN_ZOOM_DEFAULT,
  SYMBOL_SORT_KEY,
} from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// スポット用アイコン（カテゴリ別）
const spotIcons = {
  'spot-food': require('@assets/icons/spot-food.png'),
  'spot-shopping': require('@assets/icons/spot-shopping.png'),
  'spot-tourism': require('@assets/icons/spot-tourism.png'),
  'spot-transit': require('@assets/icons/spot-transit.png'),
  'spot-other': require('@assets/icons/spot-other.png'),
};

// 交通機関アイコン
const trainJrIcon = require('@assets/icons/train.png');
const trainPrivateIcon = require('@assets/icons/train-private.png');
const subwayMetroIcon = require('@assets/icons/subway-metro.png');
const subwayToeiIcon = require('@assets/icons/subway-toei.png');
const subwayOtherIcon = require('@assets/icons/subway-other.png');
const airportIcon = require('@assets/icons/airport.png');
const busIcon = require('@assets/icons/bus.png');
const ferryIcon = require('@assets/icons/ferry.png');
const trainJrDarkIcon = require('@assets/icons/train-jr-dark.png');

interface SpotProperties {
  id: string;
  name: string;
  category: SpotCategory;
}

// 統合GeoJSONのプロパティ型
interface CombinedProperties {
  // 共通
  id: string;
  name: string;
  featureType: 'spot' | 'transport';
  sortKey: number;
  // スポット用
  category?: SpotCategory;
  // 交通機関用
  type?: 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';
  subtype?: string | null;
}

interface SpotTransportLabelsProps {
  spotsGeoJson: FeatureCollection<Point, SpotProperties>;
  transportGeoJson: FeatureCollection<Point, TransportHubGeoJsonProperties>;
  onSpotPress: (event: any) => void;
  /** 選択中のスポットID（選択中は常に表示） */
  selectedSpotId?: string | null;
}

export function SpotTransportLabels({
  spotsGeoJson,
  transportGeoJson,
  onSpotPress,
  selectedSpotId,
}: SpotTransportLabelsProps) {
  const isDarkMode = useIsDarkMode();
  const transportColors = isDarkMode ? TRANSPORT_HUB_COLORS_DARK : TRANSPORT_HUB_COLORS_LIGHT;
  const transportHaloColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const spotHaloColor = '#FFFFFF';

  // スポットと交通データを統合したGeoJSONを作成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, CombinedProperties> => {
    const spotFeatures: Feature<Point, CombinedProperties>[] = spotsGeoJson.features.map((f) => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        id: f.properties.id,
        name: f.properties.name,
        featureType: 'spot' as const,
        sortKey: SYMBOL_SORT_KEY.spot,
        category: f.properties.category,
      },
    }));

    const transportFeatures: Feature<Point, CombinedProperties>[] = transportGeoJson.features.map((f) => {
      let sortKey: number = SYMBOL_SORT_KEY.station;
      if (f.properties.type === 'airport') sortKey = SYMBOL_SORT_KEY.airport;
      else if (f.properties.type === 'ferry_terminal') sortKey = SYMBOL_SORT_KEY.ferry;
      else if (f.properties.type === 'bus_terminal') sortKey = SYMBOL_SORT_KEY.bus;

      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          id: f.properties.id,
          name: f.properties.name,
          featureType: 'transport' as const,
          sortKey,
          type: f.properties.type,
          subtype: f.properties.subtype,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features: [...spotFeatures, ...transportFeatures],
    };
  }, [spotsGeoJson, transportGeoJson]);

  // データがない場合はレンダリングしない
  if (combinedGeoJson.features.length === 0) {
    return null;
  }

  return (
    <>
      {/* 全アイコン画像を登録 */}
      <Mapbox.Images images={{
        ...spotIcons,
        'train-jr-icon': isDarkMode ? trainJrDarkIcon : trainJrIcon,
        'train-private-icon': trainPrivateIcon,
        'subway-metro-icon': subwayMetroIcon,
        'subway-toei-icon': subwayToeiIcon,
        'subway-other-icon': subwayOtherIcon,
        'airport-icon': airportIcon,
        'bus-icon': busIcon,
        'ferry-icon': ferryIcon,
      }} />

      <Mapbox.ShapeSource
        id="spot-transport-source"
        shape={combinedGeoJson}
        onPress={onSpotPress}
      >
        {/* ========== スポットレイヤー（カテゴリ別） ========== */}

        {/* 飲食店系 - アイコン + テキストオレンジ */}
        <Mapbox.SymbolLayer
          id="default-spots-food"
          minZoomLevel={13}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'food'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'food']]
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'spot-food',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.food,
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* ショッピング系 - アイコン + テキスト紫 */}
        <Mapbox.SymbolLayer
          id="default-spots-shopping"
          minZoomLevel={13}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'shopping'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'shopping']]
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'spot-shopping',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.shopping,
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 公園・観光地系 - アイコン + テキスト緑 */}
        <Mapbox.SymbolLayer
          id="default-spots-tourism"
          minZoomLevel={13}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'tourism'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'tourism']]
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'spot-tourism',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.tourism,
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 交通系 - アイコン + テキスト青 */}
        <Mapbox.SymbolLayer
          id="default-spots-transit"
          minZoomLevel={13}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'transit'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'transit']]
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'spot-transit',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.transit,
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* その他 - アイコン + テキスト薄紫 */}
        <Mapbox.SymbolLayer
          id="default-spots-other"
          minZoomLevel={13}
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'other'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'category'], 'other']]
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'spot-other',
            iconSize: 0.18,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: SPOT_CATEGORY_COLORS.other,
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* ========== 交通機関レイヤー ========== */}

        {/* JR駅 */}
        <Mapbox.SymbolLayer
          id="default-transport-jr"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'station'],
            ['==', ['get', 'subtype'], 'jr'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'train-jr-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_jr,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 東京メトロ */}
        <Mapbox.SymbolLayer
          id="default-transport-metro"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'station'],
            ['==', ['get', 'subtype'], 'metro'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'subway-metro-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_metro,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 都営 */}
        <Mapbox.SymbolLayer
          id="default-transport-toei"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'station'],
            ['==', ['get', 'subtype'], 'toei'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'subway-toei-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_toei,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* その他地下鉄 */}
        <Mapbox.SymbolLayer
          id="default-transport-subway"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'station'],
            ['==', ['get', 'subtype'], 'subway'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'subway-other-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_subway,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 私鉄 */}
        <Mapbox.SymbolLayer
          id="default-transport-private"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'station'],
            ['==', ['get', 'subtype'], 'private'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'train-private-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_private,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* 空港 */}
        <Mapbox.SymbolLayer
          id="default-transport-airport"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.airport}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'airport'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'airport-icon',
            iconSize: 0.18,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 14,
            textColor: transportColors.airport,
            textHaloColor: transportHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* フェリーターミナル */}
        <Mapbox.SymbolLayer
          id="default-transport-ferry"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.ferry}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'ferry_terminal'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'ferry-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.ferry_terminal,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* バスターミナル */}
        <Mapbox.SymbolLayer
          id="default-transport-bus"
          minZoomLevel={TRANSPORT_HUB_MIN_ZOOM_DEFAULT.bus}
          filter={['all',
            ['==', ['get', 'featureType'], 'transport'],
            ['==', ['get', 'type'], 'bus_terminal'],
          ]}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'bus-icon',
            iconSize: 0.13,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 11,
            textColor: transportColors.bus_terminal,
            textHaloColor: transportHaloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

        {/* ========== 選択中スポットレイヤー（最後に描画して最前面に） ========== */}
        <Mapbox.SymbolLayer
          id="default-spots-selected"
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'id'], selectedSpotId]]
            : ['==', 'dummy', 'never-match']
          }
          style={{
            symbolSortKey: 0, // 最優先
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
            textHaloColor: spotHaloColor,
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
