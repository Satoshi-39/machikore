/**
 * 全国47都道府県のOSMデータを一括取得するスクリプト
 *
 * 使い方: npx tsx scripts/osm/fetch-all-prefectures.ts
 */

import { execSync } from 'child_process';

const PREFECTURES = [
  'jp_hokkaido',
  'jp_aomori',
  'jp_iwate',
  'jp_miyagi',
  'jp_akita',
  'jp_yamagata',
  'jp_fukushima',
  'jp_ibaraki',
  'jp_tochigi',
  'jp_gunma',
  'jp_saitama',
  'jp_chiba',
  'jp_tokyo',
  'jp_kanagawa',
  'jp_niigata',
  'jp_toyama',
  'jp_ishikawa',
  'jp_fukui',
  'jp_yamanashi',
  'jp_nagano',
  'jp_gifu',
  'jp_shizuoka',
  'jp_aichi',
  'jp_mie',
  'jp_shiga',
  'jp_kyoto',
  'jp_osaka',
  'jp_hyogo',
  'jp_nara',
  'jp_wakayama',
  'jp_tottori',
  'jp_shimane',
  'jp_okayama',
  'jp_hiroshima',
  'jp_yamaguchi',
  'jp_tokushima',
  'jp_kagawa',
  'jp_ehime',
  'jp_kochi',
  'jp_fukuoka',
  'jp_saga',
  'jp_nagasaki',
  'jp_kumamoto',
  'jp_oita',
  'jp_miyazaki',
  'jp_kagoshima',
  'jp_okinawa',
];

async function main() {
  console.log('='.repeat(60));
  console.log('全国47都道府県 OSMデータ一括取得');
  console.log('='.repeat(60));
  console.log('');

  const startTime = Date.now();
  const results: { prefecture: string; success: boolean; error?: string }[] = [];

  for (let i = 0; i < PREFECTURES.length; i++) {
    const prefectureId = PREFECTURES[i];
    console.log(`\n[${ i + 1}/${PREFECTURES.length}] ${prefectureId}`);
    console.log('-'.repeat(40));

    try {
      execSync(`npx tsx scripts/osm/fetch-machi-data.ts ${prefectureId}`, {
        stdio: 'inherit',
        timeout: 600000, // 10分タイムアウト
      });
      results.push({ prefecture: prefectureId, success: true });

      // API制限対策で少し待機（各都道府県間）
      if (i < PREFECTURES.length - 1) {
        console.log('\n次の都道府県まで5秒待機...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`❌ ${prefectureId} の取得に失敗しました:`, error);
      results.push({
        prefecture: prefectureId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);

  console.log('\n');
  console.log('='.repeat(60));
  console.log('完了サマリー');
  console.log('='.repeat(60));
  console.log(`処理時間: ${Math.floor(duration / 60)}分${duration % 60}秒`);
  console.log(`成功: ${results.filter(r => r.success).length}件`);
  console.log(`失敗: ${results.filter(r => !r.success).length}件`);

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n失敗した都道府県:');
    failed.forEach(f => console.log(`  - ${f.prefecture}: ${f.error}`));
  }
}

main().catch(console.error);
