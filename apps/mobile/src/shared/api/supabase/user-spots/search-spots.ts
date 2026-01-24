/**
 * スポット検索
 *
 * API層は生データ（JSONB型）をそのまま返す
 * 住所の言語抽出は表示層（entities/widgets）で行う
 */

import { supabase } from '../client';
import type {
  UserSpotSearchResult,
  MapSpotSearchResult,
  SearchPublicSpotsRpcRow,
  SpotSearchFilters,
} from './types';
import { rpcSpotResponseToUserSpotSearchResult } from './types';

/**
 * 公開スポットをキーワードで検索（RPC版）
 *
 * 検索対象:
 * 1. user_spots.description
 * 2. master_spots.name（Google検索経由のスポット名）
 * 3. user_spots.name（現在地/ピン刺し登録のスポット名、JSONB形式）
 *
 * @param query 検索キーワード（空文字可）
 * @param filters フィルター条件
 * @param limit 取得件数
 */
export async function searchPublicUserSpots(
  query: string,
  filters?: SpotSearchFilters,
  limit: number = 30
): Promise<UserSpotSearchResult[]> {
  const { data, error } = await supabase.rpc('search_public_spots', {
    search_query: query || undefined,
    result_limit: limit,
    prefecture_id_filter: filters?.prefectureId || undefined,
    city_id_filter: filters?.cityId || undefined,
    tag_ids_filter: filters?.tagIds || undefined,
    sort_by: filters?.sortBy || 'created_at',
    date_range: filters?.dateRange || 'all',
  });

  if (error) {
    console.error('searchPublicUserSpots error:', error);
    return [];
  }

  // RPC結果をUserSpotSearchResult型に変換（中間型を経由）
  return (data || []).map((row) =>
    rpcSpotResponseToUserSpotSearchResult(row as SearchPublicSpotsRpcRow)
  );
}

/**
 * 指定マップ内のスポットをキーワードで検索
 * other-map-searchで使用
 */
export async function searchSpotsByMapId(
  mapId: string,
  query: string,
  limit: number = 30
): Promise<MapSpotSearchResult[]> {
  // 1. user_spotsのdescriptionで検索
  const { data: descriptionResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      description,
      master_spots (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('description', `%${query}%`)
    .limit(limit);

  // 2. master_spotsの名前で検索
  const { data: masterNameResults } = await supabase
    .from('user_spots')
    .select(`
      id,
      description,
      master_spots!inner (
        name,
        latitude,
        longitude,
        google_short_address
      )
    `)
    .eq('map_id', mapId)
    .ilike('master_spots.name', `%${query}%`)
    .limit(limit);

  // 結果をマージ（重複排除）
  const resultMap = new Map<string, MapSpotSearchResult>();

  const processSpot = (spot: any) => {
    const masterSpot = spot.master_spots;
    if (masterSpot && !resultMap.has(spot.id)) {
      resultMap.set(spot.id, {
        id: spot.id,
        name: spot.description || masterSpot.name,
        address: masterSpot.google_short_address,
        latitude: masterSpot.latitude,
        longitude: masterSpot.longitude,
      });
    }
  };

  (descriptionResults || []).forEach(processSpot);
  (masterNameResults || []).forEach(processSpot);

  return Array.from(resultMap.values()).slice(0, limit);
}

/**
 * タグで公開スポットを検索
 * @param tag 検索するタグ名
 */
export async function searchPublicSpotsByTag(
  tag: string,
  limit: number = 50
): Promise<UserSpotSearchResult[]> {
  // 1. タグ名からタグIDを取得
  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tag)
    .single();

  if (tagError || !tagData) {
    console.warn('[Spots] Tag not found:', tag);
    return [];
  }

  // 2. spot_tagsからそのタグを持つスポットIDを取得
  const { data: spotTagsData, error: spotTagsError } = await supabase
    .from('spot_tags')
    .select('user_spot_id')
    .eq('tag_id', tagData.id);

  if (spotTagsError || !spotTagsData || spotTagsData.length === 0) {
    return [];
  }

  const spotIds = spotTagsData.map((st) => st.user_spot_id);

  // 3. スポット詳細を取得（公開マップの公開スポットのみ、タグ情報も含む）
  const { data, error } = await supabase
    .from('user_spots')
    .select(`
      id,
      user_id,
      map_id,
      master_spot_id,
      machi_id,
      description,
      spot_color,
      label_id,
      name,
      images_count,
      likes_count,
      comments_count,
      order_index,
      created_at,
      updated_at,
      article_content,
      is_public,
      master_spots (
        id,
        name,
        latitude,
        longitude,
        google_place_id,
        google_formatted_address,
        google_short_address,
        google_types
      ),
      users (
        id,
        username,
        display_name,
        avatar_url
      ),
      maps!inner (
        id,
        name,
        is_public
      ),
      map_labels (
        id,
        name,
        color
      ),
      spot_tags (
        tags (
          id,
          name,
          slug
        )
      ),
      images!images_user_spot_id_fkey (
        id,
        cloud_path,
        order_index
      )
    `)
    .in('id', spotIds)
    .eq('is_public', true)
    .eq('maps.is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Spots] Error searching by tag:', error);
    return [];
  }

  // 結果を UserSpotSearchResult 型に変換
  return (data || []).map((spot: any): UserSpotSearchResult => ({
    id: spot.id,
    user_id: spot.user_id,
    map_id: spot.map_id,
    master_spot_id: spot.master_spot_id,
    machi_id: spot.machi_id,
    description: spot.description,
    spot_color: spot.spot_color || null,
    label_id: spot.label_id || null,
    map_label: spot.map_labels ? {
      id: spot.map_labels.id,
      name: spot.map_labels.name,
      color: spot.map_labels.color,
    } : null,
    name: spot.name || null,
    images_count: spot.images_count,
    likes_count: spot.likes_count,
    comments_count: spot.comments_count,
    order_index: spot.order_index,
    created_at: spot.created_at,
    updated_at: spot.updated_at,
    master_spot: spot.master_spots ? {
      id: spot.master_spots.id,
      name: spot.master_spots.name,
      latitude: spot.master_spots.latitude,
      longitude: spot.master_spots.longitude,
      google_place_id: spot.master_spots.google_place_id,
      google_formatted_address: spot.master_spots.google_formatted_address,
      google_short_address: spot.master_spots.google_short_address,
      google_types: spot.master_spots.google_types,
    } : null,
    user: spot.users ? {
      id: spot.users.id,
      username: spot.users.username,
      display_name: spot.users.display_name,
      avatar_url: spot.users.avatar_url,
    } : null,
    map: spot.maps ? { id: spot.maps.id, name: spot.maps.name } : null,
    is_public: spot.is_public,
    tags: (spot.spot_tags || [])
      .map((st: any) => st.tags)
      .filter(Boolean),
    article_content: spot.article_content || null,
    // 画像URLの配列（imagesをorder_indexでソートしてcloud_pathを抽出）
    image_urls: (spot.images || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((img: any) => img.cloud_path)
      .filter(Boolean),
  }));
}
