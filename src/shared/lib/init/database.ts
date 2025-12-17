/**
 * データベース初期化処理
 */

import * as FileSystem from 'expo-file-system/legacy';
import {
  initializeDatabase,
  runMigrations,
  bulkInsertContinents,
  bulkInsertCountries,
  bulkInsertRegions,
  bulkInsertPrefectures,
  getContinentCount,
  getCountryCount,
  getRegionCount,
  getPrefectureCount,
} from '@/shared/api/sqlite';
import { getContinentsData, getCountriesData, getRegionsData, getPrefecturesData } from '@/shared/lib';
import { seedSampleData } from './seed-data';
import { cleanupSampleData } from './cleanup-data';
import { log } from '@/shared/config/logger';

/**
 * データベースを初期化（Stage 1: 認証不要）
 * テーブル作成と地域データの投入のみ
 */
export async function initDatabase(): Promise<void> {
  try {
    log.debug('[Database] 初期化開始...');

    // データベースパスをログ出力
    if (FileSystem.documentDirectory) {
      const dbPath = `${FileSystem.documentDirectory}SQLite/machikore.db`;
      log.debug('[Database] パス:', dbPath);
    }

    // 開発環境では常にデータベースを再作成（スキーマ変更に対応）
    log.debug('[Database] 再作成中...');
    initializeDatabase();
    log.debug('[Database] テーブル作成完了');

    // マイグレーション実行
    log.debug('[Database] マイグレーション実行中...');
    runMigrations();
    log.debug('[Database] マイグレーション完了');

    // 大陸データをチェック
    const continentCount = getContinentCount();

    if (continentCount === 0) {
      log.debug('[Database] 大陸データを読み込み中...');
      const continentsData = getContinentsData();
      bulkInsertContinents(continentsData);
      log.debug(`[Database] ${continentsData.length}件の大陸データを読み込み完了`);
    } else {
      log.debug(`[Database] 大陸データはすでに存在 (${continentCount}件)`);
    }

    // 国データをチェック
    const countryCount = getCountryCount();

    if (countryCount === 0) {
      log.debug('[Database] 国データを読み込み中...');
      const countriesData = getCountriesData();
      bulkInsertCountries(countriesData);
      log.debug(`[Database] ${countriesData.length}件の国データを読み込み完了`);
    } else {
      log.debug(`[Database] 国データはすでに存在 (${countryCount}件)`);
    }

    // 地方データをチェック
    const regionCount = getRegionCount();

    if (regionCount === 0) {
      log.debug('[Database] 地方データを読み込み中...');
      const regionsData = getRegionsData();
      bulkInsertRegions(regionsData);
      log.debug(`[Database] ${regionsData.length}件の地方データを読み込み完了`);
    } else {
      log.debug(`[Database] 地方データはすでに存在 (${regionCount}件)`);
    }

    // 都道府県データをチェック
    const prefectureCount = getPrefectureCount();

    if (prefectureCount === 0) {
      log.debug('[Database] 都道府県データを読み込み中...');
      const prefecturesData = getPrefecturesData();
      bulkInsertPrefectures(prefecturesData);
      log.debug(`[Database] ${prefecturesData.length}件の都道府県データを読み込み完了`);
    } else {
      log.debug(`[Database] 都道府県データはすでに存在 (${prefectureCount}件)`);
    }

    // 街・市区町村データはSupabaseからオンデマンドで取得するため、
    // ここでは初期化しない（machi-cache-service.tsで管理）
    log.debug('[Database] 街・市区町村データはSupabaseからオンデマンド取得');

    log.info('[Database] 初期化完了（Stage 1）');
  } catch (error) {
    log.error('[Database] 初期化エラー:', error);
    throw error;
  }
}

/**
 * 開発用サンプルデータを投入（Stage 2: 認証後）
 * 認証完了後に AuthProvider から呼び出される
 */
export async function seedDevelopmentData(): Promise<void> {
  try {
    log.debug('[Database] サンプルデータをリセット中...');
    cleanupSampleData();
    await seedSampleData();
  } catch (error) {
    log.error('[Database] サンプルデータ投入エラー:', error);
    // エラーが起きてもアプリの起動は継続
  }
}
