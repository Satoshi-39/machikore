/**
 * oEmbed API関連のユーティリティ
 *
 * Twitter/X等の埋め込みHTMLを取得するためのAPI
 */

/** oEmbedレスポンスの型 */
export interface OEmbedResponse {
  url: string;
  author_name: string;
  author_url: string;
  html: string;
  width: number;
  height: number | null;
  type: string;
  cache_age: string;
  provider_name: string;
  provider_url: string;
  version: string;
}

/** キャッシュ用のマップ */
const oembedCache = new Map<string, OEmbedResponse>();

/**
 * Twitter/X oEmbed APIからHTMLを取得
 *
 * @param tweetUrl - ツイートのURL
 * @returns oEmbedレスポンス（HTMLを含む）
 */
export async function fetchTwitterOEmbed(tweetUrl: string): Promise<OEmbedResponse | null> {
  // キャッシュチェック
  const cached = oembedCache.get(tweetUrl);
  if (cached) {
    return cached;
  }

  try {
    const encodedUrl = encodeURIComponent(tweetUrl);
    const apiUrl = `https://publish.twitter.com/oembed?url=${encodedUrl}&omit_script=true&dnt=true`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return null;
    }

    const data = await response.json() as OEmbedResponse;

    // キャッシュに保存
    oembedCache.set(tweetUrl, data);

    return data;
  } catch {
    return null;
  }
}

/**
 * oEmbedキャッシュをクリア
 */
export function clearOEmbedCache(): void {
  oembedCache.clear();
}
