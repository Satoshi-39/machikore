/**
 * X（旧Twitter）プロバイダー設定
 */

import type { EmbedProviderConfig } from '../types';
import { createLoadingElement, createLinkCardPreview } from '../utils';

/** oEmbedキャッシュ */
const oembedCache = new Map<string, string>();

/** Xロゴ SVG */
const X_LOGO_SVG = `
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
`;

/**
 * X oEmbed APIからHTMLを取得
 */
async function fetchXOEmbed(tweetUrl: string): Promise<string | null> {
  const cached = oembedCache.get(tweetUrl);
  if (cached) return cached;

  try {
    const encodedUrl = encodeURIComponent(tweetUrl);
    const apiUrl = `https://publish.twitter.com/oembed?url=${encodedUrl}&omit_script=true&dnt=true`;
    const response = await fetch(apiUrl);
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.html) {
      oembedCache.set(tweetUrl, data.html);
      return data.html;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * X埋め込みプレビューを作成（oEmbed使用）
 */
async function createXPreview(url: string, container: HTMLElement): Promise<void> {
  const html = await fetchXOEmbed(url);

  if (html) {
    // oEmbedのHTMLを挿入
    container.innerHTML = html;
    container.style.cssText = `
      margin: 16px auto;
      max-width: 550px;
    `;

    // Twitter widgets.jsを読み込んでレンダリング
    if ((window as unknown as { twttr?: { widgets?: { load: (el: HTMLElement) => void } } }).twttr?.widgets) {
      (window as unknown as { twttr: { widgets: { load: (el: HTMLElement) => void } } }).twttr.widgets.load(container);
    } else {
      // widgets.jsがまだ読み込まれていない場合は読み込む
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        (window as unknown as { twttr?: { widgets?: { load: (el: HTMLElement) => void } } }).twttr?.widgets?.load(container);
      };
      document.head.appendChild(script);
    }
  } else {
    // フォールバック: リンクカード表示
    container.innerHTML = '';
    container.style.cssText = `
      padding: 16px;
      background-color: #f7f9fa;
      border: 1px solid #e1e8ed;
      border-radius: 12px;
      margin: 16px auto;
    `;
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        ${X_LOGO_SVG}
        <span style="font-weight: 600; font-size: 14px; color: #14171a;">X</span>
      </div>
      <div style="font-size: 13px; color: #536471; word-break: break-all;">${url}</div>
    `;
  }
}

export const xProvider: EmbedProviderConfig = {
  name: 'X',
  urlPatterns: [/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/],
  getThumbnailUrl: () => null,
  createPreview: (_embedId, url) => {
    const container = document.createElement('div');
    container.setAttribute('data-embed', '');
    container.setAttribute('data-provider', 'x');
    container.style.cssText = `
      margin: 16px auto;
    `;

    // ローディング表示
    container.appendChild(createLoadingElement('X'));

    // 非同期でoEmbedを取得・表示
    createXPreview(url, container);

    return container;
  },
};
