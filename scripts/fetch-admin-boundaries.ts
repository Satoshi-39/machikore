/**
 * 国土数値情報から行政区域（市区町村境界）データを取得し、
 * タイル単位に分割してSupabaseマイグレーションを生成するスクリプト
 *
 * 使い方:
 * 1. 国土数値情報から行政区域データ(N03)をダウンロード
 *    https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html
 * 2. Shapefileを解凍して scripts/data/admin-boundaries/ に配置
 * 3. npx tsx scripts/fetch-admin-boundaries.ts
 *
 * 出力:
 * - scripts/data/admin-boundaries/tiles/ (タイル単位のJSON)
 * - supabase/migrations/XXX_add_admin_boundaries_*.sql (Supabaseマイグレーション)
 */

import * as fs from 'fs';
import * as path from 'path';
import simplify from '@turf/simplify';
import { polygon, multiPolygon } from '@turf/helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shapefile = require('shapefile');

// タイルサイズ（度）- 他のデータと同じ0.25度グリッド
const TILE_SIZE = 0.25;

// ポリゴン簡略化の許容誤差（度）
// 0.0001度 ≒ 約10m（日本の緯度では）
const SIMPLIFY_TOLERANCE = 0.0001;

// 入出力ディレクトリ
const DATA_DIR = path.join(__dirname, 'data', 'admin-boundaries');
const OUTPUT_DIR = path.join(DATA_DIR, 'tiles');
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

interface AdminBoundaryProperties {
  N03_001: string;       // 都道府県名（北海道、山口県など）
  N03_002: string;       // 振興局/郡名（石狩振興局など）※北海道以外はnullの場合あり
  N03_003: string | null; // 市名（札幌市など）
  N03_004: string | null; // 区/町村名（中央区、山口市など）
  N03_007: string;       // 行政区域コード（5桁）
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: AdminBoundaryProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface SimplifiedFeature {
  code: string;
  name: string;
  prefecture: string;
  pref_code: string;
  geometry: GeoJSONFeature['geometry'];
}

function getTileId(lng: number, lat: number): string {
  const tileX = Math.floor(lng / TILE_SIZE);
  const tileY = Math.floor(lat / TILE_SIZE);
  return `${tileX}_${tileY}`;
}

function getBoundingBox(coordinates: number[][] | number[][][] | number[][][][]): {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
} {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const flatten = (coords: number[] | number[][] | number[][][] | number[][][][]): void => {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords as [number, number];
      if (lng !== undefined && lat !== undefined) {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    } else {
      for (const c of coords as (number[] | number[][] | number[][][])[]) {
        flatten(c);
      }
    }
  };

  flatten(coordinates);
  return { minLng, maxLng, minLat, maxLat };
}

function getAffectedTileIds(feature: GeoJSONFeature): string[] {
  const coords = feature.geometry.coordinates;
  const bbox = getBoundingBox(coords);
  const tileIds = new Set<string>();

  for (let lng = Math.floor(bbox.minLng / TILE_SIZE) * TILE_SIZE; lng <= bbox.maxLng; lng += TILE_SIZE) {
    for (let lat = Math.floor(bbox.minLat / TILE_SIZE) * TILE_SIZE; lat <= bbox.maxLat; lat += TILE_SIZE) {
      tileIds.add(getTileId(lng, lat));
    }
  }

  return Array.from(tileIds);
}

/**
 * ポリゴンを簡略化してデータ量を削減
 */
function simplifyGeometry(geometry: GeoJSONFeature['geometry']): GeoJSONFeature['geometry'] {
  try {
    let feature;
    if (geometry.type === 'Polygon') {
      feature = polygon(geometry.coordinates as number[][][]);
    } else {
      feature = multiPolygon(geometry.coordinates as number[][][][]);
    }

    const simplified = simplify(feature, {
      tolerance: SIMPLIFY_TOLERANCE,
      highQuality: true,
    });

    return simplified.geometry as GeoJSONFeature['geometry'];
  } catch {
    // 簡略化に失敗した場合は元のジオメトリを返す
    return geometry;
  }
}

/**
 * 座標の小数点を丸める（データ量削減）
 */
function roundCoordinates(geometry: GeoJSONFeature['geometry']): GeoJSONFeature['geometry'] {
  const round = (coords: number[] | number[][] | number[][][] | number[][][][]): number[] | number[][] | number[][][] | number[][][][] => {
    if (typeof coords[0] === 'number') {
      return (coords as number[]).map(c => Math.round(c * 100000) / 100000);
    }
    return (coords as (number[] | number[][] | number[][][])[]).map(c => round(c)) as number[][] | number[][][] | number[][][][];
  };

  return {
    type: geometry.type,
    coordinates: round(geometry.coordinates) as number[][][] | number[][][][],
  };
}

function simplifyFeature(feature: GeoJSONFeature): SimplifiedFeature {
  const props = feature.properties;

  // 市区町村名を構築
  // N03_004があればそれを使用（札幌市中央区、山口市など）
  // なければN03_003（札幌市など）
  // どちらもなければN03_002
  let name = props.N03_004 || props.N03_003 || props.N03_002 || '';

  // ポリゴンを簡略化して座標を丸める
  const simplifiedGeometry = simplifyGeometry(feature.geometry);
  const roundedGeometry = roundCoordinates(simplifiedGeometry);

  return {
    code: props.N03_007,
    name,
    prefecture: props.N03_001, // 都道府県名
    pref_code: props.N03_007?.substring(0, 2) || '', // コードから都道府県コードを抽出
    geometry: roundedGeometry,
  };
}

function splitIntoTiles(features: GeoJSONFeature[]): Map<string, SimplifiedFeature[]> {
  const tiles = new Map<string, SimplifiedFeature[]>();

  for (const feature of features) {
    const tileIds = getAffectedTileIds(feature);
    const simplified = simplifyFeature(feature);

    for (const tileId of tileIds) {
      if (!tiles.has(tileId)) {
        tiles.set(tileId, []);
      }
      tiles.get(tileId)!.push(simplified);
    }
  }

  return tiles;
}

function writeTileFiles(tiles: Map<string, SimplifiedFeature[]>): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  } else {
    // 既存ファイルを削除
    const existingFiles = fs.readdirSync(OUTPUT_DIR);
    for (const file of existingFiles) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }

  let totalFeatures = 0;
  let totalTiles = 0;

  for (const [tileId, features] of tiles) {
    const filePath = path.join(OUTPUT_DIR, `${tileId}.json`);
    fs.writeFileSync(filePath, JSON.stringify({ tile_id: tileId, features }));

    totalFeatures += features.length;
    totalTiles++;
  }

  console.log(`✅ ${totalTiles}タイル、${totalFeatures}フィーチャーを出力しました`);
}

