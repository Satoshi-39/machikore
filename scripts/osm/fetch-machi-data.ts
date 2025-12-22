/**
 * OSMから街データを取得してJSONファイルに保存するスクリプト
 *
 * 使い方: npx tsx scripts/osm/fetch-machi-data.ts [prefecture_id]
 *
 * ID形式:
 * - prefectures: {country}_{prefecture} (例: jp_tokyo)
 * - cities: {country}_{prefecture}_{city} (例: jp_tokyo_shibuya)
 * - machi: {country}_{prefecture}_{city}_{machi} (例: jp_tokyo_shibuya_ebisu)
 */

const fs = require('fs');
const path = require('path');
const wanakana = require('wanakana');
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

// Kuroshiroインスタンス（グローバル）
let kuroshiro: typeof Kuroshiro | null = null;

/**
 * Kuroshiroを初期化
 */
async function initKuroshiro(): Promise<void> {
  if (kuroshiro) return;

  console.log('  形態素解析エンジンを初期化中...');
  kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  console.log('  初期化完了');
}

/**
 * 漢字をローマ字に変換
 */
async function kanjiToRomaji(text: string): Promise<string> {
  if (!kuroshiro) {
    throw new Error('Kuroshiro is not initialized');
  }

  // kuroshiroで直接ローマ字に変換
  const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
  return romaji;
}

interface OSMElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'name:en'?: string;
    'name:ja-Hira'?: string;
    'name:ja-Latn'?: string; // ローマ字表記
    'name:ja_rm'?: string; // ローマ字表記（別タグ）
    place?: string;
    wikidata?: string;
    wikipedia?: string;
    'is_in'?: string;
    'ISJ:city_name'?: string; // 国土数値情報からインポートされた市区町村名
    'ISJ:prefecture_name'?: string;
    'addr:city'?: string; // 住所タグの市区町村名
  };
}

interface OSMResponse {
  elements: OSMElement[];
}

interface CityData {
  id: string;
  prefecture_id: string;
  name: string;
  name_kana: string;
  name_translations: { en: string } | null;
  type: string | null; // 区, 市, 町, 村, 郡 または null（正式な市区町村でない場合）
  latitude: number;
  longitude: number;
}

