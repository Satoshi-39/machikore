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

/**
 * ディープリンクURL生成
 */
export const DEEP_LINKS = {
  map: (mapId: string) => `${APP_SCHEME}://maps/${mapId}`,
  spot: (mapId: string, spotId: string) =>
    `${APP_SCHEME}://maps/${mapId}/spots/${spotId}`,
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
