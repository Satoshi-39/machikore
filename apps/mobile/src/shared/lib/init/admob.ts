/**
 * AdMob初期化
 */

import { initializeAdMob } from '@/shared/config/admob';
import { log } from '@/shared/config/logger';

/**
 * AdMobを初期化
 */
export async function initAdMob(): Promise<void> {
  try {
    await initializeAdMob();
  } catch (error) {
    // AdMob初期化失敗はアプリの動作に致命的ではないため、警告のみ
    log.warn('[initAdMob] Failed to initialize:', error);
  }
}
