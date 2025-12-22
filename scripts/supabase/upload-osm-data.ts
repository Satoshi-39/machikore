/**
 * OSMデータをSupabaseに直接アップロードするスクリプト
 *
 * 使い方:
 *   npx tsx scripts/supabase/upload-osm-data.ts [--machi] [--transport] [--prefecture=tokyo]
 *
 * オプション:
 *   --machi       街データのみアップロード
 *   --transport   交通データのみアップロード
 *   --prefecture=ID  特定の都道府県のみ（省略時は全都道府県）
 *   --dry-run     実際にはアップロードせず、件数のみ表示
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// タイルサイズ（shared/config/constants.tsと同じ値）
const TILE_SIZE = 0.25;

/**
 * 座標からタイルIDを計算
 */
function getTileId(latitude: number, longitude: number): string {
  const tileX = Math.floor(longitude / TILE_SIZE);
  const tileY = Math.floor(latitude / TILE_SIZE);
  return `${tileX}_${tileY}`;
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません:');
  console.error('  EXPO_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// サービスロールキーでSupabaseクライアントを作成（RLSバイパス）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 都道府県リスト - ID形式は jp_{prefecture}
const PREFECTURES = [
  'jp_hokkaido', 'jp_aomori', 'jp_iwate', 'jp_miyagi', 'jp_akita', 'jp_yamagata', 'jp_fukushima',
  'jp_ibaraki', 'jp_tochigi', 'jp_gunma', 'jp_saitama', 'jp_chiba', 'jp_tokyo', 'jp_kanagawa',
  'jp_niigata', 'jp_toyama', 'jp_ishikawa', 'jp_fukui', 'jp_yamanashi', 'jp_nagano',
  'jp_gifu', 'jp_shizuoka', 'jp_aichi', 'jp_mie',
  'jp_shiga', 'jp_kyoto', 'jp_osaka', 'jp_hyogo', 'jp_nara', 'jp_wakayama',
  'jp_tottori', 'jp_shimane', 'jp_okayama', 'jp_hiroshima', 'jp_yamaguchi',
  'jp_tokushima', 'jp_kagawa', 'jp_ehime', 'jp_kochi',
  'jp_fukuoka', 'jp_saga', 'jp_nagasaki', 'jp_kumamoto', 'jp_oita', 'jp_miyazaki', 'jp_kagoshima', 'jp_okinawa',
];

interface MachiDataFile {
  fetchedAt: string;
  prefecture: { id: string; name: string };
  cities: Array<{
    id: string;
    prefecture_id: string;
    name: string;
    name_kana: string;
    name_translations: { en: string } | null;
    type: string | null;
    latitude: number;
    longitude: number;
  }>;
  machi: Array<{
    id: string;
    name: string;
    name_kana: string;
    name_translations: { en: string } | null;
    latitude: number;
    longitude: number;
    prefecture_id: string;
    city_id: string | null;
    place_type: string;
  }>;
}

interface TransportDataFile {
  fetchedAt: string;
  prefecture_id: string;
  prefecture_name: string;
  stats: {
    station: number;
    airport: number;
    ferry_terminal: number;
    bus_terminal: number;
    total: number;
  };
  data: Array<{
    id: string;
    osm_id: number;
    osm_type: string;
    prefecture_id: string;
    type: 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';
    subtype: string | null;
    name: string;
    name_kana: string | null;
    name_translations: { en: string } | null;
    operator: string | null;
    network: string | null;
    ref: string | null;
    latitude: number;
    longitude: number;
  }>;
}

/**
 * 街データをアップロード
 */
async function uploadMachiData(prefectureId: string, dryRun: boolean): Promise<{ cities: number; machi: number }> {
  const filePath = path.join(__dirname, '../data', 'machi', `${prefectureId}_machi_data.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️ ファイルなし: ${filePath}`);
    return { cities: 0, machi: 0 };
  }

  const data: MachiDataFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // typeがnullのcityを除外
  const validCities = data.cities.filter((c) => c.type !== null);

  // citiesの重複IDを処理（同じ読みの市町村が存在する場合）
  const seenCityIds = new Set<string>();
  const processedCities = validCities.map((c) => {
    let uniqueId = c.id;
    if (seenCityIds.has(uniqueId)) {
      // typeを末尾に追加して区別（例: jp_hokkaido_kushiro → jp_hokkaido_kushiro_town）
      const typeSuffix = c.type === '町' ? '_town' : c.type === '村' ? '_village' : '_2';
      uniqueId = `${c.id}${typeSuffix}`;
    }
    seenCityIds.add(uniqueId);
    return { ...c, uniqueId };
  });

  // 重複IDを処理（machiデータ）
  const seenMachiIds = new Set<string>();
  const processedMachi = data.machi.map((m) => {
    let uniqueId = m.id;
    if (seenMachiIds.has(uniqueId)) {
      uniqueId = `${m.id}_dup`;
    }
    seenMachiIds.add(uniqueId);
    // city_idも更新が必要な場合がある（citiesで重複処理されたIDを参照している場合）
    let updatedCityId = m.city_id;
    if (m.city_id && !seenCityIds.has(m.city_id)) {
      // city_idが見つからない場合はnullにする
      updatedCityId = null;
    }
    return { ...m, uniqueId, city_id: updatedCityId };
  });

  if (dryRun) {
    return { cities: processedCities.length, machi: processedMachi.length };
  }

  // 既存データを削除
  await supabase.from('machi').delete().eq('prefecture_id', prefectureId);
  await supabase.from('cities').delete().eq('prefecture_id', prefectureId);

  // citiesを挿入（バッチ）
  if (processedCities.length > 0) {
    const cityRows = processedCities.map((c) => ({
      id: c.uniqueId,
      prefecture_id: c.prefecture_id,
      name: c.name,
      name_kana: c.name_kana || c.name,
      name_translations: c.name_translations,
      type: c.type,
      latitude: c.latitude,
      longitude: c.longitude,
    }));

    const { error: cityError } = await supabase.from('cities').upsert(cityRows, { onConflict: 'id' });
    if (cityError) {
      console.error(`  ❌ cities挿入エラー:`, cityError.message);
    }
  }

  // machiを挿入（バッチ、1000件ずつ）
  const BATCH_SIZE = 1000;
  const prefectureName = data.prefecture.name;
  for (let i = 0; i < processedMachi.length; i += BATCH_SIZE) {
    const batch = processedMachi.slice(i, i + BATCH_SIZE);
    const machiRows = batch.map((m) => ({
      id: m.uniqueId,
      name: m.name,
      name_kana: m.name_kana || m.name,
      name_translations: m.name_translations,
      latitude: m.latitude,
      longitude: m.longitude,
      prefecture_id: m.prefecture_id,
      prefecture_name: prefectureName,
      city_id: m.city_id,
      place_type: m.place_type,
      tile_id: getTileId(m.latitude, m.longitude),
    }));

    const { error: machiError } = await supabase.from('machi').upsert(machiRows, { onConflict: 'id' });
    if (machiError) {
      console.error(`  ❌ machi挿入エラー (batch ${i / BATCH_SIZE + 1}):`, machiError.message);
    }
  }

  return { cities: processedCities.length, machi: processedMachi.length };
}

/**
 * 交通データをアップロード
 */
async function uploadTransportData(prefectureId: string, dryRun: boolean): Promise<number> {
  const filePath = path.join(__dirname, '../data', 'transport', `${prefectureId}_transport_data.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️ ファイルなし: ${filePath}`);
    return 0;
  }

  const data: TransportDataFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (dryRun) {
    return data.data.length;
  }

  // 既存データを削除
  await supabase.from('transport_hubs').delete().eq('prefecture_id', prefectureId);

  // バッチ挿入（1000件ずつ）
  const BATCH_SIZE = 1000;
  for (let i = 0; i < data.data.length; i += BATCH_SIZE) {
    const batch = data.data.slice(i, i + BATCH_SIZE);
    const rows = batch.map((h) => ({
      id: h.id,
      osm_id: h.osm_id,
      osm_type: h.osm_type,
      prefecture_id: h.prefecture_id,
      type: h.type,
      subtype: h.subtype,
      name: h.name,
      name_kana: h.name_kana,
      name_translations: h.name_translations,
      operator: h.operator,
      network: h.network,
      ref: h.ref,
      latitude: h.latitude,
      longitude: h.longitude,
      tile_id: getTileId(h.latitude, h.longitude),
    }));

    const { error } = await supabase.from('transport_hubs').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ transport_hubs挿入エラー (batch ${i / BATCH_SIZE + 1}):`, error.message);
    }
  }

  return data.data.length;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  const uploadMachi = args.includes('--machi') || (!args.includes('--transport'));
  const uploadTransport = args.includes('--transport') || (!args.includes('--machi'));
  const dryRun = args.includes('--dry-run');

  const prefArg = args.find((a) => a.startsWith('--prefecture='));
  const targetPrefectures = prefArg
    ? [prefArg.replace('--prefecture=', '')]
    : PREFECTURES;

  console.log('============================================================');
  console.log('OSMデータ Supabaseアップロード');
  console.log('============================================================');
  console.log(`  対象: ${targetPrefectures.length}都道府県`);
  console.log(`  街データ: ${uploadMachi ? 'アップロード' : 'スキップ'}`);
  console.log(`  交通データ: ${uploadTransport ? 'アップロード' : 'スキップ'}`);
  console.log(`  モード: ${dryRun ? 'ドライラン（実際にはアップロードしない）' : '本番'}`);
  console.log('');

  let totalCities = 0;
  let totalMachi = 0;
  let totalTransport = 0;

  for (let i = 0; i < targetPrefectures.length; i++) {
    const prefectureId = targetPrefectures[i];
    console.log(`[${i + 1}/${targetPrefectures.length}] ${prefectureId}`);

    if (uploadMachi) {
      const { cities, machi } = await uploadMachiData(prefectureId, dryRun);
      totalCities += cities;
      totalMachi += machi;
      console.log(`  📍 街データ: cities ${cities}件, machi ${machi}件`);
    }

    if (uploadTransport) {
      const transport = await uploadTransportData(prefectureId, dryRun);
      totalTransport += transport;
      console.log(`  🚃 交通データ: ${transport}件`);
    }
  }

  console.log('');
  console.log('============================================================');
  console.log('完了サマリー');
  console.log('============================================================');
  if (uploadMachi) {
    console.log(`  cities: ${totalCities}件`);
    console.log(`  machi: ${totalMachi}件`);
  }
  if (uploadTransport) {
    console.log(`  transport_hubs: ${totalTransport}件`);
  }
}

main().catch(console.error);
