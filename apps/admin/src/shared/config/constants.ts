/**
 * 管理者ロール定数
 * DB値は小文字、コード内では大文字定数として使用
 */
export const AdminRole = {
  MODERATOR: "moderator",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export type AdminRoleType = (typeof AdminRole)[keyof typeof AdminRole];

/**
 * 街の種別ラベル（OSM place_type）
 * 注: これはOpenStreetMapのplace分類で、日本の行政区分とは異なります
 * - city/town/village: 行政上の市町村ではなく、OSMでの規模による分類
 * - suburb/neighbourhood/quarter: 市区町村内の地域・地区
 */
export const PLACE_TYPE_LABELS: Record<string, string> = {
  city: "都市",
  town: "町域",
  village: "村落",
  suburb: "郊外地区",
  neighbourhood: "近隣地区",
  quarter: "街区",
  hamlet: "集落",
} as const;

export function getPlaceTypeLabel(placeType: string | null): string {
  return placeType ? PLACE_TYPE_LABELS[placeType] || placeType : "-";
}
