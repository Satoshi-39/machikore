/**
 * OSMから街データを取得してJSONファイルに保存するスクリプト
 *
 * 使い方: npx ts-node scripts/fetch-osm-machi-data.ts
 *
 * ID形式:
 * - prefectures: {prefecture} (例: tokyo)
 * - cities: {prefecture}_{city} (例: tokyo_shibuya)
 * - machi: {prefecture}_{city}_{machi} (例: tokyo_shibuya_ebisu)
 */

const fs = require('fs');
const path = require('path');

interface OSMElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'name:en'?: string;
    'name:ja-Hira'?: string;
    place?: string;
    wikidata?: string;
    wikipedia?: string;
    'is_in'?: string;
  };
}

interface OSMResponse {
  elements: OSMElement[];
}

interface CityData {
  id: string;
  osmId: number;
  prefectureId: string;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  type: string | null; // 区, 市, 町, 村, 郡 または null（正式な市区町村でない場合）
  countryCode: string;
  latitude: number;
  longitude: number;
}

interface MachiData {
  id: string;
  osmId: number;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  latitude: number;
  longitude: number;
  lines: null; // 境界線（今回は未取得）
  prefectureId: string;
  cityId: string | null;
  countryCode: string;
  prefectureName: string;
  prefectureNameTranslations: null;
  cityName: string | null;
  cityNameTranslations: null;
  placeType: string; // quarter, locality (参考用)
}

interface OutputData {
  fetchedAt: string;
  prefecture: {
    id: string;
    name: string;
  };
  cities: CityData[];
  machi: MachiData[];
}

// 都道府県の定義
const PREFECTURES: Record<string, { id: string; name: string }> = {
  '東京都': { id: 'tokyo', name: '東京都' },
  '神奈川県': { id: 'kanagawa', name: '神奈川県' },
  '埼玉県': { id: 'saitama', name: '埼玉県' },
  '千葉県': { id: 'chiba', name: '千葉県' },
  '大阪府': { id: 'osaka', name: '大阪府' },
  '京都府': { id: 'kyoto', name: '京都府' },
  '愛知県': { id: 'aichi', name: '愛知県' },
  '福岡県': { id: 'fukuoka', name: '福岡県' },
  '北海道': { id: 'hokkaido', name: '北海道' },
  '山口県': { id: 'yamaguchi', name: '山口県' },
};

/**
 * 市区町村の種別を判定
 * 正式な市区町村名でない場合はnullを返す
 */
function getCityType(name: string): string | null {
  if (name.endsWith('区')) return '区';
  if (name.endsWith('市')) return '市';
  if (name.endsWith('町')) return '町';
  if (name.endsWith('村')) return '村';
  if (name.endsWith('郡')) return '郡';
  return null; // 正式な市区町村でない場合はnull
}

/**
 * 英語名からスラッグを生成
 */
function toSlugFromEn(nameEn: string | null, name: string): string {
  if (nameEn) {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }
  // 英語名がない場合は日本語名から「区」「市」などを除去
  return name
    .replace(/区$/, '')
    .replace(/市$/, '')
    .replace(/町$/, '')
    .replace(/村$/, '');
}

/**
 * Overpass APIからデータを取得
 */
