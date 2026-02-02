/**
 * 混合フィード 型変換ロジック
 *
 * RPC関数の生データをドメイン型に変換
 * spot_display_typeはサーバー側でブロックごとにshort→card交互に設定される
 */

import type {
  RpcMixedFeedItem,
  MapWithUser,
  SpotWithDetails,
  MasterSpotBasicInfo,
  UserBasicInfo,
  TagBasicInfo,
} from '@/shared/types';
import type { AdSlot } from '@/shared/config';
import type { MixedFeedItem, SpotDisplayType } from './types';

/**
 * RPC結果をMapWithUserに変換
 */
function toMapWithUser(item: RpcMixedFeedItem): MapWithUser {
  const tags: TagBasicInfo[] = item.map_tags
    ? (item.map_tags as Array<{ id: string; name: string; slug: string }>)
    : [];

  const user: UserBasicInfo | null = item.map_user_id
    ? {
        id: item.map_user_id,
        username: item.map_user_username || '',
        display_name: item.map_user_display_name || null,
        avatar_url: item.map_user_avatar_url || null,
      }
    : null;

  return {
    id: item.map_id!,
    name: item.map_name || '',
    description: item.map_description || null,
    thumbnail_url: item.map_thumbnail_url || null,
    thumbnail_crop: item.map_thumbnail_crop || null,
    is_public: item.map_is_public ?? true,
    is_official: false, // RPCでは取得していない
    spots_count: item.map_spots_count ?? 0,
    likes_count: item.map_likes_count ?? 0,
    bookmarks_count: item.map_bookmarks_count ?? 0,
    comments_count: item.map_comments_count ?? 0,
    category_id: item.map_category_id || null,
    language: item.map_language || 'ja',
    user_id: item.map_user_id || '',
    article_intro: null, // RPCでは取得していない
    article_outro: null, // RPCでは取得していない
    show_label_chips: false, // RPCでは取得していない
    created_at: item.created_at,
    updated_at: item.created_at, // RPCでは取得していないのでcreated_atを使用
    user,
    tags,
    // いいね・ブックマーク状態
    is_liked: item.map_is_liked ?? false,
    is_bookmarked: item.map_is_bookmarked ?? false,
  };
}

/**
 * RPC結果をSpotWithDetailsに変換
 */
function toSpotWithDetails(item: RpcMixedFeedItem): SpotWithDetails {
  const masterSpot: MasterSpotBasicInfo | null = item.spot_master_spot_id
    ? {
        id: item.spot_master_spot_id,
        name: item.spot_master_spot_name || {},
        latitude: item.spot_master_spot_latitude || 0,
        longitude: item.spot_master_spot_longitude || 0,
        google_place_id: item.spot_master_spot_google_place_id || null,
        google_formatted_address: item.spot_master_spot_google_formatted_address || null,
        google_short_address: item.spot_master_spot_google_short_address || null,
        google_types: item.spot_master_spot_google_types || null,
      }
    : null;

  const user: UserBasicInfo | null = item.spot_user_id
    ? {
        id: item.spot_user_id,
        username: item.spot_user_username || '',
        display_name: item.spot_user_display_name || null,
        avatar_url: item.spot_user_avatar_url || null,
      }
    : null;

  // 画像URLの配列を変換
  const imageUrls: string[] = item.spot_image_urls
    ? (item.spot_image_urls as string[])
    : [];

  // タグ情報を変換
  const tags: TagBasicInfo[] = item.spot_tags
    ? (item.spot_tags as Array<{ id: string; name: string; slug: string }>)
    : [];

  return {
    id: item.spot_id!,
    user_id: item.spot_user_id || '',
    map_id: item.spot_map_id || '',
    master_spot_id: item.spot_master_spot_id || null,
    machi_id: item.spot_machi_id || null,
    description: item.spot_description || '',
    spot_color: item.spot_spot_color || null,
    label_id: item.spot_label_id || null,
    name: item.spot_name || null,
    images_count: item.spot_images_count ?? 0,
    likes_count: item.spot_likes_count ?? 0,
    bookmarks_count: item.spot_bookmarks_count ?? 0,
    comments_count: item.spot_comments_count ?? 0,
    order_index: item.spot_order_index ?? 0,
    created_at: item.created_at,
    updated_at: item.created_at, // RPCでは取得していないのでcreated_atを使用
    latitude: item.spot_latitude || null,
    longitude: item.spot_longitude || null,
    google_formatted_address: item.spot_google_formatted_address || null,
    google_short_address: item.spot_google_short_address || null,
    master_spot: masterSpot,
    user,
    map: item.spot_map_id
      ? { id: item.spot_map_id, name: item.spot_map_name || '' }
      : null,
    is_public: item.spot_is_public ?? true,
    article_content: item.spot_article_content as SpotWithDetails['article_content'],
    image_urls: imageUrls,
    tags,
    // いいね・ブックマーク状態
    is_liked: item.spot_is_liked ?? false,
    is_bookmarked: item.spot_is_bookmarked ?? false,
    // ショート動画URL
    video_url: item.spot_video_url || null,
    // サムネイルクロップ
    thumbnail_image_id: item.spot_thumbnail_image_id || null,
    thumbnail_crop: item.spot_thumbnail_crop || null,
  };
}

/**
 * RPC結果をMixedFeedItemに変換
 */
export function toMixedFeedItem(item: RpcMixedFeedItem): MixedFeedItem {
  if (item.item_type === 'map') {
    return {
      type: 'map',
      data: toMapWithUser(item),
      createdAt: item.created_at,
    };
  }
  if (item.item_type === 'ad') {
    return {
      type: 'ad',
      adSlot: item.ad_slot as AdSlot,
      feedPosition: item.feed_position ?? 0,
    };
  }
  // spot: spot_display_typeで表示タイプを決定
  const displayType: SpotDisplayType =
    item.spot_display_type === 'short' ? 'short' : 'card';
  return {
    type: 'spot',
    data: toSpotWithDetails(item),
    createdAt: item.created_at,
    displayType,
  };
}

/**
 * RPC結果の配列をMixedFeedItemの配列に変換
 */
export function transformMixedFeedItems(items: RpcMixedFeedItem[]): MixedFeedItem[] {
  return items.map(toMixedFeedItem);
}
