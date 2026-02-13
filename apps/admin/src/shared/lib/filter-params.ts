/**
 * URLパラメータのフィルター値を解析・変換するユーティリティ
 * カンマ区切りの複数値に対応: "pending,reviewing" → ["pending", "reviewing"]
 */

/** カンマ区切りのURLパラメータを配列にパース */
export function parseFilterParam(param: string | undefined): string[] {
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

/** 配列をカンマ区切りのURLパラメータに変換。空配列は undefined を返す */
export function serializeFilterParam(
  values: string[]
): string | undefined {
  if (values.length === 0) return undefined;
  return values.join(",");
}

/** 配列内の値をトグル（存在すれば削除、なければ追加） */
export function toggleFilterValue(
  current: string[],
  value: string
): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}
