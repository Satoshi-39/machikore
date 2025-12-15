/**
 * ユーザマップ専用の統合ラベルレイヤー
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
  USER_MAP_THEME_COLORS,
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  SYMBOL_SORT_KEY_USER_MAP,
  LABEL_ZOOM_USER_MAP,
  LOCATION_LABEL_COLORS_LIGHT,
  LOCATION_LABEL_COLORS_DARK,
  type UserMapThemeColor,
} from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// スポット用アイコン
const mapSpotIcons = {
  pink: require('@assets/icons/map-spot-pink.png'),
  red: require('@assets/icons/map-spot-red.png'),
  orange: require('@assets/icons/map-spot-orange.png'),
  yellow: require('@assets/icons/map-spot-yellow.png'),
  green: require('@assets/icons/map-spot-green.png'),
  blue: require('@assets/icons/map-spot-blue.png'),
  purple: require('@assets/icons/map-spot-purple.png'),
  gray: require('@assets/icons/map-spot-gray.png'),
  white: require('@assets/icons/map-spot-white.png'),
};

const mapSpotOutlinedIcons = {
  gray: require('@assets/icons/map-spot-gray-outlined.png'),
  white: require('@assets/icons/map-spot-white-outlined.png'),
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

interface LocationFeatureProperties {
  id: string;
  name: string;
}

// 統合GeoJSONのプロパティ型
interface CombinedProperties {
  // 共通
  id: string;
  name: string;
  featureType: 'spot' | 'transport' | 'city' | 'prefecture';
  sortKey: number;
  // スポット用
  category?: SpotCategory;
  // 交通機関用
  type?: 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';
  subtype?: string | null;
}

interface UserMapLabelsProps {
  spotsGeoJson: FeatureCollection<Point, SpotProperties>;
  transportGeoJson: FeatureCollection<Point, TransportHubGeoJsonProperties>;
  /** 都道府県GeoJSON */
  prefecturesGeoJson?: FeatureCollection<Point, LocationFeatureProperties>;
  /** 市区町村GeoJSON */
  citiesGeoJson?: FeatureCollection<Point, LocationFeatureProperties>;
  onSpotPress: (event: any) => void;
  themeColor?: UserMapThemeColor;
  /** 選択中のスポットID（選択中は常に表示） */
  selectedSpotId?: string | null;
}

