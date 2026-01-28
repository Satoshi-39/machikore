/**
 * カスタムTipTap拡張のエクスポート
 */

// Embed（埋め込みコンテンツ）
export { EmbedExtension } from './EmbedExtension';
export { EmbedBridge } from './EmbedBridge';

// Thumbnail（サムネイル画像）
export { ThumbnailExtension, THUMBNAIL_ALT, THUMBNAIL_PLACEHOLDER_URI } from './ThumbnailExtension';
export { ThumbnailBridge } from './ThumbnailBridge';

// Description（一言）
export { DescriptionExtension } from './DescriptionExtension';
export { DescriptionBridge } from './DescriptionBridge';

// TrailingNode（最終パラグラフ保証）
export { TrailingNodeBridge } from './TrailingNodeBridge';
