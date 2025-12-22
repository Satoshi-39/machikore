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
  '北海道': 'jp_hokkaido',
  '青森県': 'jp_tohoku',
  '岩手県': 'jp_tohoku',
  '宮城県': 'jp_tohoku',
  '秋田県': 'jp_tohoku',
  '山形県': 'jp_tohoku',
  '福島県': 'jp_tohoku',
  '茨城県': 'jp_kanto',
  '栃木県': 'jp_kanto',
  '群馬県': 'jp_kanto',
  '埼玉県': 'jp_kanto',
  '千葉県': 'jp_kanto',
  '東京都': 'jp_kanto',
  '神奈川県': 'jp_kanto',
  '新潟県': 'jp_chubu',
  '富山県': 'jp_chubu',
  '石川県': 'jp_chubu',
  '福井県': 'jp_chubu',
  '山梨県': 'jp_chubu',
  '長野県': 'jp_chubu',
  '岐阜県': 'jp_chubu',
  '静岡県': 'jp_chubu',
  '愛知県': 'jp_chubu',
  '三重県': 'jp_kinki',
  '滋賀県': 'jp_kinki',
  '京都府': 'jp_kinki',
  '大阪府': 'jp_kinki',
  '兵庫県': 'jp_kinki',
  '奈良県': 'jp_kinki',
  '和歌山県': 'jp_kinki',
  '鳥取県': 'jp_chugoku',
  '島根県': 'jp_chugoku',
  '岡山県': 'jp_chugoku',
  '広島県': 'jp_chugoku',
  '山口県': 'jp_chugoku',
  '徳島県': 'jp_shikoku',
  '香川県': 'jp_shikoku',
  '愛媛県': 'jp_shikoku',
  '高知県': 'jp_shikoku',
  '福岡県': 'jp_kyushu',
  '佐賀県': 'jp_kyushu',
  '長崎県': 'jp_kyushu',
  '熊本県': 'jp_kyushu',
  '大分県': 'jp_kyushu',
  '宮崎県': 'jp_kyushu',
  '鹿児島県': 'jp_kyushu',
  '沖縄県': 'jp_okinawa',
};

// 都道府県名からIDを生成するマッピング
const PREFECTURE_ID_MAP: Record<string, string> = {
  '北海道': 'jp_hokkaido',
  '青森県': 'jp_aomori',
  '岩手県': 'jp_iwate',
  '宮城県': 'jp_miyagi',
  '秋田県': 'jp_akita',
  '山形県': 'jp_yamagata',
  '福島県': 'jp_fukushima',
  '茨城県': 'jp_ibaraki',
  '栃木県': 'jp_tochigi',
  '群馬県': 'jp_gunma',
  '埼玉県': 'jp_saitama',
  '千葉県': 'jp_chiba',
  '東京都': 'jp_tokyo',
  '神奈川県': 'jp_kanagawa',
  '新潟県': 'jp_niigata',
  '富山県': 'jp_toyama',
  '石川県': 'jp_ishikawa',
  '福井県': 'jp_fukui',
  '山梨県': 'jp_yamanashi',
  '長野県': 'jp_nagano',
  '岐阜県': 'jp_gifu',
  '静岡県': 'jp_shizuoka',
  '愛知県': 'jp_aichi',
  '三重県': 'jp_mie',
  '滋賀県': 'jp_shiga',
  '京都府': 'jp_kyoto',
  '大阪府': 'jp_osaka',
  '兵庫県': 'jp_hyogo',
  '奈良県': 'jp_nara',
  '和歌山県': 'jp_wakayama',
  '鳥取県': 'jp_tottori',
  '島根県': 'jp_shimane',
  '岡山県': 'jp_okayama',
  '広島県': 'jp_hiroshima',
  '山口県': 'jp_yamaguchi',
  '徳島県': 'jp_tokushima',
  '香川県': 'jp_kagawa',
  '愛媛県': 'jp_ehime',
  '高知県': 'jp_kochi',
  '福岡県': 'jp_fukuoka',
  '佐賀県': 'jp_saga',
  '長崎県': 'jp_nagasaki',
  '熊本県': 'jp_kumamoto',
  '大分県': 'jp_oita',
  '宮崎県': 'jp_miyazaki',
  '鹿児島県': 'jp_kagoshima',
  '沖縄県': 'jp_okinawa',
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
