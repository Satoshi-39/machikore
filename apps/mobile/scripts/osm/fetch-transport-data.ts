/**
 * OSMから交通機関データを取得してJSONファイルに保存するスクリプト
 *
 * 取得対象:
 * - 駅（railway=station）
 * - 空港（aeroway=aerodrome）
 * - フェリーターミナル（amenity=ferry_terminal）
 * - バスターミナル（amenity=bus_station）
 *
 * 使い方: npx tsx scripts/osm/fetch-transport-data.ts [prefecture_id]
 * 例: npx tsx scripts/osm/fetch-transport-data.ts jp_yamaguchi
 *
 * ID形式: {country}_{prefecture}_{type}_{osm_id}
 * 例: jp_tokyo_station_12345678
 */

const fs = require('fs');
const path = require('path');

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// 都道府県マッピング（全47都道府県）- ID形式は jp_{prefecture}
const PREFECTURES: Record<string, string> = {
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

interface OSMElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

interface OSMResponse {
  elements: OSMElement[];
}

interface TransportHubData {
  id: string;
  osm_id: number;
  osm_type: string;
  prefecture_id: string;
  type: 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';
  subtype: string | null;
  name: string;
  name_kana: string;
  name_translations: { en: string } | null;
  operator: string | null;
  network: string | null;
  ref: string | null;
  latitude: number;
  longitude: number;
}

/**
 * 駅のサブタイプを判定
 */
function getStationSubtype(tags: Record<string, string>): string {
  const operator = tags.operator || '';
  const network = tags.network || '';
  const isSubway = tags.station === 'subway' || tags.subway === 'yes';

  // 地下鉄
  if (isSubway) {
    if (operator.includes('東京地下鉄') || operator.includes('Tokyo Metro')) {
      return 'metro';
    }
    if (operator.includes('東京都交通局') || network.includes('都営')) {
      return 'toei';
    }
    return 'subway';
  }

  // JR
  if (
    operator.includes('旅客鉄道') ||
    operator.includes('JR') ||
    network.includes('JR')
  ) {
    return 'jr';
  }

  // 私鉄
  return 'private';
}

/**
 * 空港のサブタイプを判定
 */
function getAirportSubtype(tags: Record<string, string>): string {
  if (tags.aerodrome === 'international' || tags['aerodrome:type'] === 'international') {
    return 'international';
  }
  if (tags.military === 'airfield' || tags.landuse === 'military') {
    return 'military';
  }
  if (tags.aeroway === 'heliport' || tags.name?.includes('ヘリポート')) {
    return 'heliport';
  }
  return 'domestic';
}

/**
 * IDを生成
 */
function generateId(prefectureId: string, type: string, name: string, osmId: number): string {
  // 名前をローマ字風に変換（簡易版）
  const safeName = name
    .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '')
    .trim()
    .substring(0, 30);
  return `${prefectureId}_${type}_${osmId}`;
}

/**
 * OSMから交通機関データを取得
 */