export function UserMapLabels({
  spotsGeoJson,
  transportGeoJson,
  prefecturesGeoJson,
  citiesGeoJson,
  onSpotPress,
  themeColor = 'pink',
  selectedSpotId,
}: UserMapLabelsProps) {
  const isDarkMode = useIsDarkMode();
  const themeConfig = USER_MAP_THEME_COLORS[themeColor] ?? USER_MAP_THEME_COLORS.pink;
  const spotColor = themeConfig.color;
  const spotHaloColor = isDarkMode ? themeConfig.haloDark : themeConfig.haloLight;
  const transportColors = isDarkMode ? TRANSPORT_HUB_COLORS_DARK : TRANSPORT_HUB_COLORS_LIGHT;
  const transportHaloColor = isDarkMode ? '#1F2937' : '#FFFFFF';

  // 地名ラベル用の色
  const locationColors = isDarkMode ? LOCATION_LABEL_COLORS_DARK : LOCATION_LABEL_COLORS_LIGHT;

  // 縁取り付きアイコンを使用するかどうか
  const useOutlined =
    ('useOutlinedIconInLight' in themeConfig && !isDarkMode && themeConfig.useOutlinedIconInLight) ||
    ('useOutlinedIconInDark' in themeConfig && isDarkMode && themeConfig.useOutlinedIconInDark);

  const spotIconImage = useOutlined && themeColor in mapSpotOutlinedIcons
    ? mapSpotOutlinedIcons[themeColor as keyof typeof mapSpotOutlinedIcons]
    : mapSpotIcons[themeColor] ?? mapSpotIcons.pink;

  // スポットと交通データと地名を統合したGeoJSONを作成
  const combinedGeoJson = useMemo((): FeatureCollection<Point, CombinedProperties> => {
    const spotFeatures: Feature<Point, CombinedProperties>[] = spotsGeoJson.features.map((f) => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        id: f.properties.id,
        name: f.properties.name,
        featureType: 'spot' as const,
        sortKey: SYMBOL_SORT_KEY_USER_MAP.spot,
        category: f.properties.category,
      },
    }));

    const transportFeatures: Feature<Point, CombinedProperties>[] = transportGeoJson.features.map((f) => {
      let sortKey: number = SYMBOL_SORT_KEY_USER_MAP.station;
      if (f.properties.type === 'airport') sortKey = SYMBOL_SORT_KEY_USER_MAP.airport;
      else if (f.properties.type === 'ferry_terminal') sortKey = SYMBOL_SORT_KEY_USER_MAP.ferry;
      else if (f.properties.type === 'bus_terminal') sortKey = SYMBOL_SORT_KEY_USER_MAP.bus;

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

    // 都道府県フィーチャー
    const prefectureFeatures: Feature<Point, CombinedProperties>[] = (prefecturesGeoJson?.features ?? []).map((f) => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        id: f.properties.id,
        name: f.properties.name,
        featureType: 'prefecture' as const,
        sortKey: SYMBOL_SORT_KEY_USER_MAP.prefecture,
      },
    }));

    // 市区町村フィーチャー
    const cityFeatures: Feature<Point, CombinedProperties>[] = (citiesGeoJson?.features ?? []).map((f) => ({
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        id: f.properties.id,
        name: f.properties.name,
        featureType: 'city' as const,
        sortKey: SYMBOL_SORT_KEY_USER_MAP.city,
      },
    }));

    return {
      type: 'FeatureCollection',
      features: [...spotFeatures, ...transportFeatures, ...prefectureFeatures, ...cityFeatures],
    };
  }, [spotsGeoJson, transportGeoJson, prefecturesGeoJson, citiesGeoJson]);

  // データがない場合はレンダリングしない
  if (combinedGeoJson.features.length === 0) {
    return null;
  }

  return (
    <>
      {/* 全アイコン画像を登録 */}
      <Mapbox.Images images={{
        'user-spot-icon': spotIconImage,
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
        id="user-map-labels-source"
        shape={combinedGeoJson}
        onPress={onSpotPress}
      >
        {/* ========== 地名ラベルレイヤー（最背面、テキストのみ） ========== */}

        {/* 都道府県ラベル */}
        <Mapbox.SymbolLayer
          id="prefecture-labels-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.PREFECTURE.min}
          maxZoomLevel={LABEL_ZOOM_USER_MAP.PREFECTURE.max}
          filter={['==', ['get', 'featureType'], 'prefecture']}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            textField: ['get', 'name'],
            textSize: 16,
            textColor: locationColors.text,
            textHaloColor: locationColors.halo,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            textAllowOverlap: false,
            symbolPlacement: 'point',
            textLetterSpacing: 0.1,
          }}
        />

        {/* 市区町村ラベル */}
        <Mapbox.SymbolLayer
          id="city-labels-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.CITY.min}
          maxZoomLevel={LABEL_ZOOM_USER_MAP.CITY.max}
          filter={['==', ['get', 'featureType'], 'city']}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            textField: ['get', 'name'],
            textSize: 15,
            textColor: locationColors.text,
            textHaloColor: locationColors.halo,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            textAllowOverlap: false,
            symbolPlacement: 'point',
            textLetterSpacing: 0.05,
          }}
        />

        {/* ========== 交通機関レイヤー ========== */}

        {/* JR駅 */}
        <Mapbox.SymbolLayer
          id="transport-jr-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.station.min}
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
          id="transport-metro-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.station.min}
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
          id="transport-toei-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.station.min}
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
          id="transport-subway-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.station.min}
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
          id="transport-private-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.station.min}
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
          id="transport-airport-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.airport.min}
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
          id="transport-ferry-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.ferry.min}
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
          id="transport-bus-layer"
          minZoomLevel={LABEL_ZOOM_USER_MAP.TRANSPORT.bus.min}
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

        {/* ========== スポットレイヤー（交通機関より優先） ========== */}
        {/* 通常のスポット（選択中のスポット以外） */}
        <Mapbox.SymbolLayer
          id="user-spots-layer"
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['!=', ['get', 'id'], selectedSpotId]]
            : ['==', ['get', 'featureType'], 'spot']
          }
          style={{
            symbolSortKey: ['get', 'sortKey'],
            iconImage: 'user-spot-icon',
            iconSize: 0.2,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: spotColor,
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

        {/* ========== 選択中スポットレイヤー（最後に描画して最前面に） ========== */}
        <Mapbox.SymbolLayer
          id="user-spots-selected-layer"
          filter={selectedSpotId
            ? ['all', ['==', ['get', 'featureType'], 'spot'], ['==', ['get', 'id'], selectedSpotId]]
            : ['==', 'dummy', 'never-match'] // 選択なしの場合は何もマッチしない
          }
          style={{
            symbolSortKey: 0, // 最優先
            iconImage: 'user-spot-icon',
            iconSize: 0.2,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: spotColor,
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
