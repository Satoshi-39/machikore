/**
 * JSONデータからSupabase用SQLマイグレーションを生成するスクリプト
 *
 * 使い方: npx ts-node scripts/generate-machi-migration.ts
 */

const fs = require('fs');
const path = require('path');

interface CityData {
  id: string;
  osmId: number;
  prefectureId: string;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  type: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface MachiData {
  id: string;
  osmId: number;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  latitude: number;
  longitude: number;
  lines: null;
  prefectureId: string;
  cityId: string | null;
  countryCode: string;
  prefectureName: string;
  prefectureNameTranslations: null;
  cityName: string | null;
  cityNameTranslations: null;
  placeType: string;
}

interface InputData {
  fetchedAt: string;
  prefecture: {
    id: string;
    name: string;
  };
  cities: CityData[];
  machi: MachiData[];
}

/**
 * SQLエスケープ
 */
function escapeSQL(value: string | null): string {
  if (value === null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * JSONBエスケープ
 */
function escapeJSONB(value: object | null): string {
  if (value === null) return 'NULL';
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

/**
 * メイン処理
 */
function main() {
  // JSONファイルを読み込む
  const inputPath = path.join(__dirname, 'data', 'tokyo_machi_data.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`ファイルが見つかりません: ${inputPath}`);
    process.exit(1);
  }

  const data: InputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  console.log(`データ読み込み完了: cities ${data.cities.length}件, machi ${data.machi.length}件`);

  // SQL生成
  const lines: string[] = [];

  lines.push('-- =============================================');
  lines.push('-- 東京都の街データ（OSMから取得）');
  lines.push(`-- 生成日時: ${new Date().toISOString()}`);
  lines.push(`-- データ取得日時: ${data.fetchedAt}`);
  lines.push('-- =============================================');
  lines.push('');
  lines.push('-- トランザクション開始');
  lines.push('BEGIN;');
  lines.push('');

  // 既存データの削除（東京都のみ）
  lines.push('-- =============================================');
  lines.push('-- 1. 既存データの削除（東京都のみ）');
  lines.push('-- =============================================');
  lines.push('');
  lines.push("-- machiテーブルから東京都のデータを削除");
  lines.push("DELETE FROM machi WHERE prefecture_id = 'tokyo';");
  lines.push('');
  lines.push("-- citiesテーブルから東京都のデータを削除");
  lines.push("DELETE FROM cities WHERE prefecture_id = 'tokyo';");
  lines.push('');

  // citiesデータの挿入
  lines.push('-- =============================================');
  lines.push('-- 2. citiesデータの挿入');
  lines.push('-- =============================================');
  lines.push('');

  for (const city of data.cities) {
    lines.push(`INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, latitude, longitude)`);
    lines.push(`VALUES (`);
    lines.push(`  ${escapeSQL(city.id)},`);
    lines.push(`  ${escapeSQL(city.prefectureId)},`);
    lines.push(`  ${escapeSQL(city.name)},`);
    lines.push(`  ${escapeSQL(city.nameKana || city.name)},`);
    lines.push(`  ${escapeJSONB(city.nameTranslations)},`);
    lines.push(`  ${escapeSQL(city.type)},`);
    lines.push(`  ${escapeSQL(city.countryCode)},`);
    lines.push(`  ${city.latitude},`);
    lines.push(`  ${city.longitude}`);
    lines.push(`);`);
    lines.push('');
  }

  // machiデータの挿入
  lines.push('-- =============================================');
  lines.push('-- 3. machiデータの挿入');
  lines.push('-- =============================================');
  lines.push('');

  for (const machi of data.machi) {
    lines.push(`INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations)`);
    lines.push(`VALUES (`);
    lines.push(`  ${escapeSQL(machi.id)},`);
    lines.push(`  ${escapeSQL(machi.name)},`);
    lines.push(`  ${escapeSQL(machi.nameKana || machi.name)},`);
    lines.push(`  ${escapeJSONB(machi.nameTranslations)},`);
    lines.push(`  ${machi.latitude},`);
    lines.push(`  ${machi.longitude},`);
    lines.push(`  NULL,`); // lines
    lines.push(`  ${escapeSQL(machi.prefectureId)},`);
    lines.push(`  ${escapeSQL(machi.cityId)},`);
    lines.push(`  ${escapeSQL(machi.countryCode)},`);
    lines.push(`  ${escapeSQL(machi.prefectureName)},`);
    lines.push(`  NULL,`); // prefecture_name_translations
    lines.push(`  ${escapeSQL(machi.cityName)},`);
    lines.push(`  NULL`); // city_name_translations
    lines.push(`);`);
    lines.push('');
  }

  lines.push('-- トランザクションコミット');
  lines.push('COMMIT;');
  lines.push('');
  lines.push(`-- 完了: cities ${data.cities.length}件, machi ${data.machi.length}件を挿入`);

  // SQLファイルに保存
  const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '037_seed_tokyo_machi_data.sql');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

  console.log(`\nSQLマイグレーションを生成しました: ${outputPath}`);
  console.log(`  - cities: ${data.cities.length}件`);
  console.log(`  - machi: ${data.machi.length}件`);
}

main();
