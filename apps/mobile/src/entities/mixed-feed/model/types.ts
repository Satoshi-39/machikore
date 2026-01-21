/**
 * 混合フィード エンティティ型定義
 */

import type { MapWithUser, SpotWithDetails } from '@/shared/types';
import type { AdSlot } from '@/shared/config';

/**
 * スポットの表示タイプ
 * - 'card': 通常のSpotCard表示
 * - 'short': SpotShortCard（YouTubeショート風）表示
 */
export type SpotDisplayType = 'card' | 'short';

/**
 * 混合フィードアイテムの型
 * マップ、スポット、または広告を表す判別可能なUnion型
 */
export type MixedFeedItem =
  | { type: 'map'; data: MapWithUser; createdAt: string }
  | { type: 'spot'; data: SpotWithDetails; createdAt: string; displayType: SpotDisplayType }
  | { type: 'ad'; adSlot: AdSlot; feedPosition: number };
