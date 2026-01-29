/**
 * 埋め込みプロバイダーの設定
 *
 * 新しいプロバイダーを追加する場合は、ここに設定を追加するだけでOK
 */

import type { EmbedProvider, EmbedProviderConfig } from './types';

/** プロバイダー設定のマップ */
export const embedProviders: Record<EmbedProvider, EmbedProviderConfig> = {
  youtube: {
    name: 'YouTube',
    urlPatterns: [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ],
    getThumbnailUrl: (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    getEmbedUrl: (id: string) => `https://www.youtube-nocookie.com/embed/${id}`,
  },

  x: {
    name: 'X',
    urlPatterns: [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
    ],
    getThumbnailUrl: () => null, // Xはサムネイル取得にAPI必要
    getEmbedUrl: (id: string) => `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
  },

  instagram: {
    name: 'Instagram',
    urlPatterns: [
      /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
    ],
    getThumbnailUrl: () => null, // Instagramはサムネイル取得にAPI必要
    getEmbedUrl: (id: string) => `https://www.instagram.com/p/${id}/embed`,
  },

};

/** サポートするプロバイダーのリスト */
export const supportedProviders = Object.keys(embedProviders) as EmbedProvider[];
