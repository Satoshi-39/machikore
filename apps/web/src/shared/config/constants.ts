/**
 * Web アプリケーション定数
 */

export const APP_NAME = "街コレ";

export const APP_DOMAIN = "machikore.io";
export const APP_SCHEME = "machikore";

// TODO: 実際のApp Store IDに変更
export const APP_STORE_URL = "https://apps.apple.com/app/id6755458725";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tyatsushi.machikore";

export const DEFAULT_OGP_IMAGE = `https://${APP_DOMAIN}/images/ogp-default.png`;

/** フィードのページサイズ */
export const FEED_PAGE_SIZE = 20;

// ===============================
// Mapbox
// ===============================

/** User Map用のMapboxスタイルURL（スポット表示用） */
export const MAPBOX_STYLE_URL =
  "mapbox://styles/tyatsushi/cmibfra3o004d01sng79sgd84";

/** デフォルト中心座標（東京） [lng, lat] */
export const MAP_DEFAULT_CENTER: [number, number] = [139.7671, 35.6812];

/** デフォルトズームレベル */
export const MAP_DEFAULT_ZOOM = 12;

// ===============================
// スポットカラー
// ===============================

/** スポットカラー定義（モバイル版 shared/config/constants.ts と統一） */
export const SPOT_COLORS: Record<string, string> = {
  pink: "#ec4899",
  red: "#EF4444",
  orange: "#F97316",
  yellow: "#EAB308",
  green: "#22C55E",
  blue: "#3B82F6",
  purple: "#9333EA",
  gray: "#6B7280",
  white: "#FFFFFF",
};

export const DEFAULT_SPOT_COLOR = "blue";

/**
 * ディープリンクURL生成
 */
export const DEEP_LINKS = {
  map: (mapId: string) => `${APP_SCHEME}://maps/${mapId}`,
  spot: (spotId: string) => `${APP_SCHEME}://spots/${spotId}`,
} as const;

/**
 * Web URL生成
 * URL構造: /{username}/maps/{mapId}/spots/{spotId}
 */
export const WEB_URLS = {
  profile: (username: string) => `https://${APP_DOMAIN}/${username}`,
  map: (username: string, mapId: string) =>
    `https://${APP_DOMAIN}/${username}/maps/${mapId}`,
  spot: (username: string, mapId: string, spotId: string) =>
    `https://${APP_DOMAIN}/${username}/maps/${mapId}/spots/${spotId}`,
} as const;
