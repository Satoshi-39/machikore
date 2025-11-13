/**
 * データベース初期化処理
 */

import * as FileSystem from 'expo-file-system/legacy';
import {
  initializeDatabase,
  checkTableExists,
  bulkInsertPrefectures,
  bulkInsertCities,
  bulkInsertMachi,
  getPrefectureCount,
  getCityCount,
  getMachiCount,
} from '@/shared/api/sqlite';
import { getPrefecturesData, getCitiesData, getMachiData } from '@/shared/lib';
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
      const dbPath = `${FileSystem.documentDirectory}SQLite/machilog.db`;
      console.log('📂 データベースパス:', dbPath);
    }

    // テーブルが存在しない場合は作成
    const prefecturesTableExists = checkTableExists('prefectures');
    const citiesTableExists = checkTableExists('cities');
    const machiTableExists = checkTableExists('machi');
    const likesTableExists = checkTableExists('likes');
    const usersTableExists = checkTableExists('users');

    if (
      !prefecturesTableExists ||
      !citiesTableExists ||
      !machiTableExists ||
      !likesTableExists ||
      !usersTableExists
    ) {
      console.log('📦 テーブルを作成中...');
      initializeDatabase();
      console.log('✅ テーブル作成完了');
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

    // 市区町村データをチェック
    const cityCount = getCityCount();

    if (cityCount === 0) {
      console.log('🏙️ 市区町村データを読み込み中...');
      const citiesData = getCitiesData();
      bulkInsertCities(citiesData);
      console.log(`✅ ${citiesData.length}件の市区町村データを読み込み完了`);
    } else {
      console.log(`✅ 市区町村データはすでに存在 (${cityCount}件)`);
    }

    // 街データをチェック
    const machiCount = getMachiCount();

    if (machiCount === 0) {
      console.log('🏘️ 街データを読み込み中...');
      const machiData = getMachiData();
      bulkInsertMachi(machiData);
      console.log(`✅ ${machiData.length}件の街データを読み込み完了`);
    } else {
      console.log(`✅ 街データはすでに存在 (${machiCount}件)`);
    }

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
