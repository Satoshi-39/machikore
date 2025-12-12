/**
 * e-Stat 国勢調査小地域（町丁・字等）データを確認するスクリプト
 * 山口市の町丁目一覧を表示
 */

import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shapefile = require('shapefile');

const DATA_DIR = path.join(__dirname, 'data', 'estat-boundaries');
const SHP_PATH = path.join(DATA_DIR, 'r2ka35.shp');

interface EstatProperties {
  KEY_CODE: string;      // 統計コード
  PREF: string;          // 都道府県コード
  CITY: string;          // 市区町村コード
  S_AREA: string;        // 小地域コード
  PREF_NAME: string;     // 都道府県名
  CITY_NAME: string;     // 市区町村名
  S_NAME: string;        // 小地域名（町丁・字等名）
  KIGO_E: string;        // 記号（外字）
  HCODE: number;         // 階層コード
  AREA: number;          // 面積
  PERIMETER: number;     // 周囲長
  JINKO: number;         // 人口
  SETAI: number;         // 世帯数
  X_CODE: number;        // X座標（経度）
  Y_CODE: number;        // Y座標（緯度）
  KCODE1: string;        // 都道府県市区町村コード
}

async function main() {
  console.log('=== e-Stat 国勢調査小地域データ（山口県）===\n');
  console.log('Shapefile: ' + SHP_PATH);

  const source = await shapefile.open(SHP_PATH, undefined, { encoding: 'shift_jis' });

  const allFeatures: Array<{ props: EstatProperties; coordCount: number }> = [];
  let sampleCount = 0;

  while (true) {
    const result = await source.read();
    if (result.done) break;

    const feature = result.value;
    const props = feature.properties as EstatProperties;

    // 最初の3件でデータ構造を確認
    if (sampleCount < 3) {
      console.log('\nサンプル' + sampleCount + ':', JSON.stringify(props, null, 2));
      sampleCount++;
    }

    // 座標数をカウント
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

    allFeatures.push({ props, coordCount });
  }

  console.log('\n========================================');
  console.log('山口県全体: ' + allFeatures.length + '件の小地域\n');

  // 山口市（CITY_NAME === '山口市'）のデータを抽出
  const yamaguchiCityFeatures = allFeatures.filter(f => f.props.CITY_NAME === '山口市');
  console.log('=== 山口市の小地域（町丁・字等）: ' + yamaguchiCityFeatures.length + '件 ===\n');

  // 一覧表示（最初の50件）
  yamaguchiCityFeatures.slice(0, 50).forEach((f, i) => {
    const p = f.props;
    console.log((i + 1) + '. ' + p.S_NAME + ' (人口: ' + p.JINKO + ', 世帯: ' + p.SETAI + ', 座標点数: ' + f.coordCount + ')');
  });

  if (yamaguchiCityFeatures.length > 50) {
    console.log('\n... 他 ' + (yamaguchiCityFeatures.length - 50) + '件');
  }

  // 市区町村別の小地域数を集計
  console.log('\n=== 山口県の市区町村別 小地域数 ===');
  const cityStats = new Map<string, number>();
  allFeatures.forEach(f => {
    const cityName = f.props.CITY_NAME;
    cityStats.set(cityName, (cityStats.get(cityName) || 0) + 1);
  });

  Array.from(cityStats.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
      console.log('  ' + city + ': ' + count + '件');
    });
}

main().catch(console.error);
