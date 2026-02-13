/**
 * マップ設定
 * 全アプリ共通（mobile / web）
 */

/**
 * ジャンプ時のズームレベル（検索結果タップ時など）
 */
export const MAP_ZOOM = {
  /** 地球全体 */
  EARTH: 3,
  /** 国レベル */
  COUNTRY: 4,
  /** 地方レベル */
  REGION: 6,
  /** 都道府県レベル */
  PREFECTURE: 8,
  /** 市区レベル */
  CITY: 11,
  /** 街レベル */
  MACHI: 13,
  /** スポット詳細レベル */
  SPOT: 16,
  /** 初期表示（現在地なし） */
  INITIAL: 10,
} as const;

/**
 * ラベル表示のズームレベル範囲 - デフォルトマップ用
 * min: この値以上のズームでラベルが表示される（minZoomLevel）
 * max: この値以下のズームでラベルが表示される（maxZoomLevel）
 */
export const LABEL_ZOOM_DEFAULT_MAP = {
  /** 国ラベル */
  COUNTRY: { min: 1, max: 4 },
  /** 地方ラベル */
  REGION: { min: 4, max: 7 },
  /** 都道府県ラベル */
  PREFECTURE: { min: 5, max: 11 },
  /** 市区ラベル */
  CITY: { min: 10, max: 12 },
  /** 街ラベル（maxなし = ずっと表示） */
  MACHI: { min: 12 },
} as const;

/**
 * ラベル表示のズームレベル範囲 - ユーザマップ用
 * min: この値以上のズームでラベルが表示される（minZoomLevel）
 * max: この値以下のズームでラベルが表示される（maxZoomLevel）
 */
export const LABEL_ZOOM_USER_MAP = {
  /** 都道府県ラベル */
  PREFECTURE: { min: 5, max: 9 },
  /** 市区ラベル（より広域から表示） */
  CITY: { min: 9, max: 12 },
  /** 交通機関ラベル */
  TRANSPORT: {
    station: { min: 12, max: 22 },
    airport: { min: 9, max: 22 },
    ferry: { min: 12, max: 22 },
    bus: { min: 12, max: 22 },
  },
} as const;

export const MAP_TILE = {
  /** タイルサイズ（度）: 0.25度 ≒ 約25km四方 */
  SIZE: 0.25,
} as const;

/**
 * 地名表示の距離しきい値（km）
 *
 * マップ中心座標から最寄りのエンティティまでの距離がこの値を超えた場合、
 * 地名を表示しない（海の上などで誤った地名を表示しないため）
 */
export const MAP_DISTANCE_THRESHOLD = {
  /** 街名を表示する最大距離（km） - 駅周辺の範囲 */
  MACHI: 1.5,
  /** 市区名を表示する最大距離（km） - 市区の中心からの範囲 */
  CITY: 5,
  /** 都道府県名を表示する最大距離（km） - 都道府県の陸地範囲 */
  PREFECTURE: 30,
  /** 地方名を表示する最大距離（km） - 地方は複数の都道府県をカバー */
  REGION: 250,
  /** 国名を表示する最大距離（km） - 日本は南北約3000km、東西約3000kmあるので大きめに */
  COUNTRY: 2000,
} as const;

export const MAP_MARKER = {
  // 街マーカーアイコン（絵文字）
  MACHI: {
    VISITED: '🏠',
    UNVISITED: '🏘️',
    VISITED_HIGHLIGHT: '⭐',
  },
  // マーカーサイズ
  SIZE: {
    DEFAULT: 24,
    HIGHLIGHT: 32,
  },
  // マーカー色
  COLOR: {
    DEFAULT: '#000000',
    VISITED_HIGHLIGHT: '#3B82F6', // blue-500
    UNVISITED_HIGHLIGHT: '#6B7280', // gray-500
  },
} as const;
