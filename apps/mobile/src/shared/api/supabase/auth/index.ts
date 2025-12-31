/**
 * 認証API
 *
 * Supabase認証関連の関数をエクスポート
 * セッション管理はSupabaseクライアントが自動で行う（SecureStorageAdapterを使用）
 */

// OTPコード認証
export {
  sendOtpCode,
  verifyOtpCode,
} from './otp';

// OAuth認証（Google/Apple）
export {
  signInWithGoogle,
  signInWithApple,
  handleOAuthCallback,
} from './oauth';

// セッション管理
export {
  signOut,
  getCurrentUser,
} from './session';

// ユーザーテーブル操作
export {
  getUserById,
  upsertUserToSupabase,
} from './users';
