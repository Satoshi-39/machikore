/**
 * サンプルデータ投入
 */

import * as Crypto from 'expo-crypto';
import {
  insertSchedule,
  insertVisit,
  insertUser,
  getUserById,
  getUserByUsername,
  updateUser,
  getTotalScheduleCount,
  getTotalVisitedMachiCount,
} from '@/shared/api/sqlite';
import { copyAssetToFileSystem } from '@/shared/lib';
import { getCurrentUserId } from '@/entities/user/model';
import type { ScheduleRow, VisitRow, UserRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

// 訪問記録のID（投稿との紐付け用）
// 固定値にすることで、再起動時の重複を防ぐ
const VISIT_IDS = {
  shibuya: 'sample_visit_shibuya_001',
  shimokitazawa: 'sample_visit_shimokitazawa_001',
  ebisu: 'sample_visit_ebisu_001',
  nakameguro: 'sample_visit_nakameguro_001',
  kayabacho: 'sample_visit_kayabacho_001',
};

/**
 * サンプルデータを投入
 */
export async function seedSampleData(): Promise<void> {
  try {
    log.debug('[SeedData] 投入開始...');

    // ユーザーIDを取得（認証完了後）
    const userId = getCurrentUserId();
    if (!userId) {
      log.warn('[SeedData] ユーザーIDが取得できません。認証が完了していない可能性があります。');
      return;
    }

    // サンプルユーザーを作成
    await createSampleUser(userId);

    // 現在のデータ数を確認
    const currentScheduleCount = getTotalScheduleCount(userId);
    const currentVisitCount = getTotalVisitedMachiCount(userId);
    log.debug(
      `[SeedData] 現在の予定数: ${currentScheduleCount}, 訪問数: ${currentVisitCount}`
    );

    // 訪問記録データ作成
    createSampleVisits(userId);

    // 予定データ作成
    createSampleSchedules(userId);

    // 投稿データ作成（スポットアーキテクチャに移行したためコメントアウト）
    // createSamplePosts(userId);

    // 投入後のデータ数を確認
    const afterScheduleCount = getTotalScheduleCount(userId);
    const afterVisitCount = getTotalVisitedMachiCount(userId);
    log.debug(
      `[SeedData] 投入後の予定数: ${afterScheduleCount}, 訪問数: ${afterVisitCount}`
    );

    log.info('[SeedData] 投入完了');
  } catch (error) {
    log.error('[SeedData] 投入エラー:', error);
    throw error;
  }
}

/**
 * サンプルユーザーを作成
 */
async function createSampleUser(userId: string): Promise<void> {
  const now = new Date().toISOString();

  // 既存ユーザーをチェック（IDまたはusernameで）
  const existingUserById = getUserById(userId);
  const existingUserByUsername = getUserByUsername('sample_user');

  if (existingUserById || existingUserByUsername) {
    const existingUser = existingUserById || existingUserByUsername!;
    log.debug('[SeedData] ユーザーは既に存在します（認証で作成済み）');

    // アバター画像をコピー（まだ設定されていない場合）
    if (!existingUser.avatar_url) {
      try {
        const assetModule = require('@assets/images/tyatsushi.png');
        const avatarUri = await copyAssetToFileSystem(assetModule, 'tyatsushi.png');
        log.debug('[SeedData] アバター画像をコピー:', avatarUri);

        // ユーザー情報を更新
        updateUser(existingUser.id, {
          avatar_url: avatarUri,
          display_name: 'サンプルユーザー',
          bio: 'サンプルユーザーです',
          updated_at: now,
        });
        log.debug('[SeedData] 既存ユーザーの情報を更新');
      } catch (error) {
        log.warn('[SeedData] アバター画像のコピーに失敗:', error);
      }
    }
    return;
  }

  // 新規ユーザーを作成
  let avatarUri: string | null = null;
  try {
    const assetModule = require('@assets/images/tyatsushi.png');
    avatarUri = await copyAssetToFileSystem(assetModule, 'tyatsushi.png');
    log.debug('[SeedData] アバター画像をコピー:', avatarUri);
  } catch (error) {
    log.warn('[SeedData] アバター画像のコピーに失敗:', error);
  }

  const user: UserRow = {
    id: userId,
    email: 'sample@example.com',
    username: 'sample_user',
    display_name: 'サンプルユーザー',
    avatar_url: avatarUri,
    avatar_crop: null,
    bio: 'サンプルユーザーです',
    is_premium: false,
    premium_started_at: null,
    premium_expires_at: null,
    push_token: null,
    push_token_updated_at: null,
    gender: null,
    age_group: null,
    country: null,
    prefecture: null,
    deletion_requested_at: null,
    onboarding_completed_at: null,
    status: 'active',
    suspended_at: null,
    suspended_reason: null,
    created_at: now,
    updated_at: now,
  };

  insertUser(user);
  log.debug('[SeedData] サンプルユーザーを作成');
}

/**
 * サンプル予定を作成
 */
function createSampleSchedules(userId: string): void {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const schedules: ScheduleRow[] = [
    // 今日の予定
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      machi_id: 'machi_setagaya_shimokitazawa',
      scheduled_at: new Date(today.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 今日 10:00
      title: 'カフェで作業',
      memo: '新しいカフェを探してみる',
      is_completed: false,
      completed_at: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 明日の予定
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      machi_id: 'machi_shibuya_ebisu',
      scheduled_at: new Date(
        today.getTime() + 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ).toISOString(), // 明日 14:00
      title: '友人とランチ',
      memo: null,
      is_completed: false,
      completed_at: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 3日後の予定
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      machi_id: 'machi_meguro_nakameguro',
      scheduled_at: new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      ).toISOString(), // 3日後 18:00
      title: '映画鑑賞',
      memo: '新作映画をチェック',
      is_completed: false,
      completed_at: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 来週の予定（完了済み）
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      machi_id: 'machi_chiyoda_kayabacho',
      scheduled_at: new Date(
        today.getTime() + 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      ).toISOString(), // 7日後 10:00
      title: 'ジムトレーニング',
      memo: null,
      is_completed: true,
      completed_at: now.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ];

  schedules.forEach((schedule) => insertSchedule(schedule));
  log.debug(`[SeedData] ${schedules.length}件の予定を作成`);
}

/**
 * サンプル投稿を作成
 * NOTE: Post → Spot アーキテクチャに移行したため、この関数は使用されていません
 */
/*
function createSamplePosts(userId: string): void {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const posts: any[] = [
    // 渋谷訪問の自動生成投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '渋谷チェックイン（3回目の訪問）',
      machi_id: 'machi_shibuya_shibuya',
      visit_id: VISIT_IDS.shibuya,
      is_auto_generated: 1,
      is_draft: 0,
      likes_count: 2,
      comments_count: 0,
      created_at: new Date(
        today.getTime() - 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ).toISOString(), // 昨日 14:00
      updated_at: new Date(
        today.getTime() - 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 渋谷訪問に紐づく手動投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '新しいカフェを発見しました。コーヒーが美味しかった！渋谷はいつも新しい発見がありますね。',
      machi_id: 'machi_shibuya_shibuya',
      visit_id: VISIT_IDS.shibuya,
      is_auto_generated: 0,
      is_draft: 0,
      likes_count: 5,
      comments_count: 2,
      created_at: new Date(
        today.getTime() - 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000
      ).toISOString(), // 昨日 15:00
      updated_at: new Date(
        today.getTime() - 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 下北沢訪問の自動生成投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '下北沢チェックイン（2回目の訪問）',
      machi_id: 'machi_setagaya_shimokitazawa',
      visit_id: VISIT_IDS.shimokitazawa,
      is_auto_generated: 1,
      is_draft: 0,
      likes_count: 1,
      comments_count: 0,
      created_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ).toISOString(), // 3日前 12:00
      updated_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 下北沢訪問に紐づく手動投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '下北沢の古着屋巡りをしてきました。素敵なヴィンテージジャケットを発見！',
      machi_id: 'machi_setagaya_shimokitazawa',
      visit_id: VISIT_IDS.shimokitazawa,
      is_auto_generated: 0,
      is_draft: 0,
      likes_count: 3,
      comments_count: 1,
      created_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000
      ).toISOString(), // 3日前 13:00
      updated_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 恵比寿訪問の自動生成投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '恵比寿チェックイン（1回目の訪問）',
      machi_id: 'machi_shibuya_ebisu',
      visit_id: VISIT_IDS.ebisu,
      is_auto_generated: 1,
      is_draft: 0,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000
      ).toISOString(), // 5日前 16:00
      updated_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 恵比寿訪問に紐づく手動投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '恵比寿ガーデンプレイスでディナー。大人な雰囲気でとても素敵な時間でした✨',
      machi_id: 'machi_shibuya_ebisu',
      visit_id: VISIT_IDS.ebisu,
      is_auto_generated: 0,
      is_draft: 0,
      likes_count: 8,
      comments_count: 0,
      created_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ).toISOString(), // 5日前 17:00
      updated_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // 訪問記録に紐づかない通常投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '今日はいい天気！散歩日和です☀️',
      machi_id: null,
      visit_id: null,
      is_auto_generated: 0,
      is_draft: 0,
      likes_count: 4,
      comments_count: 1,
      created_at: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 今日 9:00
      updated_at: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
    // もう1つ通常投稿
    {
      id: Crypto.randomUUID(),
      user_id: userId,
      content: '週末は公園でピクニック。リフレッシュできました🌳',
      machi_id: null,
      visit_id: null,
      is_auto_generated: 0,
      is_draft: 0,
      likes_count: 6,
      comments_count: 0,
      created_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ).toISOString(), // 2日前 12:00
      updated_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ).toISOString(),
      synced_at: null,
      is_synced: 0,
    },
  ];

  posts.forEach((post) => {
    // insertPost(post); // コメントアウト
  });
  console.log(`📝 ${posts.length}件の投稿を作成`);
}
*/

/**
 * サンプル訪問記録を作成
 */
function createSampleVisits(userId: string): void {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const visits: VisitRow[] = [
    // 昨日訪問
    {
      id: VISIT_IDS.shibuya,
      user_id: userId,
      machi_id: 'machi_shibuya_shibuya',
      visited_at: new Date(
        today.getTime() - 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      ).toISOString(), // 昨日 14:00
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 3日前訪問
    {
      id: VISIT_IDS.shimokitazawa,
      user_id: userId,
      machi_id: 'machi_setagaya_shimokitazawa',
      visited_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000
      ).toISOString(), // 3日前 12:00
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 5日前訪問
    {
      id: VISIT_IDS.ebisu,
      user_id: userId,
      machi_id: 'machi_shibuya_ebisu',
      visited_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000
      ).toISOString(), // 5日前 16:00
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 1週間前訪問
    {
      id: VISIT_IDS.nakameguro,
      user_id: userId,
      machi_id: 'machi_meguro_nakameguro',
      visited_at: new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
      ).toISOString(), // 7日前 11:00
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // 10日前訪問
    {
      id: VISIT_IDS.kayabacho,
      user_id: userId,
      machi_id: 'machi_chiyoda_kayabacho',
      visited_at: new Date(
        today.getTime() - 10 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      ).toISOString(), // 10日前 9:00
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ];

  visits.forEach((visit) => insertVisit(visit));
  log.debug(`[SeedData] ${visits.length}件の訪問記録を作成`);
}
