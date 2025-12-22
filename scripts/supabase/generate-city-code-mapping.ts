/**
 * OSMから取得したcitiesデータと国土数値情報の市区町村コードのマッピングを生成
 *
 * 使い方: npx tsx scripts/supabase/generate-city-code-mapping.ts
 *
 * 出力: scripts/data/city-code-mapping.json
 */

import * as fs from 'fs';
import * as path from 'path';

// 都道府県コード（JIS X 0401）
const PREFECTURE_CODES: Record<string, string> = {
  jp_hokkaido: '01',
  jp_aomori: '02',
  jp_iwate: '03',
  jp_miyagi: '04',
  jp_akita: '05',
  jp_yamagata: '06',
  jp_fukushima: '07',
  jp_ibaraki: '08',
  jp_tochigi: '09',
  jp_gunma: '10',
  jp_saitama: '11',
  jp_chiba: '12',
  jp_tokyo: '13',
  jp_kanagawa: '14',
  jp_niigata: '15',
  jp_toyama: '16',
  jp_ishikawa: '17',
  jp_fukui: '18',
  jp_yamanashi: '19',
  jp_nagano: '20',
  jp_gifu: '21',
  jp_shizuoka: '22',
  jp_aichi: '23',
  jp_mie: '24',
  jp_shiga: '25',
  jp_kyoto: '26',
  jp_osaka: '27',
  jp_hyogo: '28',
  jp_nara: '29',
  jp_wakayama: '30',
  jp_tottori: '31',
  jp_shimane: '32',
  jp_okayama: '33',
  jp_hiroshima: '34',
  jp_yamaguchi: '35',
  jp_tokushima: '36',
  jp_kagawa: '37',
  jp_ehime: '38',
  jp_kochi: '39',
  jp_fukuoka: '40',
  jp_saga: '41',
  jp_nagasaki: '42',
  jp_kumamoto: '43',
  jp_oita: '44',
  jp_miyazaki: '45',
  jp_kagoshima: '46',
  jp_okinawa: '47',
};

interface CityData {
  id: string;
  prefecture_id: string;
  name: string;
  name_kana: string;
  name_translations: { en: string } | null;
  type: string | null;
  latitude: number;
  longitude: number;
}

interface MachiDataFile {
  fetchedAt: string;
  prefecture: { id: string; name: string };
  cities: CityData[];
  machi: unknown[];
}

interface CityCodeEntry {
  code: string;        // 5桁の市区町村コード
  city_id: string;     // OSMから取得したcity_id
  name: string;        // 市区町村名
  prefecture_id: string;
}

/**
 * 既存のシードファイルから市区町村コードと名前のリストを抽出
 */
function extractCodesFromSeedFiles(): Map<string, string> {
  const codeToName = new Map<string, string>();

  const seedDir = path.join(__dirname, '../data/admin_boundaries_old');
  const files = fs.readdirSync(seedDir).filter(f => f.match(/^\d{3}_seed_admin_boundaries_postgis_\d+\.sql$/));

  for (const file of files) {
    const content = fs.readFileSync(path.join(seedDir, file), 'utf-8');

    // VALUES ('01101', '札幌市中央区', ... のパターンを抽出
    const regex = /VALUES\s*\('(\d{5})',\s*'([^']+)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const code = match[1];
      const name = match[2];
      codeToName.set(code, name);
    }
  }

  console.log(`シードファイルから${codeToName.size}件の市区町村コードを抽出`);
  return codeToName;
}

/**
 * OSMから取得したcitiesデータを読み込み
 */
function loadOsmCities(): Map<string, CityData[]> {
  const prefectureCities = new Map<string, CityData[]>();

  const dataDir = path.join(__dirname, '../data/machi');
  if (!fs.existsSync(dataDir)) {
    console.error('データディレクトリが見つかりません:', dataDir);
    return prefectureCities;
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('_machi_data.json'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const data: MachiDataFile = JSON.parse(content);
    prefectureCities.set(data.prefecture.id, data.cities);
  }

  console.log(`${prefectureCities.size}都道府県のcitiesデータを読み込み`);
  return prefectureCities;
}

/**
 * 市区町村名を正規化（比較用）
 */
function normalizeName(name: string): string {
  return name
    .replace(/\s+/g, '')  // 空白除去
    .replace(/ヶ/g, 'ケ')  // ヶ→ケ
    .replace(/ケ/g, 'ヶ')  // 統一（後で戻す）
    .replace(/ヶ/g, 'ケ');
}

/**
 * マッピングを生成
 */
function generateMapping(
  codeToName: Map<string, string>,
  prefectureCities: Map<string, CityData[]>
): CityCodeEntry[] {
  const mapping: CityCodeEntry[] = [];
  const unmapped: { code: string; name: string }[] = [];

  for (const [code, name] of codeToName) {
    const prefCode = code.substring(0, 2);

    // 都道府県IDを見つける
    const prefectureId = Object.entries(PREFECTURE_CODES)
      .find(([_, c]) => c === prefCode)?.[0];

    if (!prefectureId) {
      console.warn(`都道府県コード${prefCode}に対応するIDが見つかりません`);
      continue;
    }

    // OSMのcitiesから名前が一致するものを探す
    const cities = prefectureCities.get(prefectureId);
    if (!cities) {
      unmapped.push({ code, name });
      continue;
    }

    const normalizedName = normalizeName(name);
    const matchedCity = cities.find(city =>
      normalizeName(city.name) === normalizedName
    );

    if (matchedCity) {
      mapping.push({
        code,
        city_id: matchedCity.id,
        name,
        prefecture_id: prefectureId,
      });
    } else {
      unmapped.push({ code, name });
    }
  }

  console.log(`\nマッピング結果:`);
  console.log(`  成功: ${mapping.length}件`);
  console.log(`  未マッピング: ${unmapped.length}件`);

  if (unmapped.length > 0 && unmapped.length <= 50) {
    console.log(`\n未マッピングの市区町村:`);
    unmapped.forEach(u => console.log(`  ${u.code}: ${u.name}`));
  }

  return mapping;
}

async function main() {
  console.log('市区町村コードマッピング生成');
  console.log('='.repeat(50));

  // 1. シードファイルからコードと名前を抽出
  const codeToName = extractCodesFromSeedFiles();

  // 2. OSMのcitiesデータを読み込み
  const prefectureCities = loadOsmCities();

  if (prefectureCities.size === 0) {
    console.error('OSMデータがありません。先にfetch-all-prefectures.tsを実行してください。');
    process.exit(1);
  }

  // 3. マッピング生成
  const mapping = generateMapping(codeToName, prefectureCities);

  // 4. 結果を保存
  const outputPath = path.join(__dirname, '../data/city-code-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nマッピングを保存しました: ${outputPath}`);

  // 5. 都道府県別の統計
  const prefectureStats = new Map<string, number>();
  for (const entry of mapping) {
    const count = prefectureStats.get(entry.prefecture_id) || 0;
    prefectureStats.set(entry.prefecture_id, count + 1);
  }

  console.log(`\n都道府県別マッピング数:`);
  const sortedStats = [...prefectureStats.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [prefId, count] of sortedStats) {
    console.log(`  ${prefId}: ${count}件`);
  }
}

main().catch(console.error);
