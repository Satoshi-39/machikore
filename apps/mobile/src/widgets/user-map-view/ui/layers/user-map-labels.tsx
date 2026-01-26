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
  SPOT_COLORS,
  DEFAULT_SPOT_COLOR,
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  SYMBOL_SORT_KEY_USER_MAP,
  LABEL_ZOOM_USER_MAP,
  LOCATION_LABEL_COLORS_LIGHT,
  LOCATION_LABEL_COLORS_DARK,
  colors,
  type SpotColor,
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

// mapSpotOutlinedIcons - 将来使用予定（個別スポット選択時）
// const mapSpotOutlinedIcons = {
//   gray: require('@assets/icons/map-spot-gray-outlined.png'),
//   white: require('@assets/icons/map-spot-white-outlined.png'),
// };

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
  spot_color: SpotColor;
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
  spot_color?: SpotColor;
  // スポットの状態（フォーカス/選択）
  isFocused?: boolean;
  isSelected?: boolean;
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
  /** 選択中のスポットID（詳細カード表示中、常に最前面表示） */
  selectedSpotId?: string | null;
  /** カルーセルでフォーカス中のスポットID（アイコン拡大表示） */
  focusedSpotId?: string | null;
}

export function UserMapLabels({
  spotsGeoJson,
  transportGeoJson,
  prefecturesGeoJson,
  citiesGeoJson,
  onSpotPress,
  selectedSpotId,
  focusedSpotId,
}: UserMapLabelsProps) {
  const isDarkMode = useIsDarkMode();
  // デフォルトのスポットカラー設定（各スポットは個別にspot_colorを持つ）
  const defaultSpotColor = SPOT_COLORS[DEFAULT_SPOT_COLOR].color;
  const transportColors = isDarkMode ? TRANSPORT_HUB_COLORS_DARK : TRANSPORT_HUB_COLORS_LIGHT;
  const transportHaloColor = isDarkMode
    ? colors.component['map-label']['halo-dark']
    : colors.component['map-label']['halo-light'];
  const spotHaloColor = isDarkMode
    ? colors.component['map-label']['halo-dark']
    : colors.component['map-label']['halo-light'];

  // 地名ラベル用の色
  const locationColors = isDarkMode ? LOCATION_LABEL_COLORS_DARK : LOCATION_LABEL_COLORS_LIGHT;

  // スポットと交通データと地名を統合したGeoJSONを作成
  // focusedSpotId/selectedSpotIdをGeoJSONプロパティに含めることで、
  // フィルター切り替えではなくdata-driven stylingでサイズを変更
  const combinedGeoJson = useMemo((): FeatureCollection<Point, CombinedProperties> => {
    const spotFeatures: Feature<Point, CombinedProperties>[] = spotsGeoJson.features.map((f) => {
      const isFocused = f.properties.id === focusedSpotId && f.properties.id !== selectedSpotId;
      const isSelected = f.properties.id === selectedSpotId;
      // フォーカス/選択中のスポットはsortKeyを最小にして最前面に表示
      const sortKey = isFocused || isSelected ? 0 : SYMBOL_SORT_KEY_USER_MAP.spot;

      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          id: f.properties.id,
          name: f.properties.name,
          featureType: 'spot' as const,
          sortKey,
          category: f.properties.category,
          spot_color: f.properties.spot_color,
          isFocused,
          isSelected,
        },
      };
    });

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
  }, [spotsGeoJson, transportGeoJson, prefecturesGeoJson, citiesGeoJson, focusedSpotId, selectedSpotId]);

  // データがない場合はレンダリングしない
  if (combinedGeoJson.features.length === 0) {
    return null;
  }

  return (
    <>
      {/* 全アイコン画像を登録（スポットカラー別 + 交通機関） */}
      <Mapbox.Images images={{
        // スポットカラー別アイコン
        'spot-icon-pink': mapSpotIcons.pink,
        'spot-icon-red': mapSpotIcons.red,
        'spot-icon-orange': mapSpotIcons.orange,
        'spot-icon-yellow': mapSpotIcons.yellow,
        'spot-icon-green': mapSpotIcons.green,
        'spot-icon-blue': mapSpotIcons.blue,
        'spot-icon-purple': mapSpotIcons.purple,
        'spot-icon-gray': mapSpotIcons.gray,
        'spot-icon-white': mapSpotIcons.white,
        // 交通機関アイコン
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
        {/* 単一レイヤーでdata-driven stylingを使用し、フォーカス/選択状態でサイズを変更 */}
        {/* フィルター切り替えを使わないことでフリッカーを防止 */}
        <Mapbox.SymbolLayer
          id="user-spots-layer"
          filter={['==', ['get', 'featureType'], 'spot']}
          style={{
            symbolSortKey: ['get', 'sortKey'],
            // スポットカラーに応じたアイコンを表示
            iconImage: ['concat', 'spot-icon-', ['get', 'spot_color']],
            // フォーカス/選択中は拡大表示
            iconSize: [
              'case',
              ['==', ['get', 'isFocused'], true],
              0.28,
              ['==', ['get', 'isSelected'], true],
              0.28,
              0.2,
            ],
            textField: ['get', 'name'],
            // フォーカス/選択中はテキストも拡大
            textSize: [
              'case',
              ['==', ['get', 'isFocused'], true],
              15,
              ['==', ['get', 'isSelected'], true],
              15,
              13,
            ],
            // スポットカラーに応じたテキスト色
            textColor: [
              'match', ['get', 'spot_color'],
              'pink', SPOT_COLORS.pink.color,
              'red', SPOT_COLORS.red.color,
              'orange', SPOT_COLORS.orange.color,
              'yellow', SPOT_COLORS.yellow.color,
              'green', SPOT_COLORS.green.color,
              'blue', SPOT_COLORS.blue.color,
              'purple', SPOT_COLORS.purple.color,
              'gray', SPOT_COLORS.gray.color,
              'white', SPOT_COLORS.white.color,
              defaultSpotColor, // fallback
            ],
            textHaloColor: spotHaloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            // 画面端でラベルが見切れる場合に自動的に配置を調整
            // 優先順位: 右側 → 左側 → 上 → 下
            textVariableAnchor: ['left', 'right', 'top', 'bottom'],
            textRadialOffset: 0.5,
            textJustify: 'auto',
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />

      </Mapbox.ShapeSource>
    </>
  );
}
