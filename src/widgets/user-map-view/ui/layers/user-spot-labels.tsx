/**
 * ユーザマップ用スポットラベルレイヤー（マップのテーマカラーを使用）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import { USER_MAP_THEME_COLORS, type UserMapThemeColor } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

// 各テーマカラーのアイコン画像
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

// 縁取り付きアイコン（背景と同化しやすい色用）
const mapSpotOutlinedIcons = {
  gray: require('@assets/icons/map-spot-gray-outlined.png'),
  white: require('@assets/icons/map-spot-white-outlined.png'),
};

interface UserSpotLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; category: SpotCategory }>;
  onPress: (event: any) => void;
  themeColor?: UserMapThemeColor;
}

export function UserSpotLabels({ geoJson, onPress, themeColor = 'pink' }: UserSpotLabelsProps) {
  const isDarkMode = useIsDarkMode();
  const themeConfig = USER_MAP_THEME_COLORS[themeColor] ?? USER_MAP_THEME_COLORS.pink;
  const color = themeConfig.color;
  const haloColor = isDarkMode ? themeConfig.haloDark : themeConfig.haloLight;

  // 縁取り付きアイコンを使用するかどうか
  const useOutlined =
    ('useOutlinedIconInLight' in themeConfig && !isDarkMode && themeConfig.useOutlinedIconInLight) ||
    ('useOutlinedIconInDark' in themeConfig && isDarkMode && themeConfig.useOutlinedIconInDark);

  const iconImage = useOutlined && themeColor in mapSpotOutlinedIcons
    ? mapSpotOutlinedIcons[themeColor as keyof typeof mapSpotOutlinedIcons]
    : mapSpotIcons[themeColor] ?? mapSpotIcons.pink;

  return (
    <>
      {/* テーマカラーのアイコン画像を登録 */}
      <Mapbox.Images images={{
        'user-spot-icon': iconImage,
      }} />

      <Mapbox.ShapeSource
        id="user-spots-source"
        shape={geoJson}
        onPress={onPress}
      >
        {/* 全スポット - マップのテーマカラーで統一 */}
        <Mapbox.SymbolLayer
          id="user-spots-all"
          style={{
            iconImage: 'user-spot-icon',
            iconSize: 0.2,
            textField: ['get', 'name'],
            textSize: 13,
            textColor: color,
            textHaloColor: haloColor,
            textHaloWidth: 2,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            iconTextFit: 'none',
            textAnchor: 'left',
            iconAnchor: 'right',
            textOffset: [0.3, 0],
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}
