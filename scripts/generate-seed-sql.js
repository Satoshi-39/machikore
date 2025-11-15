/**
 * マスターデータからSupabase用SQL INSERTを生成するスクリプト
 *
 * 実行方法:
 *   node scripts/generate-seed-sql.js
 */

const fs = require('fs');
const path = require('path');

// JSONファイルを読み込み
const regions = require('../src/shared/assets/data/regions.json');
const prefectures = require('../src/shared/assets/data/prefectures.json');
const cities = require('../src/shared/assets/data/cities.json');
const machi = require('../src/shared/assets/data/machi.json');

// SQLエスケープ関数
function escapeSql(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'number') {
    return value;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

// 現在のタイムスタンプ
const now = new Date().toISOString();

// SQL生成
let sql = `-- マイグレーション003: マスターデータ投入
-- 地方、都道府県、市区町村、街データを投入

-- ===============================
-- 1. 地方データ投入
-- ===============================

INSERT INTO regions (id, name, name_kana, name_translations, country_code, display_order, created_at, updated_at) VALUES
`;

const regionValues = regions.map(r =>
  `  (${escapeSql(r.id)}, ${escapeSql(r.name)}, ${escapeSql(r.name_kana)}, NULL, ${escapeSql(r.country_code)}, ${r.display_order}, ${escapeSql(now)}, ${escapeSql(now)})`
);
sql += regionValues.join(',\n');
sql += '\nON CONFLICT (id) DO NOTHING;\n\n';

// 都道府県データ
sql += `-- ===============================
-- 2. 都道府県データ投入
-- ===============================

INSERT INTO prefectures (id, name, name_kana, name_translations, region_id, country_code, created_at, updated_at) VALUES
`;

const prefectureValues = prefectures.map(p =>
  `  (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.name_kana)}, NULL, ${escapeSql(p.region_id)}, ${escapeSql(p.country_code)}, ${escapeSql(now)}, ${escapeSql(now)})`
);
sql += prefectureValues.join(',\n');
sql += '\nON CONFLICT (id) DO NOTHING;\n\n';

// 市区町村データ
sql += `-- ===============================
-- 3. 市区町村データ投入
-- ===============================

INSERT INTO cities (id, prefecture_id, name, name_kana, name_translations, type, country_code, created_at, updated_at) VALUES
`;

const cityValues = cities.map(c =>
  `  (${escapeSql(c.id)}, ${escapeSql(c.prefecture_id)}, ${escapeSql(c.name)}, ${escapeSql(c.name_kana)}, NULL, ${escapeSql(c.type)}, ${escapeSql(c.country_code)}, ${escapeSql(now)}, ${escapeSql(now)})`
);
sql += cityValues.join(',\n');
sql += '\nON CONFLICT (id) DO NOTHING;\n\n';

// 街データ
sql += `-- ===============================
-- 4. 街（駅）データ投入
-- ===============================

INSERT INTO machi (id, name, name_kana, name_translations, latitude, longitude, lines, prefecture_id, city_id, country_code, prefecture_name, prefecture_name_translations, city_name, city_name_translations, created_at, updated_at) VALUES
`;

const machiValues = machi.map(m => {
  // Convert lines array to JSONB string
  const linesJson = m.lines ? `'${JSON.stringify(m.lines).replace(/'/g, "''")}'` : 'NULL';

  return `  (${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.name_kana)}, NULL, ${m.latitude}, ${m.longitude}, ${linesJson}::jsonb, ${escapeSql(m.prefecture_id)}, ${escapeSql(m.city_id)}, ${escapeSql(m.country_code)}, ${escapeSql(m.prefecture_name)}, NULL, ${escapeSql(m.city_name)}, NULL, ${escapeSql(now)}, ${escapeSql(now)})`;
});
sql += machiValues.join(',\n');
sql += '\nON CONFLICT (id) DO NOTHING;\n';

// ファイルに書き込み
const outputPath = path.join(__dirname, '../src/shared/api/supabase/migrations/003_seed_master_data.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

console.log('✅ Supabase migration file generated:');
console.log(`   ${outputPath}`);
console.log(`   - Regions: ${regions.length} records`);
console.log(`   - Prefectures: ${prefectures.length} records`);
console.log(`   - Cities: ${cities.length} records`);
console.log(`   - Machi: ${machi.length} records`);
