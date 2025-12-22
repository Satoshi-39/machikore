/**
 * transport_hubsテーブルへのデータ投入用SQLを生成
 *
 * 使い方: npx tsx scripts/generate-transport-migration.ts [prefecture_id]
 * 例: npx tsx scripts/generate-transport-migration.ts tokyo
 */

const fs = require('fs');
const path = require('path');

interface TransportHubData {
  id: string;
  osmId: number;
  osmType: string;
  prefectureId: string;
  type: 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';
  subtype: string | null;
  name: string;
  nameKana: string | null;
  nameEn: string | null;
  operator: string | null;
  network: string | null;
  ref: string | null;
  latitude: number;
  longitude: number;
  countryCode: string;
}

interface TransportDataFile {
  fetchedAt: string;
  prefectureId: string;
  prefectureName: string;
  stats: {
    station: number;
    airport: number;
    ferry_terminal: number;
    bus_terminal: number;
    total: number;
  };
  data: TransportHubData[];
}

/**
 * SQLエスケープ
 */
function escapeSql(value: string | null): string {
  if (value === null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * メイン処理
 */
async function main() {
  const prefectureId = process.argv[2] || 'tokyo';
  const inputPath = path.join(__dirname, 'data', `${prefectureId}_transport_data.json`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ ファイルが見つかりません: ${inputPath}`);
    console.error(`先に npx tsx scripts/fetch-osm-transport-data.ts ${prefectureId} を実行してください`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(inputPath, 'utf-8');
  const transportData: TransportDataFile = JSON.parse(fileContent);

  console.log(`📊 ${transportData.prefectureName}の交通機関データ:`);
  console.log(`  駅: ${transportData.stats.station}件`);
  console.log(`  空港: ${transportData.stats.airport}件`);
  console.log(`  フェリーターミナル: ${transportData.stats.ferry_terminal}件`);
  console.log(`  バスターミナル: ${transportData.stats.bus_terminal}件`);
  console.log(`  合計: ${transportData.stats.total}件\n`);

  // SQLファイルを生成
  const migrationNumber = '042';
  const outputPath = path.join(
    __dirname,
    '..',
    'supabase',
    'migrations',
    `${migrationNumber}_seed_${prefectureId}_transport_data.sql`
  );

  let sql = `-- =============================================
-- ${transportData.prefectureName}の交通機関データ投入
-- 生成日時: ${new Date().toISOString()}
-- 元データ取得日時: ${transportData.fetchedAt}
-- =============================================

-- トランザクション開始
BEGIN;

-- 既存データを削除（同じ都道府県のデータを再投入する場合）
DELETE FROM transport_hubs WHERE prefecture_id = '${prefectureId}';

-- データ投入
INSERT INTO transport_hubs (
  id,
  osm_id,
  osm_type,
  prefecture_id,
  type,
  subtype,
  name,
  name_kana,
  name_en,
  operator,
  network,
  ref,
  latitude,
  longitude,
  country_code
) VALUES
`;

  const values: string[] = [];

  for (const hub of transportData.data) {
    const value = `(
  ${escapeSql(hub.id)},
  ${hub.osmId},
  ${escapeSql(hub.osmType)},
  ${escapeSql(hub.prefectureId)},
  ${escapeSql(hub.type)},
  ${escapeSql(hub.subtype)},
  ${escapeSql(hub.name)},
  ${escapeSql(hub.nameKana)},
  ${escapeSql(hub.nameEn)},
  ${escapeSql(hub.operator)},
  ${escapeSql(hub.network)},
  ${escapeSql(hub.ref)},
  ${hub.latitude},
  ${hub.longitude},
  ${escapeSql(hub.countryCode)}
)`;
    values.push(value);
  }

  sql += values.join(',\n');
  sql += `;\n
-- 投入件数を確認
DO $$
DECLARE
  cnt INTEGER;
BEGIN
  SELECT COUNT(*) INTO cnt FROM transport_hubs WHERE prefecture_id = '${prefectureId}';
  RAISE NOTICE '${transportData.prefectureName}の交通機関データ投入完了: % 件', cnt;
END $$;

-- トランザクションコミット
COMMIT;
`;

  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log(`✅ マイグレーションファイルを生成しました: ${outputPath}`);
}

main();
