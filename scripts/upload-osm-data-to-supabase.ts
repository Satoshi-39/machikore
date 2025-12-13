/**
 * OSMデータをSupabaseに直接アップロードするスクリプト
 *
 * 使い方:
 *   npx tsx scripts/upload-osm-data-to-supabase.ts [--machi] [--transport] [--prefecture=tokyo]
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

// 都道府県リスト
const PREFECTURES = [
  'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
  'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
  'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano',
  'gifu', 'shizuoka', 'aichi', 'mie',
  'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
  'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
  'tokushima', 'kagawa', 'ehime', 'kochi',
  'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa',
];

interface MachiDataFile {
  fetchedAt: string;
  prefecture: { id: string; name: string };
  cities: Array<{
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
  }>;
  machi: Array<{
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
    cityName: string | null;
    placeType: string;
  }>;
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
  data: Array<{
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
  }>;
}

/**
 * 街データをアップロード
 */
async function uploadMachiData(prefectureId: string, dryRun: boolean): Promise<{ cities: number; machi: number }> {
  const filePath = path.join(__dirname, 'data', 'machi', `${prefectureId}_machi_data.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️ ファイルなし: ${filePath}`);
    return { cities: 0, machi: 0 };
  }

  const data: MachiDataFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // typeがnullのcityを除外
  const validCities = data.cities.filter((c) => c.type !== null);

  // 重複IDを処理
  const seenIds = new Set<string>();
  const processedMachi = data.machi.map((m) => {
    let uniqueId = m.id;
    if (seenIds.has(uniqueId)) {
      uniqueId = `${m.id}_${m.osmId}`;
    }
    seenIds.add(uniqueId);
    return { ...m, uniqueId };
  });

  if (dryRun) {
    return { cities: validCities.length, machi: processedMachi.length };
  }

  // 既存データを削除
  await supabase.from('machi').delete().eq('prefecture_id', prefectureId);
  await supabase.from('cities').delete().eq('prefecture_id', prefectureId);

  // citiesを挿入（バッチ）
  if (validCities.length > 0) {
    const cityRows = validCities.map((c) => ({
      id: c.id,
      prefecture_id: c.prefectureId,
      name: c.name,
      name_kana: c.nameKana || c.name,
      name_translations: c.nameTranslations,
      type: c.type,
      country_code: c.countryCode,
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
  for (let i = 0; i < processedMachi.length; i += BATCH_SIZE) {
    const batch = processedMachi.slice(i, i + BATCH_SIZE);
    const machiRows = batch.map((m) => ({
      id: m.uniqueId,
      name: m.name,
      name_kana: m.nameKana || m.name,
      name_translations: m.nameTranslations,
      latitude: m.latitude,
      longitude: m.longitude,
      lines: null,
      prefecture_id: m.prefectureId,
      city_id: m.cityId,
      country_code: m.countryCode,
      prefecture_name: m.prefectureName,
      prefecture_name_translations: null,
      city_name: m.cityName,
      city_name_translations: null,
      osm_id: m.osmId,
      place_type: m.placeType,
    }));

    const { error: machiError } = await supabase.from('machi').upsert(machiRows, { onConflict: 'id' });
    if (machiError) {
      console.error(`  ❌ machi挿入エラー (batch ${i / BATCH_SIZE + 1}):`, machiError.message);
    }
  }

  return { cities: validCities.length, machi: processedMachi.length };
}

/**
 * 交通データをアップロード
 */
async function uploadTransportData(prefectureId: string, dryRun: boolean): Promise<number> {
  const filePath = path.join(__dirname, 'data', 'transport', `${prefectureId}_transport_data.json`);

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
      osm_id: h.osmId,
      osm_type: h.osmType,
      prefecture_id: h.prefectureId,
      type: h.type,
      subtype: h.subtype,
      name: h.name,
      name_kana: h.nameKana,
      name_en: h.nameEn,
      operator: h.operator,
      network: h.network,
      ref: h.ref,
      latitude: h.latitude,
      longitude: h.longitude,
      country_code: h.countryCode,
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
