/**
 * 交通機関ラベル設定
 * 全アプリ共通（mobile / web）
 */

/** 交通機関タイプ別の色（ライトモード） */
export const TRANSPORT_HUB_COLORS_LIGHT = {
  station_jr: '#0066CC', // 青（JR）
  station_metro: '#06B6D4', // 水色（東京メトロ）
  station_toei: '#22C55E', // 緑（都営）
  station_subway: '#8B5CF6', // 紫（その他地下鉄）
  station_private: '#EC4899', // ピンク（私鉄）
  station_default: '#6B7280', // グレー（不明）
  airport: '#EF4444', // 赤
  ferry_terminal: '#06B6D4', // シアン
  bus_terminal: '#84CC16', // ライムグリーン
} as const;

/** 交通機関タイプ別の色（ダークモード） */
export const TRANSPORT_HUB_COLORS_DARK = {
  station_jr: '#60A5FA', // 明るい青（JR）
  station_metro: '#22D3EE', // 明るい水色（東京メトロ）
  station_toei: '#4ADE80', // 明るい緑（都営）
  station_subway: '#A78BFA', // 明るい紫（その他地下鉄）
  station_private: '#F472B6', // 明るいピンク（私鉄）
  station_default: '#9CA3AF', // 明るいグレー（不明）
  airport: '#F87171', // 明るい赤
  ferry_terminal: '#22D3EE', // 明るいシアン
  bus_terminal: '#A3E635', // 明るいライムグリーン
} as const;

/** 交通機関のデフォルトminZoomLevel（shared/default-map用） */
export const TRANSPORT_HUB_MIN_ZOOM_DEFAULT = {
  station: 13,
  airport: 8,
  ferry: 13,
  bus: 13,
} as const;

/** symbolSortKeyの値（小さいほど優先、同じShapeSource内で有効）- デフォルトマップ用 */
export const SYMBOL_SORT_KEY = {
  machi: 1, // 街は最優先
  spot: 25, // スポットは街の次に優先
  airport: 50, // 空港は次に優先
  station: 100, // 駅
  ferry: 100, // フェリー
  bus: 150, // バス
} as const;

/** symbolSortKeyの値（小さいほど優先、同じShapeSource内で有効）- ユーザマップ用 */
export const SYMBOL_SORT_KEY_USER_MAP = {
  spot: 1, // スポットは最優先
  airport: 50, // 空港
  station: 100, // 駅
  ferry: 100, // フェリー
  bus: 150, // バス
  city: 200, // 市区町村（交通データより低優先度）
  prefecture: 250, // 都道府県（最低優先度）
} as const;
