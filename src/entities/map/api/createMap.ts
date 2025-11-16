/**
 * マップ作成API
 */

import { insertMap } from '@/shared/api/sqlite/maps';
import type { MapInsert, MapRow } from '@/shared/types/database.types';

/**
 * 新しいマップを作成
 */
export function createMap(params: {
  userId: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
}): MapRow {
  const now = new Date().toISOString();
  const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const mapData: MapInsert = {
    id: mapId,
    user_id: params.userId,
    name: params.name,
    description: params.description || null,
    category: params.category || null,
    tags: params.tags && params.tags.length > 0 ? JSON.stringify(params.tags) : null,
    is_public: params.isPublic ? 1 : 0,
    is_default: 0,
    is_official: 0,
    thumbnail_url: null,
    spots_count: 0,
    likes_count: 0,
    created_at: now,
    updated_at: now,
    synced_at: null,
    is_synced: 0,
  };

  insertMap(mapData);

  return {
    ...mapData,
    is_public: mapData.is_public!,
    is_default: mapData.is_default!,
    is_official: mapData.is_official!,
    spots_count: mapData.spots_count!,
    likes_count: mapData.likes_count!,
  } as MapRow;
}
