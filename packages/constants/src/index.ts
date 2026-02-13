// 入力値制限
export { INPUT_LIMITS } from "./input-limits";

// サブスクリプション
export { PREMIUM_ENABLED, SUBSCRIPTION } from "./subscription";

// マップ設定
export {
  MAP_ZOOM,
  LABEL_ZOOM_DEFAULT_MAP,
  LABEL_ZOOM_USER_MAP,
  MAP_TILE,
  MAP_DISTANCE_THRESHOLD,
  MAP_MARKER,
} from "./map";

// スポット設定
export {
  SPOT_TYPE_COLORS,
  SPOT_COLORS,
  DEFAULT_SPOT_COLOR,
  SPOT_COLOR_LIST,
  getSpotColorStroke,
  type SpotColor,
} from "./spot";

// 交通機関設定
export {
  TRANSPORT_HUB_COLORS_LIGHT,
  TRANSPORT_HUB_COLORS_DARK,
  TRANSPORT_HUB_MIN_ZOOM_DEFAULT,
  SYMBOL_SORT_KEY,
  SYMBOL_SORT_KEY_USER_MAP,
} from "./transport";

// 地名表示設定
export {
  LOCATION_ICONS,
  LOCATION_TYPE_MAP,
  LOCATION_LABEL_COLORS_LIGHT,
  LOCATION_LABEL_COLORS_DARK,
} from "./location";

// 画像・サムネイル設定
export {
  MAX_IMAGE_SIZE,
  SUPPORTED_IMAGE_FORMATS,
  MAX_IMAGE_DIMENSION,
  THUMBNAIL_ASPECT_RATIO,
  getThumbnailHeight,
} from "./image";

// ページネーション設定
export {
  FEED_PAGE_SIZE,
  COMMENTS_PAGE_SIZE,
  FOLLOWS_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  LIKERS_PAGE_SIZE,
} from "./pagination";

// 国際化・言語設定
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  CONTENT_LANGUAGES,
  CONTENT_LANGUAGE_LIST,
  type SupportedLocale,
  type ContentLanguageCode,
} from "./i18n";

// 共有URL・外部リンク設定
export { SHARE_DOMAIN, SHARE_URLS, EXTERNAL_LINKS } from "./links";

// 表示・UI設定
export { COMMENT_DISPLAY, SEARCH_HISTORY, USER_PREFERENCES } from "./display";
