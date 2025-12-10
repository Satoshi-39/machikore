/**
 * OSMから交通機関データを取得してJSONファイルに保存するスクリプト
 *
 * 取得対象:
 * - 駅（railway=station）
 * - 空港（aeroway=aerodrome）
 * - フェリーターミナル（amenity=ferry_terminal）
 * - バスターミナル（amenity=bus_station）
 *
 * 使い方: npx tsx scripts/fetch-osm-transport-data.ts [prefecture_id]
 * 例: npx tsx scripts/fetch-osm-transport-data.ts tokyo
 */

const fs = require('fs');
const path = require('path');

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// 都道府県マッピング
const PREFECTURES: Record<string, string> = {
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
  // 他の都道府県は必要に応じて追加
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
  rawTags: Record<string, string>;
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
      // より詳細な情報を持つ方を優先（タグ数で判定）
      const existing = results.find(r => `${r.type}_${r.name}` === nameKey);
      if (existing && Object.keys(tags).length <= Object.keys(existing.rawTags).length) {
        continue;
      }
      // 既存のものを削除
      const index = results.findIndex(r => `${r.type}_${r.name}` === nameKey);
      if (index !== -1) {
        results.splice(index, 1);
      }
    }
    seenIds.add(nameKey);

    results.push({
      id,
      osmId: element.id,
      osmType: element.type,
      prefectureId,
      type,
      subtype,
      name,
      nameKana: tags['name:ja-Hira'] || tags['name:ja_kana'] || null,
      nameEn: tags['name:en'] || null,
      operator: tags.operator || null,
      network: tags.network || null,
      ref: tags.ref || tags.iata || tags.icao || null,
      latitude: lat,
      longitude: lon,
      countryCode: 'jp',
      rawTags: tags,
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
  const prefectureId = process.argv[2] || 'tokyo';

  try {
    const transportData = await fetchTransportData(prefectureId);

    // 出力ディレクトリを作成
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // JSONファイルに保存
    const outputPath = path.join(outputDir, `${prefectureId}_transport_data.json`);
    const output = {
      fetchedAt: new Date().toISOString(),
      prefectureId,
      prefectureName: PREFECTURES[prefectureId],
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
