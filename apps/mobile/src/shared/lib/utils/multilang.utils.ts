/**
 * 多言語データ抽出ユーティリティ
 *
 * JSONB形式の多言語データ（住所・名前など）から、指定言語の値を抽出
 * Supabase（Jsonオブジェクト）とSQLite（JSON文字列）の両方に対応
 */

import type { Json } from '@/shared/types/database.types';

/**
 * JSONB形式の住所から指定言語の住所を抽出（Supabase用）
 * @param addressJson JSONB形式の住所 { "ja": "...", "en": "...", ... }
 * @param language 言語コード（例: "ja", "en", "zh-TW"）
 * @returns 住所文字列またはnull
 */
export function extractAddress(
  addressJson: Json | null | undefined,
  language: string
): string | null {
  if (!addressJson || typeof addressJson !== 'object' || Array.isArray(addressJson)) {
    return null;
  }

  const addressMap = addressJson as Record<string, string>;
  return addressMap[language] ?? null;
}

/**
 * JSONB形式の名前から指定言語の名前を抽出（Supabase用）
 * @param nameJson JSONB形式の名前 { "ja": "...", "en": "...", ... }
 * @param language 言語コード（例: "ja", "en", "zh-TW"）
 * @returns 名前文字列またはnull
 */
export function extractName(
  nameJson: Json | null | undefined,
  language: string
): string | null {
  if (!nameJson || typeof nameJson !== 'object' || Array.isArray(nameJson)) {
    return null;
  }

  const nameMap = nameJson as Record<string, string>;
  return nameMap[language] ?? null;
}

/**
 * JSON文字列から指定言語の値を抽出（SQLite用）
 * SQLiteにはJSONB文字列として保存されているため、パースして抽出
 * @param jsonString JSON文字列またはnull
 * @param language 言語コード
 * @returns 抽出された文字列またはnull
 */
export function extractAddressFromString(
  jsonString: string | null | undefined,
  language: string
): string | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed[language] ?? null;
    }
    // 単純な文字列の場合はそのまま返す（後方互換性）
    return jsonString;
  } catch {
    // パースエラーの場合は元の文字列を返す（後方互換性）
    return jsonString;
  }
}

/**
 * master_spotsまたはuser_spotsから住所を抽出
 * master_spotがある場合はそちらを優先
 */
export function extractSpotAddresses(
  masterSpot: {
    google_formatted_address?: Json | null;
    google_short_address?: Json | null;
  } | null,
  userSpot: {
    google_formatted_address?: Json | null;
    google_short_address?: Json | null;
  },
  language: string
): {
  google_formatted_address: string | null;
  google_short_address: string | null;
} {
  // master_spotがある場合はそちらを優先
  if (masterSpot) {
    return {
      google_formatted_address: extractAddress(masterSpot.google_formatted_address, language),
      google_short_address: extractAddress(masterSpot.google_short_address, language),
    };
  }

  // user_spotの住所を返す
  return {
    google_formatted_address: extractAddress(userSpot.google_formatted_address, language),
    google_short_address: extractAddress(userSpot.google_short_address, language),
  };
}

/**
 * master_spot用の住所を抽出（MasterSpotBasicInfo形式用）
 */
export function extractMasterSpotAddresses(
  masterSpot: {
    google_formatted_address?: Json | null;
    google_short_address?: Json | null;
  } | null,
  language: string
): {
  google_formatted_address: string | null;
  google_short_address: string | null;
} {
  if (!masterSpot) {
    return {
      google_formatted_address: null,
      google_short_address: null,
    };
  }

  return {
    google_formatted_address: extractAddress(masterSpot.google_formatted_address, language),
    google_short_address: extractAddress(masterSpot.google_short_address, language),
  };
}

