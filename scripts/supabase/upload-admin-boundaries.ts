/**
 * admin_boundariesテーブルにポリゴンデータをアップロードするスクリプト
 *
 * 使い方:
 *   npx tsx scripts/supabase/upload-admin-boundaries.ts [--prefecture=yamaguchi] [--dry-run]
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

interface AdminBoundaryData {
  code: string;
  name: string;
  city_id: string;
  geom_wkt: string; // MULTIPOLYGON(...) 形式のWKT
}

// 山口県の市町村コードとcity_idのマッピング
const YAMAGUCHI_CITY_MAPPING: Record<string, string> = {
  '35201': 'jp_yamaguchi_shimonoseki',
  '35202': 'jp_yamaguchi_ube',
  '35203': 'jp_yamaguchi_yamaguchi',
  '35204': 'jp_yamaguchi_hagi',
  '35206': 'jp_yamaguchi_hofu',
  '35207': 'jp_yamaguchi_kudamatsu',
  '35208': 'jp_yamaguchi_iwakuni',
  '35210': 'jp_yamaguchi_hikari',
  '35211': 'jp_yamaguchi_nagato',
  '35212': 'jp_yamaguchi_yanai',
  '35213': 'jp_yamaguchi_mine',
  '35215': 'jp_yamaguchi_shunan',
  '35216': 'jp_yamaguchi_sanyo_onoda',
  '35305': 'jp_yamaguchi_suo_oshima',
  '35321': 'jp_yamaguchi_waki',
  '35341': 'jp_yamaguchi_kaminoseki',
  '35343': 'jp_yamaguchi_tabuse',
  '35344': 'jp_yamaguchi_hirao',
  '35502': 'jp_yamaguchi_abu',
};

/**
 * 元のシードファイルから山口県のデータを抽出
 */
function extractYamaguchiData(): AdminBoundaryData[] {
  const baseDir = path.join(__dirname, '../data/admin_boundaries_old');
  const results: AdminBoundaryData[] = [];

  // バッチファイルを探索
  const files = fs.readdirSync(baseDir).filter(f =>
    f.endsWith('.sql') &&
    f.includes('seed_admin_boundaries_postgis') &&
    !f.includes('yamaguchi')
  );

  for (const filename of files) {
    const filepath = path.join(baseDir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');

    if (!content.includes("'山口県'")) continue;

    // 各行を処理
    for (const line of content.split('\n')) {
      if (!line.includes("VALUES ('35") || !line.includes("'山口県'")) continue;

      // コードを抽出
      const codeMatch = line.match(/VALUES \('(35\d{3})'/);
      if (!codeMatch) continue;
      const code = codeMatch[1];

      // 名前を抽出
      const nameMatch = line.match(/VALUES \('35\d{3}', '([^']+)', '山口県'/);
      if (!nameMatch) continue;
      const name = nameMatch[1];

      // WKTを抽出 (MULTIPOLYGON(...) 部分のみ)
      const wktMatch = line.match(/ST_GeomFromText\('(MULTIPOLYGON\([^']+)'/);
      if (!wktMatch) continue;
      const geom_wkt = wktMatch[1];

      const city_id = YAMAGUCHI_CITY_MAPPING[code];
      if (!city_id) {
        console.warn(`⚠️ Unknown code: ${code} (${name})`);
        continue;
      }

      results.push({ code, name, city_id, geom_wkt });
    }
  }

  return results;
}

/**
 * データをアップロード
 */
async function uploadData(data: AdminBoundaryData[], dryRun: boolean): Promise<void> {
  console.log(`\n📦 ${data.length}件のデータをアップロード中...`);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    console.log(`[${i + 1}/${data.length}] ${item.name} (${item.city_id})`);

    if (dryRun) {
      console.log(`  ✓ ドライラン - スキップ`);
      continue;
    }

    // PostGISのST_GeomFromText関数を使うRPC呼び出し
    // もしくは直接SQLを実行
    const { error } = await supabase.rpc('insert_admin_boundary', {
      p_geom_wkt: item.geom_wkt,
      p_admin_level: 8,
      p_country_id: 'jp',
      p_prefecture_id: 'jp_yamaguchi',
      p_city_id: item.city_id,
    });

    if (error) {
      console.error(`  ❌ エラー: ${error.message}`);

      // RPC関数がない場合は別の方法を試す
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        console.log('  → RPC関数が存在しません。直接INSERTを試みます...');

        // 直接SQLを実行（PostgREST経由ではgeomは直接挿入できないので別の方法が必要）
        const { error: insertError } = await supabase
          .from('admin_boundaries')
          .upsert({
            city_id: item.city_id,
            admin_level: 8,
            country_id: 'jp',
            prefecture_id: 'jp_yamaguchi',
            // geomは後でSQLで更新する必要がある
          }, { onConflict: 'city_id' });

        if (insertError) {
          console.error(`  ❌ INSERT エラー: ${insertError.message}`);
        } else {
          console.log(`  ⚠️ メタデータのみ挿入（geomは別途SQLで更新必要）`);
        }
      }
    } else {
      console.log(`  ✓ 成功`);
    }
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('============================================================');
  console.log('admin_boundaries アップロードスクリプト');
  console.log('============================================================');
  console.log(`  モード: ${dryRun ? 'ドライラン' : '本番'}`);
  console.log('');

  // データを抽出
  console.log('📂 シードファイルからデータを抽出中...');
  const data = extractYamaguchiData();
  console.log(`  ${data.length}件の市区町村データを発見`);

  for (const item of data) {
    console.log(`  - ${item.code}: ${item.name} → ${item.city_id}`);
  }

  // アップロード
  await uploadData(data, dryRun);

  console.log('\n============================================================');
  console.log('完了');
  console.log('============================================================');
  console.log('');
  console.log('⚠️ 注意: PostgREST経由ではgeometry型の直接挿入ができないため、');
  console.log('   geomカラムはSQLで別途更新する必要があります。');
  console.log('');
  console.log('   以下のSQLを使用してください:');
  console.log('   UPDATE admin_boundaries SET geom = ST_GeomFromText(\'...\', 4326) WHERE city_id = \'...\';');
}

main().catch(console.error);
