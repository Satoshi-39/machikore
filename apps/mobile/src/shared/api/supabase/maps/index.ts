/**
 * Supabase Maps API
 * 公開マップの取得など
 */

// 型定義
export {
  type SupabaseMapResponse,
  mapResponseToMapWithUser,
  // 検索フィルター型
  type MapSearchFilters,
} from './types';

// 単一マップ取得
export { getMapById } from './get-map';

// マップ一覧取得
export { getPublicMaps, getUserPublicMaps, getUserMaps } from './get-maps';

// マップ作成
export { createMap, type CreateMapParams } from './create-map';

// マップ更新
export { updateMap, type UpdateMapParams } from './update-map';

// マップ削除
export { deleteMap } from './delete-map';

// マップスポット取得
export { getMapSpots, getPublicMapSpots, getPublicSpotsCount } from './get-map-spots';

// マップ記事
export { getMapArticle, updateSpotArticleContent } from './map-article';

// マップ検索
export {
  searchPublicMaps,
  searchPublicMapsByTag,
  searchPublicMapsByCategoryId,
} from './search-maps';

// カテゴリ別マップ
export { getPopularMapsByCategory, getLatestMapsByCategory } from './category-maps';

// フォロー中ユーザーのマップ
export { getFollowingUsersMaps } from './following-maps';
