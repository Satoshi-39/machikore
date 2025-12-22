/**
 * OSMの place データを種類別にCSVファイルとして保存するスクリプト
 *
 * 使い方: npx ts-node scripts/osm-analysis/download-osm-places.ts
 */

const fs = require('fs');
const path = require('path');

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// 東京都の範囲（バウンディングボックス）
const TOKYO_BBOX = '35.5,139.0,35.9,140.0';

// 出力ディレクトリ
const OUTPUT_DIR = path.join(__dirname, 'data');

interface OsmPlace {
  id: number;
  name: string;
  nameEn: string;
  nameKana: string;
  lat: number;
  lon: number;
  placeType: string;
  isIn: string;
  oldName: string;
  allTags: string;
}

async function fetchOsmPlaces(placeType: string, bbox: string): Promise<OsmPlace[]> {
  const query = `
    [out:json][timeout:120];
    (
      node["place"="${placeType}"](${bbox});
    );
    out body;
  `;

  console.log(`📡 Fetching OSM place=${placeType}...`);

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
    name: el.tags?.name || '',
    nameEn: el.tags?.['name:en'] || '',
    nameKana: el.tags?.['name:ja-Hira'] || el.tags?.['name:ja_kana'] || '',
    lat: el.lat,
    lon: el.lon,
    placeType,
    isIn: el.tags?.is_in || '',
    oldName: el.tags?.old_name || '',
    allTags: JSON.stringify(el.tags || {}),
  }));
}

function saveToCsv(places: OsmPlace[], filename: string) {
  const headers = ['id', 'name', 'name_en', 'name_kana', 'lat', 'lon', 'place_type', 'is_in', 'old_name', 'all_tags'];

  const rows = places.map(p => [
    p.id,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${(p.nameEn || '').replace(/"/g, '""')}"`,
    `"${(p.nameKana || '').replace(/"/g, '""')}"`,
    p.lat,
    p.lon,
    p.placeType,
    `"${(p.isIn || '').replace(/"/g, '""')}"`,
    `"${(p.oldName || '').replace(/"/g, '""')}"`,
    `"${(p.allTags || '').replace(/"/g, '""')}"`,
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  // BOM付きUTF-8で保存（Excelで開けるように）
  const bom = '\uFEFF';
  fs.writeFileSync(filename, bom + csv, 'utf-8');

  console.log(`✅ Saved: ${filename} (${places.length}件)`);
}

async function main() {
  // 出力ディレクトリを作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('='.repeat(60));
  console.log('OSM Place データダウンロード（東京都）');
  console.log(`出力先: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));

  const placeTypes = ['city', 'quarter', 'locality', 'neighbourhood'];

  for (const placeType of placeTypes) {
    try {
      const places = await fetchOsmPlaces(placeType, TOKYO_BBOX);
      const filename = path.join(OUTPUT_DIR, `osm_${placeType}_tokyo.csv`);
      saveToCsv(places, filename);

      // API負荷軽減のため待機
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`❌ ${placeType} の取得に失敗:`, error);
    }
  }

  console.log('\n📊 完了！');
  console.log(`CSVファイルは ${OUTPUT_DIR} に保存されました`);
}

main().catch(console.error);
