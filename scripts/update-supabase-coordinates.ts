/**
 * Supabaseのcities/prefecturesテーブルに座標データを追加するスクリプト
 *
 * 使い方:
 * npx ts-node scripts/update-supabase-coordinates.ts
 */

import { createClient } from '@supabase/supabase-js';

// 環境変数から取得（.envファイルがある場合はdotenvを使用）
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ EXPO_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 都道府県の座標データ（都道府県庁所在地）
const prefectureCoordinates: Record<string, { latitude: number; longitude: number }> = {
  hokkaido: { latitude: 43.0646, longitude: 141.3468 },
  aomori: { latitude: 40.8244, longitude: 140.7400 },
  iwate: { latitude: 39.7036, longitude: 141.1527 },
  miyagi: { latitude: 38.2688, longitude: 140.8721 },
  akita: { latitude: 39.7186, longitude: 140.1024 },
  yamagata: { latitude: 38.2404, longitude: 140.3633 },
  fukushima: { latitude: 37.7500, longitude: 140.4678 },
  ibaraki: { latitude: 36.3418, longitude: 140.4468 },
  tochigi: { latitude: 36.5657, longitude: 139.8836 },
  gunma: { latitude: 36.3912, longitude: 139.0608 },
  saitama: { latitude: 35.8569, longitude: 139.6489 },
  chiba: { latitude: 35.6047, longitude: 140.1233 },
  tokyo: { latitude: 35.6895, longitude: 139.6917 },
  kanagawa: { latitude: 35.4478, longitude: 139.6425 },
  niigata: { latitude: 37.9024, longitude: 139.0232 },
  toyama: { latitude: 36.6953, longitude: 137.2113 },
  ishikawa: { latitude: 36.5946, longitude: 136.6256 },
  fukui: { latitude: 36.0652, longitude: 136.2216 },
  yamanashi: { latitude: 35.6642, longitude: 138.5684 },
  nagano: { latitude: 36.6513, longitude: 138.1810 },
  gifu: { latitude: 35.3912, longitude: 136.7223 },
  shizuoka: { latitude: 34.9769, longitude: 138.3831 },
  aichi: { latitude: 35.1802, longitude: 136.9066 },
  mie: { latitude: 34.7303, longitude: 136.5086 },
  shiga: { latitude: 35.0045, longitude: 135.8686 },
  kyoto: { latitude: 35.0116, longitude: 135.7681 },
  osaka: { latitude: 34.6863, longitude: 135.5200 },
  hyogo: { latitude: 34.6913, longitude: 135.1830 },
  nara: { latitude: 34.6851, longitude: 135.8329 },
  wakayama: { latitude: 34.2260, longitude: 135.1675 },
  tottori: { latitude: 35.5039, longitude: 134.2378 },
  shimane: { latitude: 35.4723, longitude: 133.0505 },
  okayama: { latitude: 34.6618, longitude: 133.9344 },
  hiroshima: { latitude: 34.3963, longitude: 132.4596 },
  yamaguchi: { latitude: 34.1859, longitude: 131.4714 },
  tokushima: { latitude: 34.0658, longitude: 134.5593 },
  kagawa: { latitude: 34.3401, longitude: 134.0434 },
  ehime: { latitude: 33.8416, longitude: 132.7657 },
  kochi: { latitude: 33.5597, longitude: 133.5311 },
  fukuoka: { latitude: 33.6064, longitude: 130.4183 },
  saga: { latitude: 33.2494, longitude: 130.2988 },
  nagasaki: { latitude: 32.7448, longitude: 129.8737 },
  kumamoto: { latitude: 32.7898, longitude: 130.7417 },
  oita: { latitude: 33.2382, longitude: 131.6126 },
  miyazaki: { latitude: 31.9111, longitude: 131.4239 },
  kagoshima: { latitude: 31.5602, longitude: 130.5581 },
  okinawa: { latitude: 26.2124, longitude: 127.6809 },
};

