/**
 * 山口市の行政区域データを確認するスクリプト
 */

import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shapefile = require('shapefile');

const DATA_DIR = path.join(__dirname, 'data', 'admin-boundaries');

interface AdminBoundaryProperties {
  N03_001: string; // 都道府県コード
  N03_002: string; // 都道府県名
  N03_003: string | null; // 郡・政令市名
  N03_004: string | null; // 市区町村名
  N03_007: string; // 行政区域コード
}

async function main() {
  // Shapefileを探す
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

  const shpPath = findShp(DATA_DIR);
  if (!shpPath) {
    console.log('Shapefileが見つかりません');
    return;
  }

  console.log('Shapefile: ' + shpPath);

  // Shift_JIS（CP932）で読み込む - 国土数値情報のShapefileは通常Shift_JIS
  const source = await shapefile.open(shpPath, undefined, { encoding: 'shift_jis' });

  const yamaguchiFeatuers: Array<{ props: AdminBoundaryProperties; coordCount: number }> = [];
  let sampleCount = 0;
  const prefCodes = new Set<string>();

  while (true) {
    const result = await source.read();
    if (result.done) break;

    const feature = result.value;
    const props = feature.properties as AdminBoundaryProperties;

    // 最初の5件でデータ構造を確認
    if (sampleCount < 5) {
      console.log('サンプル' + sampleCount + ':', JSON.stringify(props));
      sampleCount++;
    }

    // 都道府県コードを収集
    prefCodes.add(props.N03_001);

    // 山口県のデータを抽出
    if (props.N03_001 === '山口県') {
      // 座標数をカウント（ポリゴンサイズの目安）
      let coordCount = 0;
      const countCoords = (coords: unknown): void => {
        if (Array.isArray(coords)) {
          if (typeof coords[0] === 'number') {
            coordCount++;
          } else {
            coords.forEach(countCoords);
          }
        }
      };
      countCoords(feature.geometry?.coordinates);

      yamaguchiFeatuers.push({ props, coordCount });
    }
  }

  // 都道府県コード一覧を表示
  console.log('\n都道府県コード一覧:', Array.from(prefCodes).sort().join(', '));
  console.log('\n山口県のデータ: ' + yamaguchiFeatuers.length + '件\n');

  // 山口市（行政区域コード35203）のデータを表示
  const yamaguchCity = yamaguchiFeatuers.filter(f => f.props.N03_007 === '35203');
  console.log('=== 山口市（コード35203）: ' + yamaguchCity.length + '件 ===');
  yamaguchCity.forEach(f => {
    const gun = f.props.N03_003 || '';
    const city = f.props.N03_004 || '';
    console.log('  ' + f.props.N03_002 + ' > ' + gun + ' > ' + city + ' (座標点数: ' + f.coordCount + ')');
  });

  // 山口県の全市区町村を一覧
  console.log('\n=== 山口県の全市区町村一覧 ===');
  const uniqueCities = new Map<string, { name: string; prefecture: string; gun: string | null; count: number }>();
  yamaguchiFeatuers.forEach(f => {
    const key = f.props.N03_007;
    if (!uniqueCities.has(key)) {
      uniqueCities.set(key, {
        name: f.props.N03_004 || f.props.N03_003 || '',
        prefecture: f.props.N03_002,
        gun: f.props.N03_003,
        count: 1
      });
    } else {
      const existing = uniqueCities.get(key);
      if (existing) {
        existing.count++;
      }
    }
  });

  // ソートして表示
  Array.from(uniqueCities.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([code, info]) => {
      const gunPrefix = info.gun ? info.gun + ' ' : '';
      console.log('  ' + code + ': ' + gunPrefix + info.name + ' (ポリゴン数: ' + info.count + ')');
    });
}

main().catch(console.error);
