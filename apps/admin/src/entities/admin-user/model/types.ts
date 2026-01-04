/**
 * Admin User 型定義
 */

/** 管理者一覧用 */
export type AdminUser = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user: {
    email: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
};

/** 現在の管理者用 */
export type CurrentAdmin = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
};
