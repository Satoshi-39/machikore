/**
 * niconico プロバイダー設定
 */

import type { EmbedProviderConfig } from '../types';
import { createThumbnailPreview } from '../utils';

export const niconicoProvider: EmbedProviderConfig = {
  name: 'niconico',
  urlPatterns: [/nicovideo\.jp\/watch\/(sm\d+)/, /nico\.ms\/(sm\d+)/],
  getThumbnailUrl: (id) =>
    `https://nicovideo.cdn.nimg.jp/thumbnails/${id.replace('sm', '')}/${id}`,
  createPreview: (embedId, _url) => {
    const thumbnailUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${embedId.replace('sm', '')}/${embedId}`;
    const container = createThumbnailPreview('niconico', thumbnailUrl);
    container.setAttribute('data-provider', 'niconico');
    return container;
  },
};
