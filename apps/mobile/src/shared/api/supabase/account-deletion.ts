/**
 * アカウント削除 API
 *
 * Edge Functionを呼び出してアカウント削除リクエストを管理
 */

import { supabase } from './client';

interface DeletionRequest {
  id: string;
  user_id: string;
  requested_at: string;
  scheduled_at: string;
  status: 'pending' | 'cancelled' | 'completed';
  cancelled_at: string | null;
  completed_at: string | null;
}

interface CreateDeletionResponse {
  success: boolean;
  message?: string;
  scheduled_at?: string;
  error?: string;
}

interface CancelDeletionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface DeletionStatusResponse {
  success: boolean;
  has_pending_request: boolean;
  request: DeletionRequest | null;
  error?: string;
}

/**
 * 削除リクエストを作成
 * @param reason 退会理由（任意）
 * @returns 成功時: scheduled_at（削除予定日時）を含むレスポンス
 */
export async function createDeletionRequest(reason?: string): Promise<CreateDeletionResponse> {
  try {
    const { data, error } = await supabase.functions.invoke<CreateDeletionResponse>(
      'account-deletion',
      {
        body: { action: 'create', reason },
      }
    );

    if (error) {
      console.error('[createDeletionRequest] Edge Function error:', error);
      return { success: false, error: error.message };
    }

    return data ?? { success: false, error: 'No response' };
  } catch (err) {
    console.error('[createDeletionRequest] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 削除リクエストをキャンセル
 */
export async function cancelDeletionRequest(): Promise<CancelDeletionResponse> {
  try {
    const { data, error } = await supabase.functions.invoke<CancelDeletionResponse>(
      'account-deletion',
      {
        body: { action: 'cancel' },
      }
    );

    if (error) {
      console.error('[cancelDeletionRequest] Edge Function error:', error);
      return { success: false, error: error.message };
    }

    return data ?? { success: false, error: 'No response' };
  } catch (err) {
    console.error('[cancelDeletionRequest] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * メールアドレスが退会リクエスト中かチェック
 * サインアップ時に使用（認証不要）
 */
export async function checkEmailHasPendingDeletion(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_email_has_pending_deletion', {
      check_email: email.trim().toLowerCase(),
    });

    if (error) {
      console.error('[checkEmailHasPendingDeletion] RPC error:', error);
      return false; // エラー時は登録を許可（フェイルセーフ）
    }

    return data ?? false;
  } catch (err) {
    console.error('[checkEmailHasPendingDeletion] Exception:', err);
    return false;
  }
}

/**
 * 現在の削除リクエストの状態を取得
 */
export async function getDeletionStatus(): Promise<DeletionStatusResponse> {
  try {
    const { data, error } = await supabase.functions.invoke<DeletionStatusResponse>(
      'account-deletion',
      {
        body: { action: 'status' },
      }
    );

    if (error) {
      console.error('[getDeletionStatus] Edge Function error:', error);
      return { success: false, has_pending_request: false, request: null, error: error.message };
    }

    return data ?? { success: false, has_pending_request: false, request: null, error: 'No response' };
  } catch (err) {
    console.error('[getDeletionStatus] Exception:', err);
    return {
      success: false,
      has_pending_request: false,
      request: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
