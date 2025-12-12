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

// 交通機関タイプ別の色（ライトモード）
const TRANSPORT_HUB_COLORS_LIGHT = {
  // 駅（サブタイプ別）
  station_jr: '#0066CC', // 青（JR）
  station_metro: '#06B6D4', // 水色（東京メトロ）
  station_toei: '#22C55E', // 緑（都営）
  station_subway: '#8B5CF6', // 紫（その他地下鉄）
  station_private: '#EC4899', // ピンク（私鉄）
  station_default: '#6B7280', // グレー（不明）
  // 空港
  airport: '#EF4444', // 赤
  // フェリーターミナル
  ferry_terminal: '#06B6D4', // シアン
  // バスターミナル
  bus_terminal: '#84CC16', // ライムグリーン
};

// 交通機関タイプ別の色（ダークモード）
const TRANSPORT_HUB_COLORS_DARK = {
  // 駅（サブタイプ別）
  station_jr: '#60A5FA', // 明るい青（JR）- ダークモードで見やすく
  station_metro: '#22D3EE', // 明るい水色（東京メトロ）
  station_toei: '#4ADE80', // 明るい緑（都営）
  station_subway: '#A78BFA', // 明るい紫（その他地下鉄）
  station_private: '#F472B6', // 明るいピンク（私鉄）
  station_default: '#9CA3AF', // 明るいグレー（不明）
  // 空港
  airport: '#F87171', // 明るい赤
  // フェリーターミナル
  ferry_terminal: '#22D3EE', // 明るいシアン
  // バスターミナル
  bus_terminal: '#A3E635', // 明るいライムグリーン
};

interface TransportHubLabelsProps {
  geoJson: FeatureCollection<Point, TransportHubGeoJsonProperties>;
}

export function TransportHubLabels({ geoJson }: TransportHubLabelsProps) {
  const isDarkMode = useIsDarkMode();
  const colors = isDarkMode ? TRANSPORT_HUB_COLORS_DARK : TRANSPORT_HUB_COLORS_LIGHT;
  const haloColor = isDarkMode ? '#1F2937' : '#FFFFFF'; // ダークモードでは暗いハロー

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
          minZoomLevel={12}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'jr']]}
          style={{
            iconImage: 'train-jr-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.station_jr,
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
          minZoomLevel={12}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'metro']]}
          style={{
            iconImage: 'subway-metro-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.station_metro,
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
          minZoomLevel={12}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'toei']]}
          style={{
            iconImage: 'subway-toei-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.station_toei,
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
          minZoomLevel={12}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'subway']]}
          style={{
            iconImage: 'subway-other-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.station_subway,
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
          minZoomLevel={12}
          filter={['all', ['==', ['get', 'type'], 'station'], ['==', ['get', 'subtype'], 'private']]}
          style={{
            iconImage: 'train-private-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.station_private,
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
          minZoomLevel={8}
          filter={['==', ['get', 'type'], 'airport']}
          style={{
            iconImage: 'airport-icon',
            iconSize: 0.18,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 14,
            textColor: colors.airport,
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
          minZoomLevel={12}
          filter={['==', ['get', 'type'], 'ferry_terminal']}
          style={{
            iconImage: 'ferry-icon',
            iconSize: 0.15,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 12,
            textColor: colors.ferry_terminal,
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
          minZoomLevel={13}
          filter={['==', ['get', 'type'], 'bus_terminal']}
          style={{
            iconImage: 'bus-icon',
            iconSize: 0.13,
            iconAnchor: 'bottom',
            textField: ['get', 'name'],
            textSize: 11,
            textColor: colors.bus_terminal,
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
