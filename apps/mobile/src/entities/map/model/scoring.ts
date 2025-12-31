/**
 * マップのスコアリングロジック
 *
 * 人気マップランキングや本日のピックアップのスコア計算
 */

/**
 * ピックアップの設定
 */
export const PICKUP_CONFIG = {
  /** ピックアップ対象期間（日数） */
  periodDays: 7,
} as const;

/**
 * スコアリングの重み設定
 */
export const SCORING_WEIGHTS = {
  /** いいね数の重み */
  likes: 0.4,
  /** 閲覧数の重み */
  views: 0.3,
  /** 鮮度スコアの乗数 */
  recencyMultiplier: 30,
} as const;

/**
 * 鮮度スコアを計算（新しいほど高い）
 * 30日以内: 1.0、90日以内: 0.5、それ以上: 0.2
 */
export function getRecencyScore(createdAt: string): number {
  const now = new Date();
  const created = new Date(createdAt);
  const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 30) return 1.0;
  if (daysDiff <= 90) return 0.5;
  return 0.2;
}

/**
 * ピックアップ対象期間の開始日を取得
 */
export function getPickupPeriodStart(): Date {
  const date = new Date();
  date.setDate(date.getDate() - PICKUP_CONFIG.periodDays);
  return date;
}

/**
 * 人気マップの複合スコアを計算
 * score = likes_count * 0.4 + views_count * 0.3 + recency_score * 30
 */
export function calculatePopularityScore(
  likesCount: number,
  viewsCount: number,
  createdAt: string
): number {
  const likesScore = likesCount * SCORING_WEIGHTS.likes;
  const viewsScore = viewsCount * SCORING_WEIGHTS.views;
  const recencyScore = getRecencyScore(createdAt) * SCORING_WEIGHTS.recencyMultiplier;

  return likesScore + viewsScore + recencyScore;
}

/**
 * いいね数をマップIDごとにカウント
 */
export function countByMapId(items: Array<{ map_id: string | null }>): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    if (item.map_id) {
      counts[item.map_id] = (counts[item.map_id] || 0) + 1;
    }
  });
  return counts;
}

/**
 * 上位N件のマップIDを取得（カウント降順）
 */
export function getTopMapIds(counts: Record<string, number>, limit: number): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([mapId]) => mapId);
}
