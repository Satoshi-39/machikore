/**
 * 国土数値情報から行政区域データを取得し、
 * PostGIS形式のマイグレーションを生成するスクリプト
 *
 * 使い方:
 * 1. 国土数値情報から行政区域データ(N03)をダウンロード
 *    https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html
 * 2. Shapefileを解凍して scripts/data/admin-boundaries/ に配置
 * 3. npx tsx scripts/generate-admin-boundaries-postgis.ts
 *
 * 出力:
 * - supabase/migrations/082_seed_admin_boundaries_postgis_*.sql
 */

import * as fs from 'fs';
import * as path from 'path';
import simplify from '@turf/simplify';
import { polygon, multiPolygon } from '@turf/helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shapefile = require('shapefile');

// ポリゴン簡略化の許容誤差（度）
// 0.0001度 ≒ 約10m（日本の緯度では）
const SIMPLIFY_TOLERANCE = 0.0001;

// 入出力ディレクトリ
const DATA_DIR = path.join(__dirname, 'data', 'admin-boundaries');
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

interface ProcessedFeature {
  code: string;
  name: string;
  prefecture: string;
  pref_code: string;
  geometry: GeoJSONFeature['geometry'];
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

/**
 * GeoJSONをWKT（Well-Known Text）形式に変換
 * PostGISで直接使える形式
 */
function geometryToWKT(geometry: GeoJSONFeature['geometry']): string {
  if (geometry.type === 'Polygon') {
    const rings = (geometry.coordinates as number[][][]).map(ring => {
      const points = ring.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
      return `(${points})`;
    });
    return `MULTIPOLYGON((${rings.join(', ')}))`;
  } else {
    // MultiPolygon
    const polygons = (geometry.coordinates as number[][][][]).map(polygon => {
      const rings = polygon.map(ring => {
        const points = ring.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
        return `(${points})`;
      });
      return `(${rings.join(', ')})`;
    });
    return `MULTIPOLYGON(${polygons.join(', ')})`;
  }
}

function processFeature(feature: GeoJSONFeature): ProcessedFeature {
  const props = feature.properties;

  // 市区町村名を構築
  let name = props.N03_004 || props.N03_003 || props.N03_002 || '';

  // ポリゴンを簡略化して座標を丸める
  const simplifiedGeometry = simplifyGeometry(feature.geometry);
  const roundedGeometry = roundCoordinates(simplifiedGeometry);

  return {
    code: props.N03_007,
    name,
    prefecture: props.N03_001,
    pref_code: props.N03_007?.substring(0, 2) || '',
    geometry: roundedGeometry,
  };
}

/**
 * 同じ行政区域コードを持つフィーチャーをマージ
 * （飛び地などで複数のポリゴンを持つ場合があるため）
 */
function mergeFeaturesByCode(features: ProcessedFeature[]): Map<string, ProcessedFeature> {
  const merged = new Map<string, ProcessedFeature>();

  for (const feature of features) {
    if (!feature.code) continue;

    const existing = merged.get(feature.code);
    if (!existing) {
      // MultiPolygonに変換
      if (feature.geometry.type === 'Polygon') {
        feature.geometry = {
          type: 'MultiPolygon',
          coordinates: [feature.geometry.coordinates as number[][][]],
        };
      }
      merged.set(feature.code, feature);
    } else {
      // 既存のMultiPolygonにポリゴンを追加
      const existingCoords = existing.geometry.coordinates as number[][][][];
      if (feature.geometry.type === 'Polygon') {
        existingCoords.push(feature.geometry.coordinates as number[][][]);
      } else {
        existingCoords.push(...(feature.geometry.coordinates as number[][][][]));
      }
    }
  }

  return merged;
}

/**
 * マイグレーションファイルを生成
 */
function generateMigrations(features: Map<string, ProcessedFeature>): void {
  const allFeatures = Array.from(features.values());
  const FEATURES_PER_FILE = 100; // 1ファイルあたり100件

  // 既存のマイグレーション番号を取得
  const existingMigrations = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  const maxNum = existingMigrations.reduce((max, f) => {
    const match = f.match(/^(\d+)_/);
    return match && match[1] ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

  let fileIndex = 1;
  const baseNum = 57; // 056でスキーマ作成済み

  for (let i = 0; i < allFeatures.length; i += FEATURES_PER_FILE) {
    const batch = allFeatures.slice(i, i + FEATURES_PER_FILE);
    const migrationNum = String(baseNum + fileIndex - 1).padStart(3, '0');
    const migrationPath = path.join(
      MIGRATIONS_DIR,
      `${migrationNum}_seed_admin_boundaries_postgis_${String(fileIndex).padStart(2, '0')}.sql`
    );

    let sql = `-- 行政区域ポリゴンデータ (PostGIS形式, バッチ ${fileIndex})\n\n`;

    for (const feature of batch) {
      const wkt = geometryToWKT(feature.geometry);
      const escapedName = feature.name.replace(/'/g, "''");
      const escapedPrefecture = feature.prefecture.replace(/'/g, "''");

      sql += `INSERT INTO admin_boundaries (code, name, prefecture, pref_code, geom)\n`;
      sql += `VALUES ('${feature.code}', '${escapedName}', '${escapedPrefecture}', '${feature.pref_code}', `;
      sql += `ST_GeomFromText('${wkt}', 4326))\n`;
      sql += `ON CONFLICT (code) DO UPDATE SET\n`;
      sql += `  name = EXCLUDED.name,\n`;
      sql += `  prefecture = EXCLUDED.prefecture,\n`;
      sql += `  pref_code = EXCLUDED.pref_code,\n`;
      sql += `  geom = EXCLUDED.geom;\n\n`;
    }

    fs.writeFileSync(migrationPath, sql);
    console.log(`✅ ${migrationPath} (${batch.length}件)`);
    fileIndex++;
  }

  console.log(`\n合計 ${fileIndex - 1} ファイル、${allFeatures.length}件の行政区域を出力しました`);
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
  console.log('=== 行政区域データ処理スクリプト（PostGIS版） ===\n');

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
    console.log('\n   npx tsx scripts/generate-admin-boundaries-postgis.ts');
    return;
  }

  console.log(`📖 Shapefileを読み込み中: ${shpPath}`);
  const features = await loadShapefile(shpPath);
  console.log(`   ${features.length}件のフィーチャーを読み込みました`);

  console.log('\n🔄 フィーチャーを処理中（ポリゴン簡略化あり）...');
  console.log(`   簡略化許容誤差: ${SIMPLIFY_TOLERANCE}度 (約${Math.round(SIMPLIFY_TOLERANCE * 111000)}m)`);

  const processedFeatures = features.map(processFeature);
  console.log(`   ${processedFeatures.length}件を処理しました`);

  console.log('\n🔗 同一行政区域コードをマージ中...');
  const mergedFeatures = mergeFeaturesByCode(processedFeatures);
  console.log(`   ${mergedFeatures.size}件の行政区域にマージしました`);

  console.log('\n📝 Supabaseマイグレーションを生成中...');
  generateMigrations(mergedFeatures);

  console.log('\n✅ 処理完了！');
  console.log('\n次のステップ:');
  console.log('1. 生成されたマイグレーションを確認');
  console.log('2. Supabaseに手動で適用');
}

main().catch(console.error);