interface MachiData {
  id: string;
  name: string;
  name_kana: string;
  name_translations: { en: string } | null;
  latitude: number;
  longitude: number;
  prefecture_id: string;
  city_id: string | null;
  place_type: string; // quarter, locality (参考用)
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

// 都道府県の定義（全47都道府県）- ID形式は jp_{prefecture}
const PREFECTURES: Record<string, { id: string; name: string }> = {
  '北海道': { id: 'jp_hokkaido', name: '北海道' },
  '青森県': { id: 'jp_aomori', name: '青森県' },
  '岩手県': { id: 'jp_iwate', name: '岩手県' },
  '宮城県': { id: 'jp_miyagi', name: '宮城県' },
  '秋田県': { id: 'jp_akita', name: '秋田県' },
  '山形県': { id: 'jp_yamagata', name: '山形県' },
  '福島県': { id: 'jp_fukushima', name: '福島県' },
  '茨城県': { id: 'jp_ibaraki', name: '茨城県' },
  '栃木県': { id: 'jp_tochigi', name: '栃木県' },
  '群馬県': { id: 'jp_gunma', name: '群馬県' },
  '埼玉県': { id: 'jp_saitama', name: '埼玉県' },
  '千葉県': { id: 'jp_chiba', name: '千葉県' },
  '東京都': { id: 'jp_tokyo', name: '東京都' },
  '神奈川県': { id: 'jp_kanagawa', name: '神奈川県' },
  '新潟県': { id: 'jp_niigata', name: '新潟県' },
  '富山県': { id: 'jp_toyama', name: '富山県' },
  '石川県': { id: 'jp_ishikawa', name: '石川県' },
  '福井県': { id: 'jp_fukui', name: '福井県' },
  '山梨県': { id: 'jp_yamanashi', name: '山梨県' },
  '長野県': { id: 'jp_nagano', name: '長野県' },
  '岐阜県': { id: 'jp_gifu', name: '岐阜県' },
  '静岡県': { id: 'jp_shizuoka', name: '静岡県' },
  '愛知県': { id: 'jp_aichi', name: '愛知県' },
  '三重県': { id: 'jp_mie', name: '三重県' },
  '滋賀県': { id: 'jp_shiga', name: '滋賀県' },
  '京都府': { id: 'jp_kyoto', name: '京都府' },
  '大阪府': { id: 'jp_osaka', name: '大阪府' },
  '兵庫県': { id: 'jp_hyogo', name: '兵庫県' },
  '奈良県': { id: 'jp_nara', name: '奈良県' },
  '和歌山県': { id: 'jp_wakayama', name: '和歌山県' },
  '鳥取県': { id: 'jp_tottori', name: '鳥取県' },
  '島根県': { id: 'jp_shimane', name: '島根県' },
  '岡山県': { id: 'jp_okayama', name: '岡山県' },
  '広島県': { id: 'jp_hiroshima', name: '広島県' },
  '山口県': { id: 'jp_yamaguchi', name: '山口県' },
  '徳島県': { id: 'jp_tokushima', name: '徳島県' },
  '香川県': { id: 'jp_kagawa', name: '香川県' },
  '愛媛県': { id: 'jp_ehime', name: '愛媛県' },
  '高知県': { id: 'jp_kochi', name: '高知県' },
  '福岡県': { id: 'jp_fukuoka', name: '福岡県' },
  '佐賀県': { id: 'jp_saga', name: '佐賀県' },
  '長崎県': { id: 'jp_nagasaki', name: '長崎県' },
  '熊本県': { id: 'jp_kumamoto', name: '熊本県' },
  '大分県': { id: 'jp_oita', name: '大分県' },
  '宮崎県': { id: 'jp_miyazaki', name: '宮崎県' },
  '鹿児島県': { id: 'jp_kagoshima', name: '鹿児島県' },
  '沖縄県': { id: 'jp_okinawa', name: '沖縄県' },
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
 * ローマ字をスラッグ形式に変換
 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    // 長音記号付き文字を通常のアルファベットに変換
    .replace(/ā/g, 'a')
    .replace(/ī/g, 'i')
    .replace(/ū/g, 'u')
    .replace(/ē/g, 'e')
    .replace(/ō/g, 'o')
    // 英数字以外をアンダースコアに
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * ひらがな/カタカナをローマ字に変換
 */
function kanaToRomaji(kana: string): string {
  if (!kana) return '';
  // wanakanaでローマ字変換
  return wanakana.toRomaji(kana);
}

/**
 * 名前からスラッグを生成
 *
 * 優先順位:
 * 1. name:en - 英語名
 * 2. name:ja-Latn - ローマ字表記
 * 3. name:ja_rm - ローマ字表記（別タグ）
 * 4. name:ja-Hira → wanakanaでローマ字変換
 * 5. 漢字名 → kuroshiroでローマ字変換
 */
async function toSlugFromTags(
  nameEn: string | null,
  nameJaLatn: string | null,
  nameJaRm: string | null,
  nameKana: string | null,
  name: string
): Promise<string> {
  // 1. 英語名
  if (nameEn) {
    return toSlug(nameEn);
  }

  // 2. name:ja-Latn（ローマ字）
  if (nameJaLatn) {
    return toSlug(nameJaLatn);
  }

  // 3. name:ja_rm（ローマ字別タグ）
  if (nameJaRm) {
    return toSlug(nameJaRm);
  }

  // 4. ひらがな読み → ローマ字変換
  if (nameKana) {
    const romaji = kanaToRomaji(nameKana);
    if (romaji) {
      return toSlug(romaji);
    }
  }

  // 5. 漢字名 → kuroshiroでローマ字変換
  const nameWithoutSuffix = name
    .replace(/区$/, '')
    .replace(/市$/, '')
    .replace(/町$/, '')
    .replace(/村$/, '');

  try {
    const romaji = await kanjiToRomaji(nameWithoutSuffix);
    return toSlug(romaji);
  } catch {
    // 変換失敗時は元の名前をそのまま使用
    return nameWithoutSuffix;
  }
}

/**
 * Overpass APIからデータを取得
 */
async function fetchOSMData(prefectureName: string, placeTypes: string[]): Promise<OSMElement[]> {
  const placeFilter = placeTypes.join('|');
  const query = `
    [out:json][timeout:120];
    area["name"="${prefectureName}"]->.searchArea;
    (
      node["place"~"${placeFilter}"](area.searchArea);
    );
    out body;
  `;

  // 複数のOverpassエンドポイントを用意（メインがダウンしている場合のバックアップ）
  const url = 'https://overpass.kumi.systems/api/interpreter';
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
async function convertToCityData(
  elements: OSMElement[],
  prefectureId: string,
  prefectureName: string
): Promise<CityData[]> {
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

    const slug = await toSlugFromTags(
      element.tags['name:en'] ?? null,
      element.tags['name:ja-Latn'] ?? null,
      element.tags['name:ja_rm'] ?? null,
      element.tags['name:ja-Hira'] ?? null,
      name
    );
    const id = `${prefectureId}_${slug}`;
    const nameEn = element.tags['name:en'] ?? null;

    results.push({
      id,
      prefecture_id: prefectureId,
      name,
      name_kana: element.tags['name:ja-Hira'] ?? '',
      name_translations: nameEn ? { en: nameEn } : null,
      type: getCityType(name),
      latitude: element.lat,
      longitude: element.lon,
    });
  }

  return results;
}

/**
 * 市区町村名からcityを見つける
 * 優先順位:
 * 1. ISJ:city_name（国土数値情報からの市区町村名）
 * 2. addr:city（住所タグの市区町村名）
 * 3. is_in（所属情報）
 */
function findCityFromTags(
  tags: OSMElement['tags'],
  cities: CityData[]
): CityData | null {
  // 1. ISJ:city_name を優先（日本のデータに最も多い）
  const isjCityName = tags['ISJ:city_name'];
  if (isjCityName) {
    const match = cities.find(city => city.name === isjCityName);
    if (match) return match;
  }

  // 2. addr:city を試す
  const addrCity = tags['addr:city'];
  if (addrCity) {
    const match = cities.find(city => city.name === addrCity);
    if (match) return match;
  }

  // 3. is_in を試す
  const isIn = tags['is_in'];
  if (isIn) {
    // "北区 (Kita)" のような形式から日本語名を抽出
    const japaneseName = isIn.split('(')[0].trim();
    const match = cities.find(city => city.name === japaneseName);
    if (match) return match;
  }

  return null;
}

/**
 * OSMデータをMachiData形式に変換
 * ISJ:city_name, addr:city, is_in タグからcityを紐付ける
 */
async function convertToMachiData(
  elements: OSMElement[],
  prefectureId: string,
  prefectureName: string,
  cities: CityData[]
): Promise<MachiData[]> {
  const results: MachiData[] = [];
  const seenIds = new Set<string>();
  let noCityCount = 0;

  for (const element of elements) {
    const name = element.tags.name;
    if (!name) continue;

    // 丁目を含む名前は除外
    if (name.includes('丁目')) continue;

    // タグからcityを探す（ISJ:city_name, addr:city, is_in の順で試行）
    const matchedCity = findCityFromTags(element.tags, cities);

    const slug = await toSlugFromTags(
      element.tags['name:en'] ?? null,
      element.tags['name:ja-Latn'] ?? null,
      element.tags['name:ja_rm'] ?? null,
      element.tags['name:ja-Hira'] ?? null,
      name
    );
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
      noCityCount++;
    }

    const nameEn = element.tags['name:en'] ?? null;

    results.push({
      id,
      name,
      name_kana: element.tags['name:ja-Hira'] ?? '',
      name_translations: nameEn ? { en: nameEn } : null,
      latitude: element.lat,
      longitude: element.lon,
      prefecture_id: prefectureId,
      city_id: matchedCity?.id ?? null,
      place_type: element.tags.place || 'unknown',
    });
  }

  if (noCityCount > 0) {
    console.log(`    ⚠️ 市区町村不明: ${noCityCount}件（city_idがnull）`);
  }

  return results;
}

// IDから日本語名へのマッピング（全47都道府県）- ID形式は jp_{prefecture}
const ID_TO_NAME: Record<string, string> = {
  jp_hokkaido: '北海道',
  jp_aomori: '青森県',
  jp_iwate: '岩手県',
  jp_miyagi: '宮城県',
  jp_akita: '秋田県',
  jp_yamagata: '山形県',
  jp_fukushima: '福島県',
  jp_ibaraki: '茨城県',
  jp_tochigi: '栃木県',
  jp_gunma: '群馬県',
  jp_saitama: '埼玉県',
  jp_chiba: '千葉県',
  jp_tokyo: '東京都',
  jp_kanagawa: '神奈川県',
  jp_niigata: '新潟県',
  jp_toyama: '富山県',
  jp_ishikawa: '石川県',
  jp_fukui: '福井県',
  jp_yamanashi: '山梨県',
  jp_nagano: '長野県',
  jp_gifu: '岐阜県',
  jp_shizuoka: '静岡県',
  jp_aichi: '愛知県',
  jp_mie: '三重県',
  jp_shiga: '滋賀県',
  jp_kyoto: '京都府',
  jp_osaka: '大阪府',
  jp_hyogo: '兵庫県',
  jp_nara: '奈良県',
  jp_wakayama: '和歌山県',
  jp_tottori: '鳥取県',
  jp_shimane: '島根県',
  jp_okayama: '岡山県',
  jp_hiroshima: '広島県',
  jp_yamaguchi: '山口県',
  jp_tokushima: '徳島県',
  jp_kagawa: '香川県',
  jp_ehime: '愛媛県',
  jp_kochi: '高知県',
  jp_fukuoka: '福岡県',
  jp_saga: '佐賀県',
  jp_nagasaki: '長崎県',
  jp_kumamoto: '熊本県',
  jp_oita: '大分県',
  jp_miyazaki: '宮崎県',
  jp_kagoshima: '鹿児島県',
  jp_okinawa: '沖縄県',
};

/**
 * メイン処理
 */
async function main() {
  console.log('OSM街データ取得スクリプト');
  console.log('='.repeat(50));

  // コマンドライン引数から都道府県IDを取得
  const prefectureId = process.argv[2] || 'jp_yamaguchi';
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

  // Kuroshiroを初期化（漢字→ローマ字変換用）
  await initKuroshiro();

  let cities: CityData[] = [];
  let allMachi: MachiData[] = [];

  try {
    // 1. city（市）を取得
    console.log('  - place=city を取得中...');
    const cityElements = await fetchOSMData(prefectureName, ['city']);
    const citiesFromCity = await convertToCityData(cityElements, prefecture.id, prefecture.name);
    console.log(`    ${citiesFromCity.length}件取得`);
    cities.push(...citiesFromCity);

    // 少し待機（API制限対策）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. town（町）を取得
    console.log('  - place=town を取得中...');
    const townElements = await fetchOSMData(prefectureName, ['town']);
    const citiesFromTown = await convertToCityData(townElements, prefecture.id, prefecture.name);
    console.log(`    ${citiesFromTown.length}件取得`);
    cities.push(...citiesFromTown);

    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. village（村）を取得 - 行政区分の村のみ（名前が「村」で終わるもの）
    console.log('  - place=village を取得中...');
    const villageElements = await fetchOSMData(prefectureName, ['village']);
    const adminVillages = villageElements.filter(e => e.tags.name?.endsWith('村'));
    const citiesFromVillage = await convertToCityData(adminVillages, prefecture.id, prefecture.name);
    console.log(`    ${citiesFromVillage.length}件取得（行政村のみ）`);
    cities.push(...citiesFromVillage);

    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. quarter（街・エリア）を取得
    console.log('  - place=quarter を取得中...');
    const quarterElements = await fetchOSMData(prefectureName, ['quarter']);
    const quarterMachi = await convertToMachiData(quarterElements, prefecture.id, prefecture.name, cities);
    console.log(`    ${quarterMachi.length}件取得`);
    allMachi.push(...quarterMachi);

    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. locality（地域・場所）を取得
    console.log('  - place=locality を取得中...');
    const localityElements = await fetchOSMData(prefectureName, ['locality']);
    const localityMachi = await convertToMachiData(
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

  // JSONファイルに保存（data/machi フォルダに保存）
  const outputDir = path.join(__dirname, '../data', 'machi');
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
    const cityName = cities.find(c => c.id === machi.city_id)?.name ?? '不明';
    console.log(`  - ${machi.id}: ${machi.name} @ ${cityName} [${machi.place_type}]`);
  });
}

main().catch(console.error);
