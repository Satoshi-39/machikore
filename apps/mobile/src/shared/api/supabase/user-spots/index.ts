/**
 * Supabase User Spots API
 * ユーザースポットのCRUD・検索
 */

// 型定義
export {
  type CreateSpotInput,
  type UpdateSpotInput,
  type UserSpotImage,
  type UserSpotSearchResult,
  type MapSpotSearchResult,
  type MasterSpotInsert,
  type MasterSpotRow,
  type UserSpotInsert,
  type UserSpotRow,
  // 検索フィルター型
  type DateRange,
  type SortBy,
  type SpotSearchFilters,
} from './types';

// スポット作成
export { createSpot } from './create-spot';

// 単一スポット取得
export { getSpotWithDetails } from './get-spot';

// スポット一覧取得
export { getSpotsByMapId, getPublicSpots } from './get-spots';

// スポット更新
export { updateSpot } from './update-spot';

// スポット削除
export { deleteSpot } from './delete-spot';

// スポット検索
export { searchPublicUserSpots, searchSpotsByMapId, searchPublicSpotsByTag } from './search-spots';

// 都道府県別スポット
export {
  getPublicSpotsByPrefecture,
  getPublicSpotsByPrefectureAndCategory,
} from './prefecture-spots';

// master_spot関連
export { getUserSpotsByMasterSpotId } from './master-spot-posts';
