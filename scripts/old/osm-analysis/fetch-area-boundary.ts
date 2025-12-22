/**
 * OSMから地域の境界データを取得
 * 例: 東十条の範囲
 */
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

async function fetchAreaBoundary() {
  // 「東十条」の境界データを検索
  const query = `
    [out:json][timeout:30];
    (
      // 東十条という名前の行政区画・地域を検索
      relation["name"="東十条"]["boundary"];
      way["name"="東十条"]["boundary"];
      relation["name"="東十条"]["place"];
      node["name"="東十条"]["place"];

      // quarterやneighbourhoodとして登録されているものも検索
      node["name"="東十条"];
      way["name"="東十条"];
      relation["name"="東十条"];
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  });

  const data = await response.json();

  console.log('=== 「東十条」の検索結果 ===\n');
  console.log(`総要素数: ${data.elements.length}\n`);

  // タグを持つ要素のみ表示
  const taggedElements = data.elements.filter((e: any) => e.tags);

  for (const element of taggedElements) {
    const tags = element.tags || {};
    console.log(`【${tags.name || '名称なし'}】 (${element.type} ID: ${element.id})`);
    if (element.lat && element.lon) {
      console.log(`  座標: ${element.lat}, ${element.lon}`);
    }
    if (element.bounds) {
      console.log(`  境界: ${JSON.stringify(element.bounds)}`);
    }
    console.log(`  タグ:`);
    for (const [key, value] of Object.entries(tags)) {
      console.log(`    ${key}: ${value}`);
    }
    console.log('');
  }

  // 境界を持つリレーションがあるかチェック
  const relations = data.elements.filter((e: any) => e.type === 'relation');
  if (relations.length > 0) {
    console.log(`\n=== リレーション(境界データ)が ${relations.length} 件見つかりました ===`);
  } else {
    console.log('\n※ 境界データ（ポリゴン）は見つかりませんでした');
    console.log('※ OSMでは多くの地域がポイントデータのみで、境界線は登録されていない場合があります');
  }
}

fetchAreaBoundary().catch(console.error);
