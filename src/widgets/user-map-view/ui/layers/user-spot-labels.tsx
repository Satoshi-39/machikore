/**
 * ユーザマップ用スポットラベルレイヤー（アイコン + テキスト横並び、カテゴリ別色分け）
 */

import React from 'react';
import Mapbox from '@rnmapbox/maps';
import type { FeatureCollection, Point } from 'geojson';
import type { SpotCategory } from '@/entities/master-spot/model';
import { SPOT_CATEGORY_COLORS } from '@/shared/config';

// カテゴリ別アイコン画像
const locationFoodIcon = require('@assets/icons/location-food.png');
const locationShoppingIcon = require('@assets/icons/location-shopping.png');
const locationTourismIcon = require('@assets/icons/location-tourism.png');
const locationTransitIcon = require('@assets/icons/location-transit.png');
const locationOtherIcon = require('@assets/icons/location-other.png');

interface UserSpotLabelsProps {
  geoJson: FeatureCollection<Point, { id: string; name: string; category: SpotCategory }>;
  onPress: (event: any) => void;
}

export function UserSpotLabels({ geoJson, onPress }: UserSpotLabelsProps) {
  return (
    <>
      {/* カテゴリ別アイコン画像を登録 */}
      <Mapbox.Images images={{
        'user-spot-icon-food': locationFoodIcon,
        'user-spot-icon-shopping': locationShoppingIcon,
        'user-spot-icon-tourism': locationTourismIcon,
        'user-spot-icon-transit': locationTransitIcon,
        'user-spot-icon-other': locationOtherIcon,
      }} />

      <Mapbox.ShapeSource
        id="user-spots-source"
        shape={geoJson}
        onPress={onPress}
      >
        {/* 飲食店系 - オレンジ */}
        <Mapbox.SymbolLayer
          id="user-spots-food"
          filter={['==', ['get', 'category'], 'food']}
          style={{
            iconImage: 'user-spot-icon-food',
            iconSize: 0.2,
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

        {/* ショッピング系 - 紫 */}
        <Mapbox.SymbolLayer
          id="user-spots-shopping"
          filter={['==', ['get', 'category'], 'shopping']}
          style={{
            iconImage: 'user-spot-icon-shopping',
            iconSize: 0.2,
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

        {/* 公園・観光地系 - 緑 */}
        <Mapbox.SymbolLayer
          id="user-spots-tourism"
          filter={['==', ['get', 'category'], 'tourism']}
          style={{
            iconImage: 'user-spot-icon-tourism',
            iconSize: 0.2,
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

        {/* 交通系 - 青 */}
        <Mapbox.SymbolLayer
          id="user-spots-transit"
          filter={['==', ['get', 'category'], 'transit']}
          style={{
            iconImage: 'user-spot-icon-transit',
            iconSize: 0.2,
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

        {/* その他 - グレー（デフォルト） */}
        <Mapbox.SymbolLayer
          id="user-spots-other"
          filter={['==', ['get', 'category'], 'other']}
          style={{
            iconImage: 'user-spot-icon-other',
            iconSize: 0.2,
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
      </Mapbox.ShapeSource>
    </>
  );
}
