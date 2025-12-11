/**
 * 国土数値情報から行政区域（市区町村境界）データを取得し、
 * GeoJSON形式に変換してタイル単位に分割するスクリプト
 *
 * 使い方:
 * 1. 国土数値情報から行政区域データ(N03)をダウンロード
 *    https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html
 * 2. Shapefileを解凍して scripts/data/admin-boundaries/ に配置
 * 3. npx ts-node scripts/fetch-admin-boundaries.ts
 *
 * 出力:
 * - scripts/data/admin-boundaries/cities.geojson (市区町村境界)
 * - scripts/data/admin-boundaries/prefectures.geojson (都道府県境界)
 * - scripts/data/admin-boundaries/tiles/ (タイル単位のGeoJSON)
 */

import * as fs from 'fs';
import * as path from 'path';

// Shapefile読み込み用（要インストール: npm install shapefile）
// import * as shapefile from 'shapefile';

// タイルサイズ（度）- 他のデータと同じ0.25度グリッド
const TILE_SIZE = 0.25;

// 入出力ディレクトリ
const DATA_DIR = path.join(__dirname, 'data', 'admin-boundaries');
const OUTPUT_DIR = path.join(DATA_DIR, 'tiles');

interface AdminBoundaryProperties {
  /** 都道府県コード */
  N03_001: string;
  /** 都道府県名 */
  N03_002: string;
  /** 郡・政令都市名 */
  N03_003: string | null;
  /** 市区町村名 */
  N03_004: string | null;
  /** 行政区域コード */
  N03_007: string;
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: AdminBoundaryProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * タイルIDを計算
 */
function getTileId(lng: number, lat: number): string {
  const tileX = Math.floor(lng / TILE_SIZE);
  const tileY = Math.floor(lat / TILE_SIZE);
  return `${tileX}_${tileY}`;
}

/**
 * ポリゴンのバウンディングボックスを取得
 */
function getBoundingBox(coordinates: number[][] | number[][][]): {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
} {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const flatten = (coords: number[] | number[][] | number[][][]): void => {
    if (typeof coords[0] === 'number') {
      // [lng, lat] の配列
      const [lng, lat] = coords as number[];
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    } else {
      // ネストされた配列
      for (const c of coords as (number[] | number[][])[]) {
        flatten(c);
      }
    }
  };

  flatten(coordinates);
  return { minLng, maxLng, minLat, maxLat };
}

/**
 * フィーチャーが影響するタイルIDのリストを取得
 */
function getAffectedTileIds(feature: GeoJSONFeature): string[] {
  const coords = feature.geometry.type === 'Polygon'
    ? feature.geometry.coordinates
    : feature.geometry.coordinates.flat();

  const bbox = getBoundingBox(coords as number[][]);
  const tileIds = new Set<string>();

  // バウンディングボックス内のすべてのタイルを列挙
  for (let lng = Math.floor(bbox.minLng / TILE_SIZE) * TILE_SIZE; lng <= bbox.maxLng; lng += TILE_SIZE) {
    for (let lat = Math.floor(bbox.minLat / TILE_SIZE) * TILE_SIZE; lat <= bbox.maxLat; lat += TILE_SIZE) {
      tileIds.add(getTileId(lng, lat));
    }
  }

  return Array.from(tileIds);
}

/**
 * GeoJSONをタイル単位に分割
 */
function splitIntoTiles(geojson: GeoJSONFeatureCollection): Map<string, GeoJSONFeature[]> {
  const tiles = new Map<string, GeoJSONFeature[]>();

  for (const feature of geojson.features) {
    const tileIds = getAffectedTileIds(feature);

    for (const tileId of tileIds) {
      if (!tiles.has(tileId)) {
        tiles.set(tileId, []);
      }
      tiles.get(tileId)!.push(feature);
    }
  }

  return tiles;
}

/**
 * タイルファイルを出力
 */
function writeTileFiles(tiles: Map<string, GeoJSONFeature[]>): void {
  // 出力ディレクトリを作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalFeatures = 0;
  let totalTiles = 0;

  for (const [tileId, features] of tiles) {
    const geojson: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    const filePath = path.join(OUTPUT_DIR, `${tileId}.geojson`);
    fs.writeFileSync(filePath, JSON.stringify(geojson));

    totalFeatures += features.length;
    totalTiles++;
  }

  console.log(`✅ ${totalTiles}タイル、${totalFeatures}フィーチャーを出力しました`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('=== 行政区域データ処理スクリプト ===\n');

  // GeoJSONファイルの存在確認
  const geojsonPath = path.join(DATA_DIR, 'N03-23_230101.geojson');

  if (!fs.existsSync(geojsonPath)) {
    console.log('❌ GeoJSONファイルが見つかりません。');
    console.log('\n以下の手順でデータを準備してください:\n');
    console.log('1. 国土数値情報から行政区域データをダウンロード:');
    console.log('   https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html');
    console.log('\n2. 全国データのShapefileをダウンロード');
    console.log('\n3. ogr2ogrでGeoJSONに変換:');
    console.log('   ogr2ogr -f GeoJSON N03-23_230101.geojson N03-23_230101.shp');
    console.log('\n4. 変換したファイルを以下に配置:');
    console.log(`   ${geojsonPath}`);
    console.log('\n5. このスクリプトを再実行');
    return;
  }

  console.log('📖 GeoJSONファイルを読み込み中...');
  const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
  const geojson: GeoJSONFeatureCollection = JSON.parse(geojsonContent);
  console.log(`   ${geojson.features.length}件のフィーチャーを読み込みました`);

  console.log('\n🔄 タイル単位に分割中...');
  const tiles = splitIntoTiles(geojson);
  console.log(`   ${tiles.size}タイルに分割しました`);

  console.log('\n💾 タイルファイルを出力中...');
  writeTileFiles(tiles);

  console.log('\n✅ 処理完了！');
  console.log(`\n出力先: ${OUTPUT_DIR}`);
}

main().catch(console.error);
