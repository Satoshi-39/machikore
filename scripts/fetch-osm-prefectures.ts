/**
 * OSMから都道府県データを取得してJSONファイルに保存するスクリプト
 *
 * 使い方: npx ts-node scripts/fetch-osm-prefectures.ts
 */

const fs = require('fs');
const path = require('path');

interface OSMElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: {
    name?: string;
    'name:en'?: string;
    'name:ja-Hira'?: string;
    place?: string;
    wikidata?: string;
    wikipedia?: string;
    'ISO3166-2'?: string;
  };
}

interface OSMResponse {
  elements: OSMElement[];
}

interface PrefectureData {
  id: string;
  osmId: number;
  name: string;
  nameKana: string | null;
  nameTranslations: { en?: string } | null;
  regionId: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

// 地方とそれに属する都道府県のマッピング
const REGION_MAP: Record<string, string> = {
  '北海道': 'hokkaido',
  '青森県': 'tohoku',
  '岩手県': 'tohoku',
  '宮城県': 'tohoku',
  '秋田県': 'tohoku',
  '山形県': 'tohoku',
  '福島県': 'tohoku',
  '茨城県': 'kanto',
  '栃木県': 'kanto',
  '群馬県': 'kanto',
  '埼玉県': 'kanto',
  '千葉県': 'kanto',
  '東京都': 'kanto',
  '神奈川県': 'kanto',
  '新潟県': 'chubu',
  '富山県': 'chubu',
  '石川県': 'chubu',
  '福井県': 'chubu',
  '山梨県': 'chubu',
  '長野県': 'chubu',
  '岐阜県': 'chubu',
  '静岡県': 'chubu',
  '愛知県': 'chubu',
  '三重県': 'kinki',
  '滋賀県': 'kinki',
  '京都府': 'kinki',
  '大阪府': 'kinki',
  '兵庫県': 'kinki',
  '奈良県': 'kinki',
  '和歌山県': 'kinki',
  '鳥取県': 'chugoku',
  '島根県': 'chugoku',
  '岡山県': 'chugoku',
  '広島県': 'chugoku',
  '山口県': 'chugoku',
  '徳島県': 'shikoku',
  '香川県': 'shikoku',
  '愛媛県': 'shikoku',
  '高知県': 'shikoku',
  '福岡県': 'kyushu',
  '佐賀県': 'kyushu',
  '長崎県': 'kyushu',
  '熊本県': 'kyushu',
  '大分県': 'kyushu',
  '宮崎県': 'kyushu',
  '鹿児島県': 'kyushu',
  '沖縄県': 'okinawa',
};

// 都道府県名からIDを生成するマッピング
const PREFECTURE_ID_MAP: Record<string, string> = {
  '北海道': 'hokkaido',
  '青森県': 'aomori',
  '岩手県': 'iwate',
  '宮城県': 'miyagi',
  '秋田県': 'akita',
  '山形県': 'yamagata',
  '福島県': 'fukushima',
  '茨城県': 'ibaraki',
  '栃木県': 'tochigi',
  '群馬県': 'gunma',
  '埼玉県': 'saitama',
  '千葉県': 'chiba',
  '東京都': 'tokyo',
  '神奈川県': 'kanagawa',
  '新潟県': 'niigata',
  '富山県': 'toyama',
  '石川県': 'ishikawa',
  '福井県': 'fukui',
  '山梨県': 'yamanashi',
  '長野県': 'nagano',
  '岐阜県': 'gifu',
  '静岡県': 'shizuoka',
  '愛知県': 'aichi',
  '三重県': 'mie',
  '滋賀県': 'shiga',
  '京都府': 'kyoto',
  '大阪府': 'osaka',
  '兵庫県': 'hyogo',
  '奈良県': 'nara',
  '和歌山県': 'wakayama',
  '鳥取県': 'tottori',
  '島根県': 'shimane',
  '岡山県': 'okayama',
  '広島県': 'hiroshima',
  '山口県': 'yamaguchi',
  '徳島県': 'tokushima',
  '香川県': 'kagawa',
  '愛媛県': 'ehime',
  '高知県': 'kochi',
  '福岡県': 'fukuoka',
  '佐賀県': 'saga',
  '長崎県': 'nagasaki',
  '熊本県': 'kumamoto',
  '大分県': 'oita',
  '宮崎県': 'miyazaki',
  '鹿児島県': 'kagoshima',
  '沖縄県': 'okinawa',
};

/**
 * Overpass APIから都道府県データを取得
 */
async function fetchPrefecturesFromOSM(): Promise<OSMElement[]> {
  // 日本の都道府県（boundary=administrative + admin_level=4）
  const query = `
    [out:json][timeout:60];
    area["name"="日本"]->.japan;
    (
      relation["boundary"="administrative"]["admin_level"="4"](area.japan);
    );
    out center;
  `;

  const url = 'https://overpass-api.de/api/interpreter';
  console.log('Overpass APIにクエリを送信中...');

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
 * OSMデータをPrefectureData形式に変換
 */
function convertToPrefectureData(elements: OSMElement[]): PrefectureData[] {
  const results: PrefectureData[] = [];
  const seenIds = new Set<string>();

  for (const element of elements) {
    const name = element.tags.name;
    if (!name) continue;

    // 日本の都道府県名かチェック
    const prefectureId = PREFECTURE_ID_MAP[name];
    if (!prefectureId) continue;

    // 重複チェック
    if (seenIds.has(prefectureId)) continue;
    seenIds.add(prefectureId);

    const nameEn = element.tags['name:en'] ?? null;
    const regionId = REGION_MAP[name] ?? 'unknown';

    // 座標を取得（relationの場合はcenter）
    let lat = element.lat;
    let lon = element.lon;

    if (element.center) {
      lat = element.center.lat;
      lon = element.center.lon;
    }

    if (!lat || !lon) {
      console.warn(`⚠️ ${name}の座標が取得できません`);
      continue;
    }

    results.push({
      id: prefectureId,
      osmId: element.id,
      name,
      nameKana: element.tags['name:ja-Hira'] ?? null,
      nameTranslations: nameEn ? { en: nameEn } : null,
      regionId,
      countryCode: 'jp',
      latitude: lat,
      longitude: lon,
    });
  }

  // 都道府県順にソート
  const order = Object.values(PREFECTURE_ID_MAP);
  results.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return results;
}

/**
 * メイン処理
 */
async function main() {
  console.log('OSM都道府県データ取得スクリプト');
  console.log('='.repeat(50));

  try {
    // OSMから取得
    const elements = await fetchPrefecturesFromOSM();
    console.log(`${elements.length}件のOSM要素を取得`);

    // 変換
    const prefectures = convertToPrefectureData(elements);
    console.log(`${prefectures.length}件の都道府県データに変換`);

    // JSONファイルに保存
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'prefectures_data.json');
    const outputData = {
      fetchedAt: new Date().toISOString(),
      prefectures,
    };
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');

    console.log(`\nJSONファイルを保存しました: ${outputPath}`);

    // サンプルを表示
    console.log('\n' + '='.repeat(50));
    console.log('取得した都道府県データ:');
    console.log('='.repeat(50));

    for (const pref of prefectures) {
      console.log(`  - ${pref.id}: ${pref.name} (${pref.nameTranslations?.en ?? 'N/A'}) @ ${pref.latitude.toFixed(4)}, ${pref.longitude.toFixed(4)}`);
    }

    // 不足している都道府県をチェック
    const expectedIds = Object.values(PREFECTURE_ID_MAP);
    const fetchedIds = prefectures.map(p => p.id);
    const missingIds = expectedIds.filter(id => !fetchedIds.includes(id));

    if (missingIds.length > 0) {
      console.log('\n⚠️ 取得できなかった都道府県:');
      for (const id of missingIds) {
        const name = Object.entries(PREFECTURE_ID_MAP).find(([, v]) => v === id)?.[0];
        console.log(`  - ${id} (${name})`);
      }
    }

  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
}

main().catch(console.error);
