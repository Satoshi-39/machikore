/**
 * 都道府県/州データ読み込みユーティリティ
 */

import type { PrefectureRow } from '@/shared/types/database.types';

// 各国の都道府県/州データをインポート
import jpPrefectures from '@/shared/assets/data/prefectures/jp.json';
import usPrefectures from '@/shared/assets/data/prefectures/us.json';
import krPrefectures from '@/shared/assets/data/prefectures/kr.json';
import twPrefectures from '@/shared/assets/data/prefectures/tw.json';
import cnPrefectures from '@/shared/assets/data/prefectures/cn.json';
import thPrefectures from '@/shared/assets/data/prefectures/th.json';

// 都道府県/州データの型（JSONから読み込む形式）
// Note: idは{country}_{prefecture}形式（例: jp_tokyo）
interface PrefectureJsonData {
  id: string; // {country}_{prefecture}形式
  name: string;
  name_kana: string;
  name_translations?: { [key: string]: string };
  region_id: string;
  latitude: number | null;
  longitude: number | null;
}

// 国コードと都道府県/州データのマッピング
const prefecturesByCountry: Record<string, PrefectureJsonData[]> = {
  jp: jpPrefectures as PrefectureJsonData[],
  us: usPrefectures as PrefectureJsonData[],
  kr: krPrefectures as PrefectureJsonData[],
  tw: twPrefectures as PrefectureJsonData[],
  cn: cnPrefectures as PrefectureJsonData[],
  th: thPrefectures as PrefectureJsonData[],
};

/**
 * JSONデータをPrefectureRowに変換
 * Note: Supabaseのprefecturesテーブルにはcountry_codeがない（region_id経由で国を取得）
 */
function toPrefectureRow(prefecture: PrefectureJsonData): PrefectureRow | null {
  const now = new Date().toISOString();
  // latitude/longitudeがnullの場合はスキップ（DBはNOT NULL制約）
  if (prefecture.latitude == null || prefecture.longitude == null) {
    return null;
  }
  return {
    id: prefecture.id,
    name: prefecture.name,
    name_kana: prefecture.name_kana,
    name_translations: prefecture.name_translations ?? null,
    region_id: prefecture.region_id,
    latitude: prefecture.latitude,
    longitude: prefecture.longitude,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 全ての都道府県/州データを取得（JSONから）
 *
 * Note: これは初期データ読み込み専用です。
 * アプリ内でのデータ取得は src/shared/api/sqlite/prefectures.ts を使用してください。
 */
export function getPrefecturesData(): PrefectureRow[] {
  return Object.values(prefecturesByCountry)
    .flat()
    .map(toPrefectureRow)
    .filter((p): p is PrefectureRow => p !== null);
}

/**
 * 特定の国の都道府県/州データを取得
 */
export function getPrefecturesByCountry(countryCode: string): PrefectureRow[] {
  const prefectures = prefecturesByCountry[countryCode];
  if (!prefectures) {
    return [];
  }
  return prefectures
    .map(toPrefectureRow)
    .filter((p): p is PrefectureRow => p !== null);
}

/**
 * 利用可能な国コードの一覧を取得
 */
export function getAvailablePrefectureCountryCodes(): string[] {
  return Object.keys(prefecturesByCountry);
}
