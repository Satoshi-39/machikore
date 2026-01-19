/**
 * ユーザーの型定義
 */

// デモグラフィック型はconfigから再エクスポート
export type {
  Gender,
  AgeGroup,
  DemographicsData,
} from '@/shared/config/demographics';

/** プロフィール更新用の型 */
export interface ProfileUpdateData {
  username?: string;
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

/**
 * ユーザー検索結果の型
 */
export interface UserSearchResult {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}
