/**
 * AdMob初期化
 *
 * ATT（App Tracking Transparency）のリクエスト後にAdMobを初期化する。
 */

import { initializeAdMob } from '@/shared/config/admob';
import { requestTrackingPermission } from '@/shared/lib/tracking';
import { log } from '@/shared/config/logger';

/**
 * ATTリクエスト → AdMob初期化の順序で実行
 */
export async function initAdMob(): Promise<void> {
  try {
    // ATTダイアログを表示（AdMob初期化の前に行う必要がある）
    await requestTrackingPermission();

    // AdMob SDKを初期化
    await initializeAdMob();
  } catch (error) {
    // AdMob初期化失敗はアプリの動作に致命的ではないため、警告のみ
    log.warn('[initAdMob] Failed to initialize:', error);
  }
}
