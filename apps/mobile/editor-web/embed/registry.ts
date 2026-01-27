/**
 * プロバイダーレジストリ
 *
 * URLからプロバイダーを判定し、適切な設定を返す
 */

import type { EmbedProvider, EmbedProviderConfig, ParsedEmbed } from './types';
import { youtubeProvider, xProvider, instagramProvider, niconicoProvider } from './providers';

/** プロバイダー設定マップ */
const providers: Record<EmbedProvider, EmbedProviderConfig> = {
  youtube: youtubeProvider,
  x: xProvider,
  instagram: instagramProvider,
  niconico: niconicoProvider,
};

/**
 * URLを解析してプロバイダーとIDを取得
 */
export function parseUrl(url: string): ParsedEmbed | null {
  for (const [provider, config] of Object.entries(providers) as [EmbedProvider, EmbedProviderConfig][]) {
    for (const pattern of config.urlPatterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return { provider, embedId: match[1] };
      }
    }
  }
  return null;
}

/**
 * プロバイダー設定を取得
 */
export function getProvider(provider: EmbedProvider): EmbedProviderConfig | undefined {
  return providers[provider];
}

/**
 * プレビュー要素を作成
 */
export function createPreviewElement(
  provider: EmbedProvider,
  embedId: string,
  url: string
): HTMLElement {
  const config = providers[provider];
  if (!config) {
    // フォールバック: 未知のプロバイダー
    const container = document.createElement('div');
    container.textContent = `Unknown provider: ${provider}`;
    return container;
  }
  return config.createPreview(embedId, url);
}
