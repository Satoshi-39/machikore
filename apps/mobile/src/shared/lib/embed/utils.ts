/**
 * 埋め込みコンテンツのユーティリティ関数
 */

import type { EmbedProvider, ParsedEmbed, EmbedAttrs } from './types';
import { embedProviders, supportedProviders } from './providers';

/**
 * URLからプロバイダーとIDを検出
 *
 * @param url - 解析するURL
 * @returns 解析結果、または検出できない場合はnull
 */
export function parseEmbedUrl(url: string): ParsedEmbed | null {
  for (const provider of supportedProviders) {
    const config = embedProviders[provider];

    for (const pattern of config.urlPatterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        const embedId = match[1];
        return {
          provider,
          embedId,
          thumbnailUrl: config.getThumbnailUrl(embedId),
        };
      }
    }
  }

  return null;
}

/**
 * URLが埋め込み可能かどうかを判定
 */
export function isEmbeddableUrl(url: string): boolean {
  return parseEmbedUrl(url) !== null;
}

/**
 * URLから埋め込み属性を生成
 */
export function createEmbedAttrs(url: string): EmbedAttrs | null {
  const parsed = parseEmbedUrl(url);
  if (!parsed) return null;

  return {
    provider: parsed.provider,
    url,
    embedId: parsed.embedId,
    thumbnailUrl: parsed.thumbnailUrl,
  };
}

/**
 * プロバイダーのサムネイルURLを取得
 */
export function getProviderThumbnailUrl(provider: EmbedProvider, embedId: string): string | null {
  const config = embedProviders[provider];
  return config?.getThumbnailUrl(embedId) ?? null;
}

/**
 * プロバイダーの埋め込みURLを取得
 */
export function getProviderEmbedUrl(provider: EmbedProvider, embedId: string): string | null {
  const config = embedProviders[provider];
  return config?.getEmbedUrl(embedId) ?? null;
}

/**
 * プロバイダー名を取得
 */
export function getProviderName(provider: EmbedProvider): string {
  return embedProviders[provider]?.name ?? provider;
}
