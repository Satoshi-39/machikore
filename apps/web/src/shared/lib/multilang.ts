import type { Json } from "@machikore/database";

/**
 * JSONB多言語フィールドからローカライズされた値を抽出
 * 例: {"ja": "東京タワー", "en": "Tokyo Tower"} → "東京タワー"
 */
export function extractLocalizedValue(
  json: Json | null | undefined,
  locale: string = "ja"
): string | null {
  if (!json) return null;

  if (typeof json === "string") return json;

  if (typeof json === "object" && !Array.isArray(json)) {
    const obj = json as Record<string, Json | undefined>;
    const value = obj[locale];
    if (typeof value === "string") return value;
    // フォールバック: 最初に見つかった文字列値を返す
    for (const v of Object.values(obj)) {
      if (typeof v === "string") return v;
    }
  }

  return null;
}
