/**
 * OGPフェッチ API
 *
 * Edge Functionを呼び出してURLのOGP情報を取得する
 */

import { supabase } from './client';

interface FetchOgpResponse {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

/**
 * URLのOGP情報を取得
 * @param url OGPを取得するURL
 * @returns OGP情報またはnull（エラー時）
 */
export async function fetchOgpData(
  url: string
): Promise<FetchOgpResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke<FetchOgpResponse>(
      'fetch-ogp',
      {
        body: { url },
      }
    );

    if (error) {
      console.warn('[fetchOgpData] Error:', error);
      return null;
    }

    return data ?? null;
  } catch {
    console.warn('[fetchOgpData] Exception');
    return null;
  }
}
