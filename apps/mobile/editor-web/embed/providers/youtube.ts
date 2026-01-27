/**
 * YouTube プロバイダー設定
 */

import type { EmbedProviderConfig } from '../types';
import { createThumbnailPreview } from '../utils';

export const youtubeProvider: EmbedProviderConfig = {
  name: 'YouTube',
  urlPatterns: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ],
  getThumbnailUrl: (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  createPreview: (embedId, _url) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`;
    const container = createThumbnailPreview('YouTube', thumbnailUrl);
    container.setAttribute('data-provider', 'youtube');
    return container;
  },
};
