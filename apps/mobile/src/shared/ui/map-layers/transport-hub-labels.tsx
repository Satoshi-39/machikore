/**
 * 交通機関ラベルレイヤー
 *
 * 駅、空港、フェリーターミナル、バスターミナルを日本語ラベルで表示
 * アイコンの下にテキスト表示
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { TransportHubGeoJsonProperties } from '@/entities/transport-hub';
import {
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  TRANSPORT_HUB_MIN_ZOOM_DEFAULT,
  colors,
} from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// アイコン画像（交通機関タイプ別・色付き）
// ライトモード用
const trainJrIcon = require('@assets/icons/train.png'); // JR（青）
const trainPrivateIcon = require('@assets/icons/train-private.png'); // 私鉄（ピンク）
const subwayMetroIcon = require('@assets/icons/subway-metro.png'); // 東京メトロ（水色）
const subwayToeiIcon = require('@assets/icons/subway-toei.png'); // 都営（緑）
const subwayOtherIcon = require('@assets/icons/subway-other.png'); // その他地下鉄（紫）
const airportIcon = require('@assets/icons/airport.png');
const busIcon = require('@assets/icons/bus.png');
const ferryIcon = require('@assets/icons/ferry.png');
// ダークモード用
const trainJrDarkIcon = require('@assets/icons/train-jr-dark.png'); // JR（明るい青）

interface TransportHubLabelsProps {
  geoJson: FeatureCollection<Point, TransportHubGeoJsonProperties>;
  /** minZoomLevelのオーバーライド（省略時はデフォルト値を使用） */
  minZoomOverrides?: {
    station?: number;
    airport?: number;
    ferry?: number;
    bus?: number;
  };
}

export function TransportHubLabels({ geoJson, minZoomOverrides }: TransportHubLabelsProps) {
  // minZoomLevelを計算（オーバーライドがあれば適用）
  const minZoom = {
    station: minZoomOverrides?.station ?? TRANSPORT_HUB_MIN_ZOOM_DEFAULT.station,
    airport: minZoomOverrides?.airport ?? TRANSPORT_HUB_MIN_ZOOM_DEFAULT.airport,
    ferry: minZoomOverrides?.ferry ?? TRANSPORT_HUB_MIN_ZOOM_DEFAULT.ferry,
    bus: minZoomOverrides?.bus ?? TRANSPORT_HUB_MIN_ZOOM_DEFAULT.bus,
  };
  const isDarkMode = useIsDarkMode();
  const transportColors = isDarkMode ? TRANSPORT_HUB_COLORS_DARK : TRANSPORT_HUB_COLORS_LIGHT;
  const haloColor = isDarkMode
    ? colors.component['map-label']['halo-dark']
    : colors.component['map-label']['halo-light'];

  // データがない場合はレンダリングしない
  if (!geoJson.features || geoJson.features.length === 0) {
    return null;
  }

  return (
    <>
      {/* アイコン画像を登録 */}
      <Mapbox.Images images={{
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
        id="transport-hubs-source"
        shape={geoJson}
      >
        {/* JR駅 */}
        <Mapbox.SymbolLayer
          id="transport-hub-jr"
          minZoomLevel={minZoom.station}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'jr']]}
          style={{
            iconImage: 'train-jr-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_jr,
            textHaloColor: haloColor,
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
          id="transport-hub-metro"
          minZoomLevel={minZoom.station}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'metro']]}
          style={{
            iconImage: 'subway-metro-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_metro,
            textHaloColor: haloColor,
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
          id="transport-hub-toei"
          minZoomLevel={minZoom.station}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'toei']]}
          style={{
            iconImage: 'subway-toei-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_toei,
            textHaloColor: haloColor,
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
          id="transport-hub-subway"
          minZoomLevel={minZoom.station}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'subway']]}
          style={{
            iconImage: 'subway-other-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_subway,
            textHaloColor: haloColor,
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
          id="transport-hub-private"
          minZoomLevel={minZoom.station}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'private']]}
          style={{
            iconImage: 'train-private-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.station_private,
            textHaloColor: haloColor,
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
          id="transport-hub-airport"
          minZoomLevel={minZoom.airport}
          filter={['==', ['get', 'type'], 'airport']}
          style={{
            iconImage: 'airport-icon',
            iconSize: 0.18,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 14,
            textColor: transportColors.airport,
            textHaloColor: haloColor,
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
          id="transport-hub-ferry"
          minZoomLevel={minZoom.ferry}
          filter={['==', ['get', 'type'], 'ferry_terminal']}
          style={{
            iconImage: 'ferry-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: transportColors.ferry_terminal,
            textHaloColor: haloColor,
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
          id="transport-hub-bus"
          minZoomLevel={minZoom.bus}
          filter={['==', ['get', 'type'], 'bus_terminal']}
          style={{
            iconImage: 'bus-icon',
            iconSize: 0.13,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 11,
            textColor: transportColors.bus_terminal,
            textHaloColor: haloColor,
            textHaloWidth: 1.5,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
            textAnchor: 'top',
            textOffset: [0, 0.3],
            textAllowOverlap: false,
            iconAllowOverlap: false,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}
