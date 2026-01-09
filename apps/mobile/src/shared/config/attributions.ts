/**
 * データソース帰属表示（Attribution）設定
 *
 * 地図データ、API等の著作権・帰属表示情報を管理
 */

export interface Attribution {
  /** データソース名 */
  name: string;
  /** 表示テキスト */
  text: string;
  /** ライセンス・著作権ページURL */
  url: string;
  /** カテゴリ */
  category: 'map' | 'data' | 'api';
}

/**
 * 帰属表示一覧
 */
export const ATTRIBUTIONS: Attribution[] = [
  // 地図関連
  {
    name: 'Mapbox',
    text: '© Mapbox',
    url: 'https://www.mapbox.com/about/maps/',
    category: 'map',
  },
  {
    name: 'OpenStreetMap',
    text: '© OpenStreetMap contributors',
    url: 'https://www.openstreetmap.org/copyright',
    category: 'map',
  },

  // データ関連
  {
    name: '国土数値情報',
    text: '国土交通省「国土数値情報」',
    url: 'https://nlftp.mlit.go.jp/',
    category: 'data',
  },
  {
    name: 'e-Stat',
    text: '政府統計の総合窓口(e-Stat)',
    url: 'https://www.e-stat.go.jp/',
    category: 'data',
  },

  // API関連
  {
    name: 'Google Places API',
    text: 'Powered by Google',
    url: 'https://cloud.google.com/maps-platform/terms',
    category: 'api',
  },
];

/**
 * カテゴリ別に帰属表示を取得
 */
export function getAttributionsByCategory(category: Attribution['category']): Attribution[] {
  return ATTRIBUTIONS.filter((attr) => attr.category === category);
}

/**
 * 地図上に表示する短縮形の帰属表示テキスト
 */
export function getMapAttributionText(): string {
  return ATTRIBUTIONS.filter((attr) => attr.category === 'map')
    .map((attr) => attr.text)
    .join(' | ');
}
