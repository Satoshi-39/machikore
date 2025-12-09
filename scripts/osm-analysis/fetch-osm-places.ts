/**
 * OSMの place データを種類別に取得して比較するスクリプト
 *
 * 使い方: npx ts-node scripts/osm-analysis/fetch-osm-places.ts
 */

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// 東京都の範囲（バウンディングボックス）
const TOKYO_BBOX = '35.5,139.0,35.9,140.0';

interface OsmPlace {
  id: number;
  name: string;
  nameEn?: string;
  lat: number;
  lon: number;
  placeType: string;
  tags: Record<string, string>;
}

async function fetchOsmPlaces(placeType: string, bbox: string): Promise<OsmPlace[]> {
  const query = `
    [out:json][timeout:60];
    (
      node["place"="${placeType}"](${bbox});
    );
    out body;
  `;

  console.log(`\n📡 Fetching OSM place=${placeType}...`);

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = await response.json();

  return data.elements.map((el: any) => ({
    id: el.id,
    name: el.tags?.name || '(名前なし)',
    nameEn: el.tags?.['name:en'],
    lat: el.lat,
    lon: el.lon,
    placeType,
    tags: el.tags || {},
  }));
}

function printPlaces(places: OsmPlace[], limit: number = 30) {
  console.log(`\n取得件数: ${places.length}件`);
  console.log('─'.repeat(80));
  console.log('名前'.padEnd(20) + '英語名'.padEnd(20) + '緯度'.padEnd(12) + '経度'.padEnd(12) + 'その他タグ');
  console.log('─'.repeat(80));

  places.slice(0, limit).forEach(p => {
    const otherTags = Object.entries(p.tags)
      .filter(([k]) => !['name', 'name:en', 'place'].includes(k))
      .map(([k, v]) => `${k}=${v}`)
      .slice(0, 3)
      .join(', ');

    console.log(
      (p.name || '').slice(0, 18).padEnd(20) +
      (p.nameEn || '').slice(0, 18).padEnd(20) +
      p.lat.toFixed(4).padEnd(12) +
      p.lon.toFixed(4).padEnd(12) +
      otherTags.slice(0, 30)
    );
  });

  if (places.length > limit) {
    console.log(`... 他 ${places.length - limit}件`);
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('OSM Place データ比較（東京都）');
  console.log('='.repeat(80));

  const placeTypes = ['city', 'quarter', 'locality', 'neighbourhood', 'suburb'];

  for (const placeType of placeTypes) {
    try {
      const places = await fetchOsmPlaces(placeType, TOKYO_BBOX);
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📍 place=${placeType}`);
      console.log('='.repeat(80));
      printPlaces(places);

      // 少し待機（API負荷軽減）
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ ${placeType} の取得に失敗:`, error);
    }
  }

  console.log('\n\n📊 完了');
}

main().catch(console.error);