// 主要市区の座標データ（区役所・市役所所在地）
const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  // 東京23区
  chiyoda: { latitude: 35.6940, longitude: 139.7536 },
  chuo: { latitude: 35.6707, longitude: 139.7724 },
  minato: { latitude: 35.6581, longitude: 139.7514 },
  shinjuku: { latitude: 35.6938, longitude: 139.7034 },
  bunkyo: { latitude: 35.7081, longitude: 139.7522 },
  taito: { latitude: 35.7126, longitude: 139.7801 },
  sumida: { latitude: 35.7107, longitude: 139.8015 },
  koto: { latitude: 35.6729, longitude: 139.8172 },
  shinagawa: { latitude: 35.6090, longitude: 139.7302 },
  meguro: { latitude: 35.6414, longitude: 139.6982 },
  ota: { latitude: 35.5613, longitude: 139.7160 },
  setagaya: { latitude: 35.6464, longitude: 139.6532 },
  shibuya: { latitude: 35.6640, longitude: 139.6982 },
  nakano: { latitude: 35.7078, longitude: 139.6638 },
  suginami: { latitude: 35.6995, longitude: 139.6364 },
  toshima: { latitude: 35.7263, longitude: 139.7162 },
  kita: { latitude: 35.7528, longitude: 139.7499 },
  arakawa: { latitude: 35.7364, longitude: 139.7834 },
  itabashi: { latitude: 35.7512, longitude: 139.7094 },
  nerima: { latitude: 35.7356, longitude: 139.6516 },
  adachi: { latitude: 35.7752, longitude: 139.8045 },
  katsushika: { latitude: 35.7436, longitude: 139.8474 },
  edogawa: { latitude: 35.7067, longitude: 139.8682 },
  // 東京都下の主要市
  hachioji: { latitude: 35.6664, longitude: 139.3160 },
  tachikawa: { latitude: 35.6979, longitude: 139.4147 },
  musashino: { latitude: 35.7177, longitude: 139.5661 },
  mitaka: { latitude: 35.6836, longitude: 139.5596 },
  fuchu: { latitude: 35.6690, longitude: 139.4777 },
  chofu: { latitude: 35.6505, longitude: 139.5405 },
  machida: { latitude: 35.5489, longitude: 139.4462 },
  // 神奈川県
  yokohama_nishi: { latitude: 35.4665, longitude: 139.6226 },
  yokohama_naka: { latitude: 35.4437, longitude: 139.6380 },
  yokohama_minami: { latitude: 35.4390, longitude: 139.6043 },
  yokohama_kohoku: { latitude: 35.5316, longitude: 139.5996 },
  kawasaki_kawasaki: { latitude: 35.5308, longitude: 139.7030 },
  kawasaki_nakahara: { latitude: 35.5701, longitude: 139.6563 },
  sagamihara_chuo: { latitude: 35.5716, longitude: 139.3727 },
  // 大阪府
  osaka_kita: { latitude: 34.7055, longitude: 135.4983 },
  osaka_chuo: { latitude: 34.6840, longitude: 135.5198 },
  osaka_naniwa: { latitude: 34.6596, longitude: 135.5013 },
  osaka_tennoji: { latitude: 34.6532, longitude: 135.5185 },
  // 愛知県
  nagoya_naka: { latitude: 35.1715, longitude: 136.8816 },
  nagoya_higashi: { latitude: 35.1716, longitude: 136.9232 },
  nagoya_chikusa: { latitude: 35.1647, longitude: 136.9499 },
  // 福岡県
  fukuoka_hakata: { latitude: 33.5903, longitude: 130.4017 },
  fukuoka_chuo: { latitude: 33.5903, longitude: 130.3920 },
  fukuoka_nishi: { latitude: 33.5838, longitude: 130.3481 },
  kitakyushu_kokura_kita: { latitude: 33.8833, longitude: 130.8753 },
  // 北海道
  sapporo_chuo: { latitude: 43.0553, longitude: 141.3411 },
  sapporo_kita: { latitude: 43.0908, longitude: 141.3407 },
  sapporo_higashi: { latitude: 43.0762, longitude: 141.3631 },
  // 宮城県
  sendai_aoba: { latitude: 38.2607, longitude: 140.8721 },
  sendai_miyagino: { latitude: 38.2646, longitude: 140.9120 },
  // 広島県
  hiroshima_naka: { latitude: 34.3853, longitude: 132.4553 },
  hiroshima_higashi: { latitude: 34.3963, longitude: 132.4879 },
};

async function updatePrefectureCoordinates() {
  console.log('📍 都道府県の座標を更新中...');

  for (const [id, coords] of Object.entries(prefectureCoordinates)) {
    const { error } = await supabase
      .from('prefectures')
      .update({ latitude: coords.latitude, longitude: coords.longitude })
      .eq('id', id);

    if (error) {
      console.error(`  ❌ ${id}: ${error.message}`);
    } else {
      console.log(`  ✅ ${id}: ${coords.latitude}, ${coords.longitude}`);
    }
  }
}

async function updateCityCoordinates() {
  console.log('🏙️ 市区の座標を更新中...');

  for (const [id, coords] of Object.entries(cityCoordinates)) {
    const { error } = await supabase
      .from('cities')
      .update({ latitude: coords.latitude, longitude: coords.longitude })
      .eq('id', id);

    if (error) {
      console.error(`  ❌ ${id}: ${error.message}`);
    } else {
      console.log(`  ✅ ${id}: ${coords.latitude}, ${coords.longitude}`);
    }
  }
}

async function main() {
  console.log('🚀 Supabase座標データ更新スクリプト開始\n');

  await updatePrefectureCoordinates();
  console.log('');
  await updateCityCoordinates();

  console.log('\n✅ 完了');
}

main().catch(console.error);
