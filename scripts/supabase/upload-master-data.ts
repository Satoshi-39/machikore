/**
 * マスターデータをSupabaseにアップロードするスクリプト
 *
 * アップロード対象:
 * - continents（大陸）
 * - countries（国）
 * - regions（地方）
 * - prefectures（都道府県）
 *
 * 使い方:
 *   npx tsx scripts/supabase/upload-master-data.ts [--dry-run]
 *
 * オプション:
 *   --dry-run  実際にはアップロードせず、件数のみ表示
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません:');
  console.error('  EXPO_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// サービスロールキーでSupabaseクライアントを作成（RLSバイパス）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DATA_DIR = path.join(__dirname, '../../src/shared/assets/data');

// 大陸とそのcountriesファイル名のマッピング
const CONTINENT_COUNTRIES_FILES: Record<string, string[]> = {
  east_asia: ['east_asia.json'],
  southeast_asia: ['southeast_asia.json'],
  south_asia: ['south_asia.json'],
  // central_asia: [],  // まだファイルなし
  west_asia: ['middle_east.json'],
  europe: ['europe.json'],
  north_america: ['north_america.json'],
  // central_america: [],  // まだファイルなし
  south_america: ['south_america.json'],
  oceania: ['oceania.json'],
  africa: ['africa.json'],
};

/**
 * Continentsをアップロード
 */
async function uploadContinents(dryRun: boolean): Promise<number> {
  const filePath = path.join(DATA_DIR, 'continents.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(`\n📍 Continents: ${data.length}件`);

  if (dryRun) return data.length;

  const rows = data.map((item: any) => ({
    id: item.id,
    name: item.name,
    name_kana: item.name_kana || null,
    name_translations: item.name_translations || null,
    display_order: item.display_order,
    latitude: item.latitude,
    longitude: item.longitude,
  }));

  const { error } = await supabase.from('continents').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('  ❌ continents挿入エラー:', error.message);
  } else {
    console.log('  ✅ continents挿入完了');
  }

  return data.length;
}

/**
 * Countriesをアップロード
 */
async function uploadCountries(dryRun: boolean): Promise<number> {
  let totalCount = 0;

  for (const [continentId, files] of Object.entries(CONTINENT_COUNTRIES_FILES)) {
    for (const file of files) {
      const filePath = path.join(DATA_DIR, 'countries', file);
      if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ ファイルなし: ${file}`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`  📍 ${file}: ${data.length}件`);
      totalCount += data.length;

      if (dryRun) continue;

      const rows = data.map((item: any) => ({
        // idはcountry_code形式（jp, kr, usなど）
        id: item.id,
        name: item.name,
        name_kana: item.name_kana || null,
        name_translations: item.name_translations || null,
        latitude: item.latitude,
        longitude: item.longitude,
        continent_id: continentId,
      }));

      const { error } = await supabase.from('countries').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error(`  ❌ countries挿入エラー (${file}):`, error.message);
      }
    }
  }

  if (!dryRun) {
    console.log('  ✅ countries挿入完了');
  }

  return totalCount;
}

/**
 * Regionsをアップロード
 */
async function uploadRegions(dryRun: boolean): Promise<number> {
  const regionsDir = path.join(DATA_DIR, 'regions');
  const files = fs.readdirSync(regionsDir).filter(f => f.endsWith('.json'));

  let totalCount = 0;

  for (const file of files) {
    const countryCode = file.replace('.json', ''); // jp, us, kr, etc.
    const filePath = path.join(regionsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`  📍 ${file}: ${data.length}件`);
    totalCount += data.length;

    if (dryRun) continue;

    const rows = data.map((item: any) => ({
      // idは既に{country}_{region}形式（例: jp_kanto）
      id: item.id,
      name: item.name,
      name_kana: item.name_kana || null,
      name_translations: item.name_translations || null,
      display_order: item.display_order || 0,
      latitude: item.latitude,
      longitude: item.longitude,
      country_id: countryCode,
    }));

    const { error } = await supabase.from('regions').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ regions挿入エラー (${file}):`, error.message);
    }
  }

  if (!dryRun) {
    console.log('  ✅ regions挿入完了');
  }

  return totalCount;
}

/**
 * Prefecturesをアップロード
 */
async function uploadPrefectures(dryRun: boolean): Promise<number> {
  const prefecturesDir = path.join(DATA_DIR, 'prefectures');
  const files = fs.readdirSync(prefecturesDir).filter(f => f.endsWith('.json'));

  let totalCount = 0;

  for (const file of files) {
    const countryCode = file.replace('.json', ''); // jp, us, kr, etc.
    const filePath = path.join(prefecturesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`  📍 ${file}: ${data.length}件`);
    totalCount += data.length;

    if (dryRun) continue;

    const rows = data.map((item: any) => ({
      // IDは既に{country}_{prefecture}形式（例: jp_tokyo）
      id: item.id,
      name: item.name,
      name_kana: item.name_kana || null,
      name_translations: item.name_translations || null,
      latitude: item.latitude,
      longitude: item.longitude,
      // region_idは{country}_{region}形式（例: jp_kanto）
      region_id: item.region_id,
    }));

    const { error } = await supabase.from('prefectures').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ prefectures挿入エラー (${file}):`, error.message);
    }
  }

  if (!dryRun) {
    console.log('  ✅ prefectures挿入完了');
  }

  return totalCount;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('============================================================');
  console.log('マスターデータ Supabaseアップロード');
  console.log('============================================================');
  console.log(`  モード: ${dryRun ? 'ドライラン（実際にはアップロードしない）' : '本番'}`);
  console.log('');

  // 順番に処理（外部キー制約のため親から子の順）
  console.log('【1. Continents】');
  const continentsCount = await uploadContinents(dryRun);

  console.log('\n【2. Countries】');
  const countriesCount = await uploadCountries(dryRun);

  console.log('\n【3. Regions】');
  const regionsCount = await uploadRegions(dryRun);

  console.log('\n【4. Prefectures】');
  const prefecturesCount = await uploadPrefectures(dryRun);

  console.log('\n============================================================');
  console.log('完了サマリー');
  console.log('============================================================');
  console.log(`  continents: ${continentsCount}件`);
  console.log(`  countries: ${countriesCount}件`);
  console.log(`  regions: ${regionsCount}件`);
  console.log(`  prefectures: ${prefecturesCount}件`);
}

main().catch(console.error);
