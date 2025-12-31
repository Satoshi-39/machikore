/**
 * 既存のadmin_boundariesシードファイルを新スキーマ形式に変換
 *
 * 使い方: npx tsx scripts/supabase/generate-admin-boundaries-sql.ts [--prefecture=jp_yamaguchi]
 *
 * 入力: scripts/data/admin_boundaries_old/0XX_seed_admin_boundaries_postgis_XX.sql
 * 出力: scripts/data/admin_boundaries/{prefecture_id}/
 */

import * as fs from 'fs';
import * as path from 'path';

// 市区町村コード → city_id マッピング
interface CityCodeMapping {
  code: string;
  city_id: string;
  name: string;
  prefecture_id: string;
}

// 都道府県コード → prefecture_id マッピング
const PREFECTURE_CODE_TO_ID: Record<string, string> = {
  '01': 'jp_hokkaido',
  '02': 'jp_aomori',
  '03': 'jp_iwate',
  '04': 'jp_miyagi',
  '05': 'jp_akita',
  '06': 'jp_yamagata',
  '07': 'jp_fukushima',
  '08': 'jp_ibaraki',
  '09': 'jp_tochigi',
  '10': 'jp_gunma',
  '11': 'jp_saitama',
  '12': 'jp_chiba',
  '13': 'jp_tokyo',
  '14': 'jp_kanagawa',
  '15': 'jp_niigata',
  '16': 'jp_toyama',
  '17': 'jp_ishikawa',
  '18': 'jp_fukui',
  '19': 'jp_yamanashi',
  '20': 'jp_nagano',
  '21': 'jp_gifu',
  '22': 'jp_shizuoka',
  '23': 'jp_aichi',
  '24': 'jp_mie',
  '25': 'jp_shiga',
  '26': 'jp_kyoto',
  '27': 'jp_osaka',
  '28': 'jp_hyogo',
  '29': 'jp_nara',
  '30': 'jp_wakayama',
  '31': 'jp_tottori',
  '32': 'jp_shimane',
  '33': 'jp_okayama',
  '34': 'jp_hiroshima',
  '35': 'jp_yamaguchi',
  '36': 'jp_tokushima',
  '37': 'jp_kagawa',
  '38': 'jp_ehime',
  '39': 'jp_kochi',
  '40': 'jp_fukuoka',
  '41': 'jp_saga',
  '42': 'jp_nagasaki',
  '43': 'jp_kumamoto',
  '44': 'jp_oita',
  '45': 'jp_miyazaki',
  '46': 'jp_kagoshima',
  '47': 'jp_okinawa',
};

interface ParsedBoundary {
  code: string;
  name: string;
  prefecture: string;
  prefCode: string;
  geomWkt: string;
}

/**
 * マッピングファイルを読み込み
 */