async function fetchTransportData(prefectureId: string): Promise<TransportHubData[]> {
  const prefectureName = PREFECTURES[prefectureId];
  if (!prefectureName) {
    throw new Error(`Unknown prefecture: ${prefectureId}`);
  }

  console.log(`🚃 ${prefectureName}の交通機関データを取得中...`);

  const query = `
    [out:json][timeout:120];
    area["name"="${prefectureName}"]["admin_level"="4"]->.pref;
    (
      // 駅
      node["railway"="station"](area.pref);
      way["railway"="station"](area.pref);
      relation["railway"="station"](area.pref);

      // 空港
      node["aeroway"="aerodrome"](area.pref);
      way["aeroway"="aerodrome"](area.pref);
      relation["aeroway"="aerodrome"](area.pref);

      // フェリーターミナル
      node["amenity"="ferry_terminal"](area.pref);
      way["amenity"="ferry_terminal"](area.pref);

      // バスターミナル
      node["amenity"="bus_station"](area.pref);
      way["amenity"="bus_station"](area.pref);
    );
    out body center;
  `;

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data: OSMResponse = await response.json();
  console.log(`📦 ${data.elements.length}件の要素を取得`);

  const results: TransportHubData[] = [];
  const seenIds = new Set<string>();

  for (const element of data.elements) {
    const tags = element.tags || {};
    const name = tags.name;

    // 名前がないものはスキップ
    if (!name) continue;

    // 座標を取得
    let lat: number | undefined;
    let lon: number | undefined;

    if (element.type === 'node') {
      lat = element.lat;
      lon = element.lon;
    } else if (element.center) {
      lat = element.center.lat;
      lon = element.center.lon;
    }

    if (!lat || !lon) continue;

    // タイプを判定
    let type: TransportHubData['type'];
    let subtype: string | null = null;

    if (tags.railway === 'station') {
      type = 'station';
      subtype = getStationSubtype(tags);
    } else if (tags.aeroway === 'aerodrome') {
      type = 'airport';
      subtype = getAirportSubtype(tags);
    } else if (tags.amenity === 'ferry_terminal') {
      type = 'ferry_terminal';
    } else if (tags.amenity === 'bus_station') {
      type = 'bus_terminal';
    } else {
      continue;
    }

    const id = generateId(prefectureId, type, name, element.id);

    // 重複チェック（同じ駅が複数のノード/ウェイで登録されている場合）
    const nameKey = `${type}_${name}`;
    if (seenIds.has(nameKey)) {
      // 既存の重複は最初に見つかったものを優先（単純にスキップ）
      continue;
    }
    seenIds.add(nameKey);

    const nameEn = tags['name:en'] || null;

    results.push({
      id,
      osm_id: element.id,
      osm_type: element.type,
      prefecture_id: prefectureId,
      type,
      subtype,
      name,
      name_kana: tags['name:ja-Hira'] || tags['name:ja_kana'] || '',
      name_translations: nameEn ? { en: nameEn } : null,
      operator: tags.operator || null,
      network: tags.network || null,
      ref: tags.ref || tags.iata || tags.icao || null,
      latitude: lat,
      longitude: lon,
    });
  }

  // タイプ別に集計
  const stats = {
    station: results.filter(r => r.type === 'station').length,
    airport: results.filter(r => r.type === 'airport').length,
    ferry_terminal: results.filter(r => r.type === 'ferry_terminal').length,
    bus_terminal: results.filter(r => r.type === 'bus_terminal').length,
  };

  console.log(`\n📊 集計結果:`);
  console.log(`  駅: ${stats.station}件`);
  console.log(`  空港: ${stats.airport}件`);
  console.log(`  フェリーターミナル: ${stats.ferry_terminal}件`);
  console.log(`  バスターミナル: ${stats.bus_terminal}件`);
  console.log(`  合計: ${results.length}件`);

  return results;
}

/**
 * メイン処理
 */
async function main() {
  const prefectureId = process.argv[2] || 'jp_yamaguchi';

  try {
    const transportData = await fetchTransportData(prefectureId);

    // 出力ディレクトリを作成（data/transport フォルダに保存）
    const outputDir = path.join(__dirname, '../data', 'transport');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSONファイルに保存
    const outputPath = path.join(outputDir, `${prefectureId}_transport_data.json`);
    const output = {
      fetchedAt: new Date().toISOString(),
      prefecture_id: prefectureId,
      prefecture_name: PREFECTURES[prefectureId],
      stats: {
        station: transportData.filter(r => r.type === 'station').length,
        airport: transportData.filter(r => r.type === 'airport').length,
        ferry_terminal: transportData.filter(r => r.type === 'ferry_terminal').length,
        bus_terminal: transportData.filter(r => r.type === 'bus_terminal').length,
        total: transportData.length,
      },
      data: transportData,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✅ 保存完了: ${outputPath}`);

    // サブタイプ別の集計も表示
    console.log(`\n📊 駅のサブタイプ別集計:`);
    const stationSubtypes = transportData
      .filter(r => r.type === 'station')
      .reduce((acc, r) => {
        const key = r.subtype || 'unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    for (const [subtype, count] of Object.entries(stationSubtypes)) {
      console.log(`  ${subtype}: ${count}件`);
    }

  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

main();
