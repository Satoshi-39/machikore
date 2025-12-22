/**
 * 全都道府県のOSMデータを取得するバッチスクリプト
 *
 * 使い方: npx tsx scripts/fetch-all-osm-data.ts [--machi] [--transport] [--skip-existing]
 *
 * オプション:
 *   --machi: 街データのみ取得
 *   --transport: 交通データのみ取得
 *   --skip-existing: 既存ファイルをスキップ
 *
 * 例:
 *   npx tsx scripts/fetch-all-osm-data.ts                    # 全データ取得
 *   npx tsx scripts/fetch-all-osm-data.ts --machi            # 街データのみ
 *   npx tsx scripts/fetch-all-osm-data.ts --transport        # 交通データのみ
 *   npx tsx scripts/fetch-all-osm-data.ts --skip-existing    # 既存ファイルをスキップ
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 全47都道府県のID
const ALL_PREFECTURES = [
  'hokkaido',
  'aomori',
  'iwate',
  'miyagi',
  'akita',
  'yamagata',
  'fukushima',
  'ibaraki',
  'tochigi',
  'gunma',
  'saitama',
  'chiba',
  'tokyo',
  'kanagawa',
  'niigata',
  'toyama',
  'ishikawa',
  'fukui',
  'yamanashi',
  'nagano',
  'gifu',
  'shizuoka',
  'aichi',
  'mie',
  'shiga',
  'kyoto',
  'osaka',
  'hyogo',
  'nara',
  'wakayama',
  'tottori',
  'shimane',
  'okayama',
  'hiroshima',
  'yamaguchi',
  'tokushima',
  'kagawa',
  'ehime',
  'kochi',
  'fukuoka',
  'saga',
  'nagasaki',
  'kumamoto',
  'oita',
  'miyazaki',
  'kagoshima',
  'okinawa',
];

// コマンドライン引数を解析
const args = process.argv.slice(2);
const skipExisting = args.includes('--skip-existing');
const hasMachiFlag = args.includes('--machi');
const hasTransportFlag = args.includes('--transport');
// --machi または --transport が指定されていない場合は両方取得
const fetchMachi = !hasMachiFlag && !hasTransportFlag ? true : hasMachiFlag;
const fetchTransport = !hasMachiFlag && !hasTransportFlag ? true : hasTransportFlag;

// データディレクトリ
const DATA_DIR = path.join(__dirname, 'data');
const MACHI_DIR = path.join(DATA_DIR, 'machi');
const TRANSPORT_DIR = path.join(DATA_DIR, 'transport');

// API制限対策の待機時間（ミリ秒）
// Overpass APIの推奨: 10秒以上の間隔
const DELAY_BETWEEN_REQUESTS = 10000;

/**
 * ファイルが存在するかチェック
 */
function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * 遅延を入れる
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * コマンドを実行
 */
function runCommand(command: string): boolean {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ コマンド実行エラー: ${command}`);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('='.repeat(60));
  console.log('全都道府県OSMデータ取得バッチ');
  console.log('='.repeat(60));
  console.log(`\n設定:`);
  console.log(`  - 街データ: ${fetchMachi ? '取得する' : 'スキップ'}`);
  console.log(`  - 交通データ: ${fetchTransport ? '取得する' : 'スキップ'}`);
  console.log(`  - 既存ファイル: ${skipExisting ? 'スキップ' : '上書き'}`);
  console.log(`\n対象: ${ALL_PREFECTURES.length}都道府県\n`);

  const results = {
    machi: { success: 0, skipped: 0, failed: 0 },
    transport: { success: 0, skipped: 0, failed: 0 },
  };

  for (let i = 0; i < ALL_PREFECTURES.length; i++) {
    const prefectureId = ALL_PREFECTURES[i];
    console.log(`\n[${ i + 1}/${ALL_PREFECTURES.length}] ${prefectureId}`);
    console.log('-'.repeat(40));

    // 街データの取得
    if (fetchMachi) {
      const machiFile = path.join(MACHI_DIR, `${prefectureId}_machi_data.json`);

      if (skipExisting && fileExists(machiFile)) {
        console.log(`  📁 街データ: スキップ（既存ファイルあり）`);
        results.machi.skipped++;
      } else {
        console.log(`  🏘️ 街データを取得中...`);
        const success = runCommand(
          `npx tsx scripts/fetch-osm-machi-data.ts ${prefectureId}`
        );
        if (success) {
          results.machi.success++;
        } else {
          results.machi.failed++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }

    // 交通データの取得
    if (fetchTransport) {
      const transportFile = path.join(
        TRANSPORT_DIR,
        `${prefectureId}_transport_data.json`
      );

      if (skipExisting && fileExists(transportFile)) {
        console.log(`  📁 交通データ: スキップ（既存ファイルあり）`);
        results.transport.skipped++;
      } else {
        console.log(`  🚃 交通データを取得中...`);
        const success = runCommand(
          `npx tsx scripts/fetch-osm-transport-data.ts ${prefectureId}`
        );
        if (success) {
          results.transport.success++;
        } else {
          results.transport.failed++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(60));
  console.log('完了サマリー');
  console.log('='.repeat(60));

  if (fetchMachi) {
    console.log(`\n街データ:`);
    console.log(`  ✅ 成功: ${results.machi.success}`);
    console.log(`  ⏭️ スキップ: ${results.machi.skipped}`);
    console.log(`  ❌ 失敗: ${results.machi.failed}`);
  }

  if (fetchTransport) {
    console.log(`\n交通データ:`);
    console.log(`  ✅ 成功: ${results.transport.success}`);
    console.log(`  ⏭️ スキップ: ${results.transport.skipped}`);
    console.log(`  ❌ 失敗: ${results.transport.failed}`);
  }

  // 現在のファイル数を確認
  console.log('\n' + '-'.repeat(40));
  console.log('現在のデータファイル数:');

  if (fs.existsSync(MACHI_DIR)) {
    const machiFiles = fs.readdirSync(MACHI_DIR).filter((f: string) => f.endsWith('.json'));
    console.log(`  街データ: ${machiFiles.length}/47`);
  }

  if (fs.existsSync(TRANSPORT_DIR)) {
    const transportFiles = fs.readdirSync(TRANSPORT_DIR).filter((f: string) => f.endsWith('.json'));
    console.log(`  交通データ: ${transportFiles.length}/47`);
  }
}

main().catch(console.error);