function loadCityCodeMapping(): Map<string, CityCodeMapping> {
  const mappingPath = path.join(__dirname, '../data/city-code-mapping.json');

  if (!fs.existsSync(mappingPath)) {
    console.error('マッピングファイルが見つかりません:', mappingPath);
    console.error('先に npx tsx scripts/supabase/generate-city-code-mapping.ts を実行してください');
    process.exit(1);
  }

  const mappings: CityCodeMapping[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  const map = new Map<string, CityCodeMapping>();

  for (const m of mappings) {
    map.set(m.code, m);
  }

  console.log(`マッピング: ${map.size}件読み込み`);
  return map;
}

/**
 * 既存シードファイルからデータを抽出
 */
function extractBoundariesFromSeedFiles(): ParsedBoundary[] {
  const boundaries: ParsedBoundary[] = [];
  const seedDir = path.join(__dirname, '../data/admin_boundaries_old');

  if (!fs.existsSync(seedDir)) {
    console.error('シードディレクトリが見つかりません:', seedDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.match(/^\d{3}_seed_admin_boundaries_postgis_\d+\.sql$/))
    .sort();

  console.log(`シードファイル: ${files.length}件`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(seedDir, file), 'utf-8');

    // INSERT文を "ON CONFLICT" で分割して1つずつ処理
    const insertStatements = content.split(/ON CONFLICT.*?;/s);

    for (const stmt of insertStatements) {
      // VALUES ('01101', '札幌市中央区', '北海道', '01', ST_GeomFromText('MULTIPOLYGON(...)', 4326))
      // メタデータ部分を抽出
      const metaMatch = stmt.match(/VALUES\s*\('(\d{5})',\s*'([^']+)',\s*'([^']+)',\s*'(\d{2})',/);
      if (!metaMatch) continue;

      // MULTIPOLYGON部分を抽出（ST_GeomFromText(' から ', 4326) まで）
      const geomStart = stmt.indexOf("ST_GeomFromText('MULTIPOLYGON");
      const geomEnd = stmt.lastIndexOf("', 4326)");
      if (geomStart === -1 || geomEnd === -1) continue;

      // "ST_GeomFromText('" の長さ = 17
      const geomWkt = stmt.substring(geomStart + 17, geomEnd);

      boundaries.push({
        code: metaMatch[1],
        name: metaMatch[2],
        prefecture: metaMatch[3],
        prefCode: metaMatch[4],
        geomWkt,
      });
    }
  }

  console.log(`境界データ: ${boundaries.length}件抽出`);
  return boundaries;
}

/**
 * 新スキーマ形式のSQLを生成
 */
function generateNewSchemaSql(
  boundaries: ParsedBoundary[],
  codeMapping: Map<string, CityCodeMapping>,
  targetPrefecture?: string
): void {
  // 都道府県ごとにグループ化
  const byPrefecture = new Map<string, ParsedBoundary[]>();

  for (const b of boundaries) {
    const prefectureId = PREFECTURE_CODE_TO_ID[b.prefCode];
    if (!prefectureId) continue;

    // 特定都道府県のみ処理
    if (targetPrefecture && prefectureId !== targetPrefecture) continue;

    if (!byPrefecture.has(prefectureId)) {
      byPrefecture.set(prefectureId, []);
    }
    byPrefecture.get(prefectureId)!.push(b);
  }

  const outputDir = path.join(__dirname, '../data/admin_boundaries');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalGenerated = 0;
  let totalUnmapped = 0;

  for (const [prefectureId, prefBoundaries] of byPrefecture) {
    const prefDir = path.join(outputDir, prefectureId);
    if (!fs.existsSync(prefDir)) {
      fs.mkdirSync(prefDir, { recursive: true });
    }

    const sqlLines: string[] = [];
    sqlLines.push(`-- ${prefectureId} 行政区域ポリゴンデータ (新スキーマ)`);
    sqlLines.push(`-- 生成日時: ${new Date().toISOString()}`);
    sqlLines.push('');

    const unmapped: string[] = [];

    for (const b of prefBoundaries) {
      const mapping = codeMapping.get(b.code);

      if (!mapping) {
        unmapped.push(`${b.code}: ${b.name}`);
        totalUnmapped++;
        continue;
      }

      // 新スキーマ形式のINSERT文（ST_Simplifyで座標点数を削減）
      // tolerance = 0.0001 ≒ 約10m精度（日本向けの高精度設定）
      sqlLines.push(`INSERT INTO admin_boundaries (geom, admin_level, country_id, prefecture_id, city_id)`);
      sqlLines.push(`VALUES (`);
      sqlLines.push(`  ST_Simplify(ST_GeomFromText('${b.geomWkt}', 4326), 0.0001),`);
      sqlLines.push(`  8,`);
      sqlLines.push(`  'jp',`);
      sqlLines.push(`  '${prefectureId}',`);
      sqlLines.push(`  '${mapping.city_id}'`);
      sqlLines.push(`)`);
      sqlLines.push(`ON CONFLICT (city_id) DO UPDATE SET`);
      sqlLines.push(`  geom = EXCLUDED.geom,`);
      sqlLines.push(`  admin_level = EXCLUDED.admin_level;`);
      sqlLines.push('');

      totalGenerated++;
    }

    // コメントで未マッピング一覧を追加
    if (unmapped.length > 0) {
      sqlLines.push('-- 未マッピング（citiesテーブルにデータがない）:');
      for (const u of unmapped) {
        sqlLines.push(`--   ${u}`);
      }
      sqlLines.push('');
    }

    const outputPath = path.join(prefDir, `${prefectureId}_admin_boundaries.sql`);
    fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8');
    console.log(`  ${prefectureId}: ${prefBoundaries.length - unmapped.length}件生成, ${unmapped.length}件未マッピング`);
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`合計: ${totalGenerated}件生成, ${totalUnmapped}件未マッピング`);
  console.log(`出力先: ${outputDir}`);
}

async function main() {
  const args = process.argv.slice(2);
  const prefArg = args.find((a) => a.startsWith('--prefecture='));
  const targetPrefecture = prefArg ? prefArg.replace('--prefecture=', '') : undefined;

  console.log('admin_boundaries SQL生成（新スキーマ形式）');
  console.log('='.repeat(50));

  if (targetPrefecture) {
    console.log(`対象: ${targetPrefecture}`);
  } else {
    console.log('対象: 全都道府県');
  }
  console.log('');

  // 1. マッピングを読み込み
  const codeMapping = loadCityCodeMapping();

  // 2. 既存シードファイルからデータを抽出
  const boundaries = extractBoundariesFromSeedFiles();

  // 3. 新スキーマ形式のSQLを生成
  generateNewSchemaSql(boundaries, codeMapping, targetPrefecture);
}

main().catch(console.error);
