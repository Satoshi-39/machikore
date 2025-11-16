/**
 * Spot ビジネスロジック
 */

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { SpotRow } from '@/shared/types/database.types';
import type { CreateSpotParams } from './types';

// ===============================
// スポット作成
// ===============================

/**
 * 新規スポットデータを作成
 */
export function createSpotData(params: CreateSpotParams): SpotRow {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    map_id: params.mapId,
    user_id: params.userId,
    machi_id: params.machiId,
    name: params.name,
    address: params.address || null,
    latitude: params.latitude,
    longitude: params.longitude,
    memo: params.memo || null,
    images_count: 0,
    likes_count: 0,
    comments_count: 0,
    order_index: 0,
    created_at: now,
    updated_at: now,
    synced_at: null,
    is_synced: 0,
  };
}

// ===============================
// バリデーション
// ===============================

/**
 * スポット作成パラメータのバリデーション
 */
export function validateCreateSpotParams(
  params: CreateSpotParams
): { valid: boolean; error?: string } {
  if (!params.userId || params.userId.trim() === '') {
    return { valid: false, error: 'ユーザーIDが必要です' };
  }

  if (!params.name || params.name.trim() === '') {
    return { valid: false, error: 'スポット名が必要です' };
  }

  if (params.name.length > 100) {
    return { valid: false, error: 'スポット名は100文字以内にしてください' };
  }

  if (params.memo && params.memo.length > 2000) {
    return { valid: false, error: 'メモは2000文字以内にしてください' };
  }

  if (params.images && params.images.length > 10) {
    return { valid: false, error: '画像は10枚まで添付できます' };
  }

  return { valid: true };
}

// ===============================
// フォーマット
// ===============================

/**
 * スポット日時を日本語フォーマットで取得
 */
export function formatSpotDate(createdAt: string): string {
  const date = new Date(createdAt);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * スポット日時を相対時間で取得
 */
export function getRelativeSpotTime(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'たった今';
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInHours < 24) return `${diffInHours}時間前`;
  if (diffInDays < 7) return `${diffInDays}日前`;
  return formatSpotDate(createdAt);
}

// ===============================
// ソート・フィルタ
// ===============================

/**
 * スポットを日付でソート（新しい順）
 */
export function sortSpotsByDate(spots: SpotRow[]): SpotRow[] {
  return [...spots].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * スポットを並び順でソート
 */
export function sortSpotsByOrder(spots: SpotRow[]): SpotRow[] {
  return [...spots].sort((a, b) => a.order_index - b.order_index);
}
