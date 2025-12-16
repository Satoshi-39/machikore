/**
 * Wikipedia API ユーティリティ
 *
 * 日本語Wikipediaから記事の要約を取得
 */

import { log } from '@/shared/config/logger';

export interface WikipediaSummary {
  title: string;
  extract: string;
  description?: string;
  pageUrl: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

interface WikipediaResponse {
  title: string;
  extract: string;
  description?: string;
  content_urls?: {
    desktop: {
      page: string;
    };
    mobile: {
      page: string;
    };
  };
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

/**
 * Wikipedia記事の要約を取得
 *
 * @param title - 記事タイトル（例: "北区_(東京都)"）
 * @returns 要約情報、見つからない場合はnull
 */
export async function getWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  try {
    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`,
      {
        headers: {
          // Wikipedia APIはUser-Agentを推奨
          'User-Agent': 'MachikoreApp/1.0 (https://machikore.app)',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data: WikipediaResponse = await response.json();

    return {
      title: data.title,
      extract: data.extract,
      description: data.description,
      pageUrl: data.content_urls?.mobile?.page ?? `https://ja.m.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      thumbnail: data.thumbnail,
    };
  } catch (error) {
    log.warn(`[Wikipedia] Summary fetch failed for "${title}":`, error);
    return null;
  }
}

/**
 * 市区町村のWikipedia要約を取得
 *
 * 記事タイトルのパターンを試行:
 * 1. "{市区名}_({都道府県名})" - 例: "北区_(東京都)"
 * 2. "{市区名}" - 曖昧さがない場合
 *
 * @param cityName - 市区町村名（例: "北区"）
 * @param prefectureName - 都道府県名（例: "東京都"）
 */
export async function getCityWikipediaSummary(
  cityName: string,
  prefectureName: string
): Promise<WikipediaSummary | null> {
  // パターン1: "{市区名}_({都道府県名})"
  const titleWithPrefecture = `${cityName}_(${prefectureName})`;
  const result1 = await getWikipediaSummary(titleWithPrefecture);
  if (result1) {
    return result1;
  }

  // パターン2: "{市区名}"のみ
  const result2 = await getWikipediaSummary(cityName);
  if (result2) {
    return result2;
  }

  return null;
}

/**
 * 街（machi）のWikipedia要約を取得
 *
 * @param machiName - 街名（例: "渋谷"）
 * @param cityName - 市区町村名（例: "渋谷区"）
 * @param _prefectureName - 都道府県名（例: "東京都"）※将来の拡張用
 */
export async function getMachiWikipediaSummary(
  machiName: string,
  cityName?: string,
  _prefectureName?: string
): Promise<WikipediaSummary | null> {
  // パターン1: "{街名}駅" - 駅記事は情報が充実していることが多い
  const stationTitle = `${machiName}駅`;
  const result1 = await getWikipediaSummary(stationTitle);
  if (result1) {
    return result1;
  }

  // パターン2: "{街名}_({市区名})" - 例: "渋谷_(渋谷区)"
  if (cityName) {
    const titleWithCity = `${machiName}_(${cityName})`;
    const result2 = await getWikipediaSummary(titleWithCity);
    if (result2) {
      return result2;
    }
  }

  // パターン3: "{街名}"のみ
  const result3 = await getWikipediaSummary(machiName);
  if (result3) {
    return result3;
  }

  return null;
}

/**
 * 都道府県のWikipedia要約を取得
 *
 * @param prefectureName - 都道府県名（例: "東京都"）
 */
export async function getPrefectureWikipediaSummary(
  prefectureName: string
): Promise<WikipediaSummary | null> {
  return getWikipediaSummary(prefectureName);
}

/**
 * 地方のWikipedia要約を取得
 *
 * @param regionName - 地方名（例: "関東地方"）
 */
export async function getRegionWikipediaSummary(
  regionName: string
): Promise<WikipediaSummary | null> {
  return getWikipediaSummary(regionName);
}
