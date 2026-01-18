/**
 * 混合フィード エンティティ型定義
 */

import type { MapWithUser, SpotWithDetails } from '@/shared/types';

/**
 * 混合フィードアイテムの型
 * マップまたはスポットを表す判別可能なUnion型
 */
export type MixedFeedItem =
  | { type: 'map'; data: MapWithUser; createdAt: string }
  | { type: 'spot'; data: SpotWithDetails; createdAt: string };