/**
 * Supabaseマイグレーションを複数ファイルに分割して生成
 */
function generateMigrations(tiles: Map<string, SimplifiedFeature[]>): void {
  const existingMigrations = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  const maxNum = existingMigrations.reduce((max, f) => {
    const match = f.match(/^(\d+)_/);
    return match && match[1] ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

  const baseNum = maxNum + 1;

  // テーブル作成用のマイグレーション
  const schemaMigrationPath = path.join(MIGRATIONS_DIR, `${String(baseNum).padStart(3, '0')}_add_admin_boundaries_schema.sql`);
  const schemaSql = `-- 行政区域ポリゴンデータ（タイル単位）
-- 国土数値情報 N03（行政区域）から生成

-- admin_boundary_tiles テーブル
CREATE TABLE IF NOT EXISTS admin_boundary_tiles (
  tile_id TEXT PRIMARY KEY,
  features JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_admin_boundary_tiles_tile_id ON admin_boundary_tiles(tile_id);

-- 読み取り権限（匿名ユーザーも読める）
ALTER TABLE admin_boundary_tiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_boundary_tiles_read" ON admin_boundary_tiles;
CREATE POLICY "admin_boundary_tiles_read" ON admin_boundary_tiles FOR SELECT USING (true);
`;
  fs.writeFileSync(schemaMigrationPath, schemaSql);
  console.log(`✅ スキーママイグレーション: ${schemaMigrationPath}`);

  // データ挿入用のマイグレーション（バッチ単位で分割）
  // 都道府県コード別だとファイル名に日本語が入る可能性があるので、単純にバッチで分割
  const allTileEntries = Array.from(tiles.entries());
  const TILES_PER_FILE = 50; // 1ファイルあたり50タイル
  let fileIndex = 1;

  for (let i = 0; i < allTileEntries.length; i += TILES_PER_FILE) {
    const batchTiles = allTileEntries.slice(i, i + TILES_PER_FILE);
    const migrationNum = String(baseNum + fileIndex).padStart(3, '0');
    const migrationPath = path.join(MIGRATIONS_DIR, `${migrationNum}_add_admin_boundaries_data_${String(fileIndex).padStart(2, '0')}.sql`);

    let sql = `-- 行政区域データ (バッチ ${fileIndex})\n\n`;

    const BATCH_SIZE = 20;
    for (let j = 0; j < batchTiles.length; j += BATCH_SIZE) {
      const batch = batchTiles.slice(j, j + BATCH_SIZE);

      sql += `INSERT INTO admin_boundary_tiles (tile_id, features) VALUES\n`;

      const values = batch.map(([tileId, features]) => {
        const featuresJson = JSON.stringify(features).replace(/'/g, "''");
        return `  ('${tileId}', '${featuresJson}'::jsonb)`;
      });

      sql += values.join(',\n');
      sql += `\nON CONFLICT (tile_id) DO UPDATE SET features = EXCLUDED.features;\n\n`;
    }

    fs.writeFileSync(migrationPath, sql);
    console.log(`✅ データマイグレーション: ${migrationPath} (${batchTiles.length}タイル)`);
    fileIndex++;
  }

  console.log(`   合計 ${fileIndex - 1} ファイルを生成しました`);
}

async function loadShapefile(shpPath: string): Promise<GeoJSONFeature[]> {
  const features: GeoJSONFeature[] = [];

  const source = await shapefile.open(shpPath, undefined, { encoding: 'shift_jis' });

  while (true) {
    const result = await source.read();
    if (result.done) break;

    const feature = result.value as GeoJSONFeature;
    if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
      features.push(feature);
    }
  }

  return features;
}

async function main() {
  console.log('=== 行政区域データ処理スクリプト ===\n');

  let shpPath: string | null = null;

  if (fs.existsSync(DATA_DIR)) {
    const findShp = (dir: string): string | null => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const found = findShp(fullPath);
          if (found) return found;
        } else if (entry.name.endsWith('.shp') && entry.name.startsWith('N03')) {
          return fullPath;
        }
      }
      return null;
    };
    shpPath = findShp(DATA_DIR);
  }

  if (!shpPath) {
    console.log('❌ Shapefileが見つかりません。');
    console.log('\n以下の手順でデータを準備してください:\n');
    console.log('1. 国土数値情報から行政区域データをダウンロード:');
    console.log('   https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html');
    console.log('\n2. 「全国」の最新データ(Shapefile形式)をダウンロード');
    console.log('\n3. 解凍してShapefileを以下に配置:');
    console.log(`   ${DATA_DIR}/`);
    console.log('\n4. このスクリプトを再実行');
    console.log('\n   npx tsx scripts/fetch-admin-boundaries.ts');
    return;
  }

  console.log(`📖 Shapefileを読み込み中: ${shpPath}`);
  const features = await loadShapefile(shpPath);
  console.log(`   ${features.length}件のフィーチャーを読み込みました`);

  console.log('\n🔄 タイル単位に分割中（ポリゴン簡略化あり）...');
  console.log(`   簡略化許容誤差: ${SIMPLIFY_TOLERANCE}度 (約${Math.round(SIMPLIFY_TOLERANCE * 111000)}m)`);
  const tiles = splitIntoTiles(features);
  console.log(`   ${tiles.size}タイルに分割しました`);

  console.log('\n💾 タイルファイルを出力中...');
  writeTileFiles(tiles);

  console.log('\n📝 Supabaseマイグレーションを生成中...');
  generateMigrations(tiles);

  // ファイルサイズを確認
  const totalSize = fs.readdirSync(OUTPUT_DIR).reduce((sum, file) => {
    return sum + fs.statSync(path.join(OUTPUT_DIR, file)).size;
  }, 0);
  console.log(`\n📊 合計データサイズ: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n✅ 処理完了！');
  console.log(`\n次のステップ:`);
  console.log('1. 生成されたマイグレーションを確認');
  console.log('2. npx supabase db push でSupabaseに適用');
}

main().catch(console.error);
