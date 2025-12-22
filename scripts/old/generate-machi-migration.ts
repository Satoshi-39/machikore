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
  type: string | null;
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
  // 引数から都道府県IDを取得（デフォルトは tokyo）
  const prefectureId = process.argv[2] || 'tokyo';

  // JSONファイルを読み込む
  const inputPath = path.join(__dirname, 'data', `${prefectureId}_machi_data.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(`ファイルが見つかりません: ${inputPath}`);
    process.exit(1);
  }

  const data: InputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  console.log(`データ読み込み完了: cities ${data.cities.length}件, machi ${data.machi.length}件`);

  // SQL生成
  const lines: string[] = [];

  lines.push('-- =============================================');
  lines.push(`-- ${data.prefecture.name}の街データ（OSMから取得）`);
  lines.push(`-- 生成日時: ${new Date().toISOString()}`);
  lines.push(`-- データ取得日時: ${data.fetchedAt}`);
  lines.push('-- =============================================');
  lines.push('');
  lines.push('-- トランザクション開始');
  lines.push('BEGIN;');
  lines.push('');

  // 既存データの削除
  lines.push('-- =============================================');
  lines.push(`-- 1. 既存データの削除（${data.prefecture.name}のみ）`);
  lines.push('-- =============================================');
  lines.push('');
  lines.push(`-- machiテーブルから${data.prefecture.name}のデータを削除`);
  lines.push(`DELETE FROM machi WHERE prefecture_id = '${prefectureId}';`);
  lines.push('');
  lines.push(`-- citiesテーブルから${data.prefecture.name}のデータを削除`);
  lines.push(`DELETE FROM cities WHERE prefecture_id = '${prefectureId}';`);
  lines.push('');

  // citiesデータの挿入
  lines.push('-- =============================================');
  lines.push('-- 2. citiesデータの挿入');
  lines.push('-- =============================================');
  lines.push('');

  // typeがnullのデータは正式な市区町村でないため除外
  const validCities = data.cities.filter(city => city.type !== null);
  const skippedCities = data.cities.filter(city => city.type === null);

  if (skippedCities.length > 0) {
    lines.push(`-- ⚠️ 以下の${skippedCities.length}件は正式な市区町村でないため除外:`);
    for (const city of skippedCities) {
      lines.push(`--   - ${city.name} (type: null)`);
    }
    lines.push('');
  }

  for (const city of validCities) {
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

  // 重複IDを検出し、osmIdを付与してユニークにする
  const seenIds = new Set<string>();
  const processedMachi: Array<MachiData & { uniqueId: string }> = [];

  for (const machi of data.machi) {
    let uniqueId = machi.id;
    if (seenIds.has(uniqueId)) {
      uniqueId = `${machi.id}_${machi.osmId}`;
    }
    seenIds.add(uniqueId);
    processedMachi.push({ ...machi, uniqueId });
  }

  for (const machi of processedMachi) {
    lines.push(`INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, osm_id, place_type)`);
    lines.push(`VALUES (`);
    lines.push(`  ${escapeSQL(machi.uniqueId)},`);
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
    lines.push(`  NULL,`); // city_name_translations
    lines.push(`  ${machi.osmId},`);
    lines.push(`  ${escapeSQL(machi.placeType)}`);
    lines.push(`);`);
    lines.push('');
  }

  lines.push('-- トランザクションコミット');
  lines.push('COMMIT;');
  lines.push('');
  lines.push(`-- 完了: cities ${validCities.length}件, machi ${data.machi.length}件を挿入`);
  if (skippedCities.length > 0) {
    lines.push(`-- (cities ${skippedCities.length}件は正式な市区町村でないため除外)`);
  }

  // SQLファイルに保存
  // マイグレーション番号はprefectureIdに応じて変更
  const migrationNumbers: Record<string, string> = {
    tokyo: '037',
    yamaguchi: '039',
  };
  const migrationNumber = migrationNumbers[prefectureId] || '040';
  const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', `${migrationNumber}_seed_${prefectureId}_machi_data.sql`);
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

  console.log(`\nSQLマイグレーションを生成しました: ${outputPath}`);
  console.log(`  - cities: ${validCities.length}件`);
  if (skippedCities.length > 0) {
    console.log(`  - cities除外: ${skippedCities.length}件 (${skippedCities.map(c => c.name).join(', ')})`);
  }
  console.log(`  - machi: ${data.machi.length}件`);
}

main();
