/**
 * サブスクリプション
 * 全アプリ共通（mobile / web / admin）
 */

/** プレミアム機能の有効化フラグ（falseの場合、Paywallは「準備中」表示） */
export const PREMIUM_ENABLED = false;

export const SUBSCRIPTION = {
  /** 無料プランのスポット上限（マップごと） */
  FREE_SPOT_LIMIT: 5,
  /** プレミアムプランのスポット上限（マップごと） */
  PREMIUM_SPOT_LIMIT: 10,
  /** 無料プランの画像上限（スポットごと） */
  FREE_IMAGE_LIMIT: 4,
  /** プレミアムプランの画像上限（スポットごと） */
  PREMIUM_IMAGE_LIMIT: 10,
  /** 無料プランのブックマーク上限（フォルダごと） */
  FREE_BOOKMARKS_PER_FOLDER: 15,
  /** プレミアムプランのブックマーク上限（フォルダごと） */
  PREMIUM_BOOKMARKS_PER_FOLDER: 30,
  /** 無料プランのブックマーク上限（後で見る） */
  FREE_BOOKMARKS_UNCATEGORIZED: 100,
  /** プレミアムプランのブックマーク上限（後で見る） */
  PREMIUM_BOOKMARKS_UNCATEGORIZED: 300,
  /** 無料プランのフォルダ上限 */
  FREE_FOLDER_LIMIT: 10,
  /** プレミアムプランのフォルダ上限 */
  PREMIUM_FOLDER_LIMIT: 30,
  /** 無料プランのコレクション上限 */
  FREE_COLLECTION_LIMIT: 3,
  /** プレミアムプランのコレクション上限 */
  PREMIUM_COLLECTION_LIMIT: 10,
  /** プレミアムプラン月額価格（円）- フォールバック用 */
  PREMIUM_PRICE: 400,
  /** RevenueCat Entitlement ID */
  ENTITLEMENT_ID: 'machikore_premium',
} as const;
