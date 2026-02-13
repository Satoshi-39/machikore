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

/**
 * ユーザーステータスラベル
 */
export const USER_STATUS_LABELS: Record<string, string> = {
  active: "アクティブ",
  suspended: "停止中",
  deleted: "削除済み",
} as const;

/**
 * ユーザープレミアムラベル
 */
export const USER_PREMIUM_LABELS: Record<string, string> = {
  premium: "Premium",
  free: "無料",
} as const;

/**
 * マップ公開状態ラベル
 */
export const MAP_VISIBILITY_LABELS: Record<string, string> = {
  public: "公開",
  private: "非公開",
} as const;

/**
 * マップ公式ラベル
 */
export const MAP_OFFICIAL_LABELS: Record<string, string> = {
  official: "公式",
  unofficial: "非公式",
} as const;

/**
 * ページネーション設定
 */
export const PAGINATION = {
  /** 1ページあたりの表示件数 */
  DEFAULT_PER_PAGE: 20,
} as const;

/**
 * 通報ステータスラベル
 */
export const REPORT_STATUS_LABELS: Record<string, string> = {
  pending: "未対応",
  reviewing: "確認中",
  resolved: "解決済",
  dismissed: "却下",
} as const;

/**
 * 通報理由ラベル
 */
export const REPORT_REASON_LABELS: Record<string, string> = {
  spam: "スパム",
  inappropriate: "不適切",
  harassment: "ハラスメント",
  misinformation: "誤情報",
  copyright: "著作権侵害",
  other: "その他",
} as const;

/**
 * 通報対象タイプラベル
 */
export const REPORT_TARGET_TYPE_LABELS: Record<string, string> = {
  map: "マップ",
  spot: "スポット",
  user: "ユーザー",
  comment: "コメント",
} as const;

/**
 * モデレーションステータスラベル
 */
export const MODERATION_STATUS_LABELS: Record<string, string> = {
  normal: "通常",
  hidden: "非表示",
  removed: "削除済",
} as const;
