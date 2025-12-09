/**
 * Supabase Reports API
 * 報告機能
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export type ReportTargetType = 'map' | 'spot' | 'user' | 'comment';
export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'copyright' | 'other';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason?: ReportReason;
  description?: string;
}

// ===============================
// 報告作成
// ===============================

/**
 * 報告を作成
 */
export async function createReport(input: CreateReportInput): Promise<Report> {
  const { reporterId, targetType, targetId, reason = 'other', description } = input;

  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      target_type: targetType,
      target_id: targetId,
      reason,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('createReport', error);
  }

  return data;
}

// ===============================
// 報告確認
// ===============================

/**
 * ユーザーが特定の対象を既に報告済みかチェック
 */
export async function checkAlreadyReported(
  reporterId: string,
  targetType: ReportTargetType,
  targetId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reports')
    .select('id')
    .eq('reporter_id', reporterId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .in('status', ['pending', 'reviewing'])
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkAlreadyReported', error);
  }

  return data !== null;
}

// ===============================
// ユーザーの報告一覧
// ===============================

/**
 * ユーザーの報告一覧を取得
 */
export async function getUserReports(userId: string, limit: number = 50): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    handleSupabaseError('getUserReports', error);
  }

  return data || [];
}
