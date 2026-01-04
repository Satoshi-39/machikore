/**
 * User 型定義
 */

/** ユーザー一覧用 */
export type User = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  status: string;
  is_premium: boolean | null;
  created_at: string;
};

/** ユーザー検索パラメータ */
export type GetUsersParams = {
  query?: string;
  status?: string;
  limit?: number;
};

/** ユーザー詳細用 */
export type UserDetail = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  status: string;
  is_premium: boolean | null;
  premium_started_at: string | null;
  premium_expires_at: string | null;
  age_group: string | null;
  gender: string | null;
  country: string | null;
  prefecture: string | null;
  created_at: string;
  updated_at: string;
  suspended_at: string | null;
  suspended_reason: string | null;
};

/** ユーザーのマップ一覧用 */
export type UserMap = {
  id: string;
  name: string;
  is_public: boolean;
  created_at: string;
};

/** ユーザーのスポット一覧用 */
export type UserSpotSummary = {
  id: string;
  description: string;
  created_at: string;
};
