/**
 * データベース初期化処理
 */

import * as FileSystem from 'expo-file-system/legacy';
import {
  initializeDatabase,
  runMigrations,
  bulkInsertRegions,
  bulkInsertPrefectures,
  getRegionCount,
  getPrefectureCount,
} from '@/shared/api/sqlite';
import { getRegionsData, getPrefecturesData } from '@/shared/lib';
import { seedSampleData } from './seed-data';
import { cleanupSampleData } from './cleanup-data';

/**
 * データベースを初期化（Stage 1: 認証不要）
 * テーブル作成と地域データの投入のみ
 */
export async function initDatabase(): Promise<void> {
  try {
    console.log('🗄️ データベース初期化開始...');

    // データベースパスをログ出力
    if (FileSystem.documentDirectory) {
      const dbPath = `${FileSystem.documentDirectory}SQLite/machikore.db`;
      console.log('📂 データベースパス:', dbPath);
    }

    // 開発環境では常にデータベースを再作成（スキーマ変更に対応）
    console.log('🔄 データベースを再作成中...');
    initializeDatabase();
    console.log('✅ テーブル作成完了');

    // マイグレーション実行
    console.log('🔄 マイグレーション実行中...');
    runMigrations();
    console.log('✅ マイグレーション完了');

    // 地方データをチェック
    const regionCount = getRegionCount();

    if (regionCount === 0) {
      console.log('🌏 地方データを読み込み中...');
      const regionsData = getRegionsData();
      bulkInsertRegions(regionsData);
      console.log(`✅ ${regionsData.length}件の地方データを読み込み完了`);
    } else {
      console.log(`✅ 地方データはすでに存在 (${regionCount}件)`);
    }

    // 都道府県データをチェック
    const prefectureCount = getPrefectureCount();

    if (prefectureCount === 0) {
      console.log('🗾 都道府県データを読み込み中...');
      const prefecturesData = getPrefecturesData();
      bulkInsertPrefectures(prefecturesData);
      console.log(`✅ ${prefecturesData.length}件の都道府県データを読み込み完了`);
    } else {
      console.log(`✅ 都道府県データはすでに存在 (${prefectureCount}件)`);
    }

    // 街・市区町村データはSupabaseからオンデマンドで取得するため、
    // ここでは初期化しない（machi-cache-service.tsで管理）
    console.log('📍 街・市区町村データはSupabaseからオンデマンド取得');

    console.log('🎉 データベース初期化完了（Stage 1）');
  } catch (error) {
    console.error('❌ データベース初期化エラー:', error);
    throw error;
  }
}

/**
 * 開発用サンプルデータを投入（Stage 2: 認証後）
 * 認証完了後に AuthProvider から呼び出される
 */
export async function seedDevelopmentData(): Promise<void> {
  try {
    console.log('🔄 サンプルデータをリセット中...');
    cleanupSampleData();
    await seedSampleData();
  } catch (error) {
    console.error('❌ サンプルデータ投入エラー:', error);
    // エラーが起きてもアプリの起動は継続
  }
}