async function fetchOSMData(prefectureName: string, placeTypes: string[]): Promise<OSMElement[]> {
  const placeFilter = placeTypes.join('|');
  const query = `
    [out:json][timeout:60];
    area["name"="${prefectureName}"]->.searchArea;
    (
      node["place"~"${placeFilter}"](area.searchArea);
    );
    out body;
  `;

  const url = 'https://overpass-api.de/api/interpreter';
  const response = await fetch(url, {
    method: 'POST',
    body: query,
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OSM data: ${response.statusText}`);
  }

  const data = await response.json() as OSMResponse;
  return data.elements;
}

/**
 * OSMデータをCityData形式に変換
 */
function convertToCityData(
  elements: OSMElement[],
  prefectureId: string,
  prefectureName: string
): CityData[] {
  const results: CityData[] = [];
  const seenNames = new Set<string>();

  for (const element of elements) {
    const name = element.tags.name;
    if (!name) continue;

    // 都道府県自体は除外
    if (name === prefectureName) continue;

    // 重複チェック
    if (seenNames.has(name)) continue;
    seenNames.add(name);

    const slug = toSlugFromEn(element.tags['name:en'] ?? null, name);
    const id = `${prefectureId}_${slug}`;
    const nameEn = element.tags['name:en'] ?? null;

    results.push({
      id,
      osmId: element.id,
      prefectureId,
      name,
      nameKana: element.tags['name:ja-Hira'] ?? null,
      nameTranslations: nameEn ? { en: nameEn } : null,
      type: getCityType(name),
      countryCode: 'jp',
      latitude: element.lat,
      longitude: element.lon,
    });
  }

  return results;
}

/**
 * is_inタグからcityを見つける
 * is_inの形式例: "北区 (Kita)", "中野区 (Nakano)", "Japan, Tokyo"
 * is_inタグがない場合はnullを返す（座標ベースの判定は誤りの原因になるため行わない）
 */
function findCityByIsIn(isInValue: string | undefined, cities: CityData[]): CityData | null {
  if (!isInValue) return null;
  const isIn: string = isInValue;

  // "北区 (Kita)" のような形式から日本語名を抽出
  const japaneseName = isIn.split('(')[0].trim();

  // 完全一致で検索（部分一致は誤マッチの原因になるため行わない）
  const exactMatch = cities.find(city => city.name === japaneseName);
  return exactMatch ?? null;
}

/**
 * OSMデータをMachiData形式に変換
 * is_inタグがある場合のみcityを紐付け、ない場合はcityId/cityNameをnullにする
 */
function convertToMachiData(
  elements: OSMElement[],
  prefectureId: string,
  prefectureName: string,
  cities: CityData[]
): MachiData[] {
  const results: MachiData[] = [];
  const seenIds = new Set<string>();
  let noIsInCount = 0;

  for (const element of elements) {
    const name = element.tags.name;
    if (!name) continue;

    // 丁目を含む名前は除外
    if (name.includes('丁目')) continue;

    // is_inタグからcityを探す（座標ベースの判定は行わない）
    const matchedCity = findCityByIsIn(element.tags['is_in'], cities);

    const slug = toSlugFromEn(element.tags['name:en'] ?? null, name);
    const citySlug = matchedCity ? matchedCity.id.replace(`${prefectureId}_`, '') : 'unknown';
    const placeType = element.tags.place || 'unknown';
    let id = `${prefectureId}_${citySlug}_${slug}`;

    // 重複チェック（IDベース）- 重複がある場合はplaceTypeを付与、それでも重複ならosmIdを付与
    if (seenIds.has(id)) {
      id = `${id}_${placeType}`;
      if (seenIds.has(id)) {
        id = `${id}_${element.id}`;
      }
    }
    seenIds.add(id);

    if (!matchedCity) {
      noIsInCount++;
    }

    const nameEn = element.tags['name:en'] ?? null;

    results.push({
      id,
      osmId: element.id,
      name,
      nameKana: element.tags['name:ja-Hira'] ?? null,
      nameTranslations: nameEn ? { en: nameEn } : null,
      latitude: element.lat,
      longitude: element.lon,
      lines: null,
      prefectureId,
      cityId: matchedCity?.id ?? null,
      countryCode: 'jp',
      prefectureName,
      prefectureNameTranslations: null,
      cityName: matchedCity?.name ?? null,
      cityNameTranslations: null,
      placeType: element.tags.place || 'unknown',
    });
  }

  if (noIsInCount > 0) {
    console.log(`    ⚠️ is_inタグなし: ${noIsInCount}件（cityId/cityNameがnull）`);
  }

  return results;
}

// IDから日本語名へのマッピング
const ID_TO_NAME: Record<string, string> = {
  tokyo: '東京都',
  kanagawa: '神奈川県',
  saitama: '埼玉県',
  chiba: '千葉県',
  osaka: '大阪府',
  kyoto: '京都府',
  aichi: '愛知県',
  fukuoka: '福岡県',
  hokkaido: '北海道',
  yamaguchi: '山口県',
};

/**
 * メイン処理
 */
async function main() {
  console.log('OSM街データ取得スクリプト');
  console.log('='.repeat(50));

  // コマンドライン引数から都道府県IDを取得
  const prefectureId = process.argv[2] || 'yamaguchi';
  const prefectureName = ID_TO_NAME[prefectureId];

  if (!prefectureName) {
    console.error(`Unknown prefecture ID: ${prefectureId}`);
    console.error(`Available: ${Object.keys(ID_TO_NAME).join(', ')}`);
    process.exit(1);
  }

  const prefecture = PREFECTURES[prefectureName];

  if (!prefecture) {
    console.error(`Unknown prefecture: ${prefectureName}`);
    process.exit(1);
  }

  console.log(`\n${prefectureName}のデータを取得中...`);

  let cities: CityData[] = [];
  let allMachi: MachiData[] = [];

  try {
    // 1. city（区・市）を取得
    console.log('  - place=city を取得中...');
    const cityElements = await fetchOSMData(prefectureName, ['city']);
    cities = convertToCityData(cityElements, prefecture.id, prefecture.name);
    console.log(`    ${cities.length}件取得`);

    // 少し待機（API制限対策）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. quarter（街・エリア）を取得
    console.log('  - place=quarter を取得中...');
    const quarterElements = await fetchOSMData(prefectureName, ['quarter']);
    const quarterMachi = convertToMachiData(quarterElements, prefecture.id, prefecture.name, cities);
    console.log(`    ${quarterMachi.length}件取得`);
    allMachi.push(...quarterMachi);

    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. locality（地域・場所）を取得
    console.log('  - place=locality を取得中...');
    const localityElements = await fetchOSMData(prefectureName, ['locality']);
    const localityMachi = convertToMachiData(
      localityElements.filter(e => e.tags.name && !e.tags.name.includes('丁目')),
      prefecture.id,
      prefecture.name,
      cities
    );
    console.log(`    ${localityMachi.length}件取得`);
    allMachi.push(...localityMachi);

  } catch (error) {
    console.error(`Error fetching data for ${prefectureName}:`, error);
    process.exit(1);
  }

  console.log(`\n合計: cities ${cities.length}件, machi ${allMachi.length}件`);

  // 出力データを作成
  const outputData: OutputData = {
    fetchedAt: new Date().toISOString(),
    prefecture: {
      id: prefecture.id,
      name: prefecture.name,
    },
    cities,
    machi: allMachi,
  };

  // JSONファイルに保存
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${prefecture.id}_machi_data.json`);
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');

  console.log(`\nJSONファイルを保存しました: ${outputPath}`);

  // サンプルを表示
  console.log('\n' + '='.repeat(50));
  console.log('サンプルデータ:');
  console.log('='.repeat(50));

  console.log('\n【Cities (区・市) 最初の5件】');
  cities.slice(0, 5).forEach(city => {
    console.log(`  - ${city.id}: ${city.name} (${city.type})`);
  });

  console.log('\n【Machi (街) 最初の10件】');
  allMachi.slice(0, 10).forEach(machi => {
    console.log(`  - ${machi.id}: ${machi.name} @ ${machi.cityName} [${machi.placeType}]`);
  });
}

main().catch(console.error);
