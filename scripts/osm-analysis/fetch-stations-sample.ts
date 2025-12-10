/**
 * OSMから駅データのサンプルを取得
 */
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

interface OSMElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OSMResponse {
  elements: OSMElement[];
}

async function fetchStations() {
  // 東京都内の駅データを取得（サンプル20件）
  const query = `
    [out:json][timeout:30];
    area["name"="東京都"]["admin_level"="4"]->.tokyo;
    (
      node["railway"="station"](area.tokyo);
    );
    out body 20;
  `;

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  });

  const data: OSMResponse = await response.json();

  console.log('=== 東京都の駅データサンプル ===\n');

  for (const element of data.elements) {
    const tags = element.tags || {};
    console.log(`【${tags.name || '名称なし'}】`);
    console.log(`  ID: ${element.id}`);
    console.log(`  座標: ${element.lat}, ${element.lon}`);
    console.log(`  タグ:`);
    for (const [key, value] of Object.entries(tags)) {
      console.log(`    ${key}: ${value}`);
    }
    console.log('');
  }
}

fetchStations().catch(console.error);
