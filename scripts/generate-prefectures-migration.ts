/**
 * JSONデータからSupabase用の都道府県SQLマイグレーションを生成するスクリプト
 *
 * 使い方: npx ts-node scripts/generate-prefectures-migration.ts
 */

const fs = require('fs');
const path = require('path');

interface PrefectureData {
  id: string;
  osmId: number;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  regionId: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface InputData {
  fetchedAt: string;
  prefectures: PrefectureData[];
}

// 一部の都道府県は境界が広いため、県庁所在地の座標を使用
// OSMのcenterは地理的な中心のため、離島を含む県では不適切な場合がある
const COORDINATE_OVERRIDES: Record<string, { latitude: number; longitude: number }> = {
  // 東京都: 小笠原諸島を含むため中心が太平洋上になる → 都庁の座標を使用
  tokyo: { latitude: 35.6895, longitude: 139.6917 },
  // 沖縄県: 広い海域を含むため → 那覇市の座標を使用
  okinawa: { latitude: 26.2124, longitude: 127.6809 },
  // 鹿児島県: 奄美諸島を含むため → 鹿児島市の座標を使用
  kagoshima: { latitude: 31.5602, longitude: 130.5581 },
  // 長崎県: 離島を含むため → 長崎市の座標を使用
  nagasaki: { latitude: 32.7448, longitude: 129.8737 },
};

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
  const inputPath = path.join(__dirname, 'data', 'prefectures_data.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`ファイルが見つかりません: ${inputPath}`);
    console.error('先に npx ts-node scripts/fetch-osm-prefectures.ts を実行してください');
    process.exit(1);
  }

  const data: InputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  console.log(`データ読み込み完了: ${data.prefectures.length}件の都道府県`);

  // SQL生成
  const lines: string[] = [];

  lines.push('-- =============================================');
  lines.push('-- 都道府県データの更新（OSMから取得）');
  lines.push(`-- 生成日時: ${new Date().toISOString()}`);
  lines.push(`-- データ取得日時: ${data.fetchedAt}`);
  lines.push('-- =============================================');
  lines.push('');
  lines.push('-- トランザクション開始');
  lines.push('BEGIN;');
  lines.push('');

  // 都道府県データの更新（UPSERT）
  lines.push('-- =============================================');
  lines.push('-- 都道府県データの更新');
  lines.push('-- =============================================');
  lines.push('');

  for (const pref of data.prefectures) {
    // 座標のオーバーライドを適用
    const coords = COORDINATE_OVERRIDES[pref.id] || {
      latitude: pref.latitude,
      longitude: pref.longitude,
    };

    const isOverridden = COORDINATE_OVERRIDES[pref.id] !== undefined;
    if (isOverridden) {
      lines.push(`-- ${pref.name}: 県庁所在地の座標を使用（離島を含むため）`);
    }

    lines.push(`UPDATE prefectures SET`);
    lines.push(`  name = ${escapeSQL(pref.name)},`);
    lines.push(`  name_kana = COALESCE(${escapeSQL(pref.nameKana)}, name_kana),`);
    lines.push(`  latitude = ${coords.latitude},`);
    lines.push(`  longitude = ${coords.longitude},`);
    lines.push(`  updated_at = NOW()`);
    lines.push(`WHERE id = ${escapeSQL(pref.id)};`);
    lines.push('');
  }

  lines.push('-- トランザクションコミット');
  lines.push('COMMIT;');
  lines.push('');
  lines.push(`-- 完了: ${data.prefectures.length}件の都道府県データを更新`);

  // SQLファイルに保存
  const outputPath = path.join(__dirname, '..', 'supabase', 'migrations', '040_update_prefectures_from_osm.sql');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

  console.log(`\nSQLマイグレーションを生成しました: ${outputPath}`);
  console.log(`  - 都道府県: ${data.prefectures.length}件`);
  console.log(`  - 座標オーバーライド: ${Object.keys(COORDINATE_OVERRIDES).length}件`);
  console.log(`    (${Object.keys(COORDINATE_OVERRIDES).join(', ')})`);
}

main();
