/**
 * 政令指定都市の「区」のマッピングを生成
 *
 * 使い方: npx tsx scripts/supabase/generate-ward-mapping.ts
 *
 * オプション:
 *   --fetch-coords  Nominatim APIから座標を取得（時間がかかる）
 *
 * 出力:
 *   - scripts/data/ward-code-mapping.json（区のコードマッピング）
 *   - scripts/data/ward-coordinates.json（区の座標データ）
 *   - scripts/sql/insert-cities-wards.sql（citiesテーブルへのINSERT文）
 */

import * as fs from 'fs';
import * as path from 'path';

// 都道府県コード → 都道府県ID
const PREFECTURE_CODE_TO_ID: Record<string, string> = {
  '01': 'jp_hokkaido',
  '04': 'jp_miyagi',
  '11': 'jp_saitama',
  '12': 'jp_chiba',
  '13': 'jp_tokyo',
  '14': 'jp_kanagawa',
  '15': 'jp_niigata',
  '22': 'jp_shizuoka',
  '23': 'jp_aichi',
  '26': 'jp_kyoto',
  '27': 'jp_osaka',
  '28': 'jp_hyogo',
  '33': 'jp_okayama',
  '34': 'jp_hiroshima',
  '40': 'jp_fukuoka',
  '43': 'jp_kumamoto',
};

// 政令指定都市の市コード → 市ID
const CITY_CODE_TO_ID: Record<string, string> = {
  // 札幌市 (0110x)
  '0110': 'jp_hokkaido_sapporo',
  // 仙台市 (0410x)
  '0410': 'jp_miyagi_sendai',
  // さいたま市 (1110x)
  '1110': 'jp_saitama_saitama',
  // 千葉市 (1210x)
  '1210': 'jp_chiba_chiba',
  // 東京23区 (1310x-1312x) - 特別区は市ではなく区
  // 横浜市 (1410x-1411x)
  '1410': 'jp_kanagawa_yokohama',
  '1411': 'jp_kanagawa_yokohama',
  // 川崎市 (1413x)
  '1413': 'jp_kanagawa_kawasaki',
  // 相模原市 (1415x)
  '1415': 'jp_kanagawa_sagamihara',
  // 新潟市 (1510x)
  '1510': 'jp_niigata_niigata',
  // 静岡市 (2210x)
  '2210': 'jp_shizuoka_shizuoka',
  // 浜松市 (2213x)
  '2213': 'jp_shizuoka_hamamatsu',
  // 名古屋市 (2310x-2311x)
  '2310': 'jp_aichi_nagoya',
  '2311': 'jp_aichi_nagoya',
  // 京都市 (2610x-2611x)
  '2610': 'jp_kyoto_kyoto',
  '2611': 'jp_kyoto_kyoto',
  // 大阪市 (2710x-2712x)
  '2710': 'jp_osaka_osaka',
  '2711': 'jp_osaka_osaka',
  '2712': 'jp_osaka_osaka',
  // 堺市 (2714x)
  '2714': 'jp_osaka_sakai',
  // 神戸市 (2810x-2811x)
  '2810': 'jp_hyogo_kobe',
  '2811': 'jp_hyogo_kobe',
  // 岡山市 (3310x)
  '3310': 'jp_okayama_okayama',
  // 広島市 (3410x)
  '3410': 'jp_hiroshima_hiroshima',
  // 北九州市 (4010x)
  '4010': 'jp_fukuoka_kitakyushu',
  // 福岡市 (4013x)
  '4013': 'jp_fukuoka_fukuoka',
  // 熊本市 (4310x)
  '4310': 'jp_kumamoto_kumamoto',
};

// 区名からスラッグを生成するためのマッピング
const WARD_NAME_TO_SLUG: Record<string, string> = {
  // 札幌市
  '中央区': 'chuo',
  '北区': 'kita',
  '東区': 'higashi',
  '白石区': 'shiroishi',
  '豊平区': 'toyohira',
  '南区': 'minami',
  '西区': 'nishi',
  '厚別区': 'atsubetsu',
  '手稲区': 'teine',
  '清田区': 'kiyota',
  // 仙台市
  '青葉区': 'aoba',
  '宮城野区': 'miyagino',
  '若林区': 'wakabayashi',
  '太白区': 'taihaku',
  '泉区': 'izumi',
  // さいたま市
  '大宮区': 'omiya',
  '見沼区': 'minuma',
  '桜区': 'sakura',
  '浦和区': 'urawa',
  '緑区': 'midori',
  '岩槻区': 'iwatsuki',
  // 千葉市
  '花見川区': 'hanamigawa',
  '稲毛区': 'inage',
  '若葉区': 'wakaba',
  '美浜区': 'mihama',
  // 東京23区
  '千代田区': 'chiyoda',
  '港区': 'minato',
  '新宿区': 'shinjuku',
  '文京区': 'bunkyo',
  '台東区': 'taito',
  '墨田区': 'sumida',
  '江東区': 'koto',
  '品川区': 'shinagawa',
  '目黒区': 'meguro',
  '大田区': 'ota',
  '世田谷区': 'setagaya',
  '渋谷区': 'shibuya',
  '中野区': 'nakano',
  '杉並区': 'suginami',
  '豊島区': 'toshima',
  '荒川区': 'arakawa',
  '板橋区': 'itabashi',
  '練馬区': 'nerima',
  '足立区': 'adachi',
  '葛飾区': 'katsushika',
  '江戸川区': 'edogawa',
  // 横浜市
  '鶴見区': 'tsurumi',
  '神奈川区': 'kanagawa',
  '中区': 'naka',
  '保土ケ谷区': 'hodogaya',
  '磯子区': 'isogo',
  '金沢区': 'kanazawa',
  '港北区': 'kohoku',
  '戸塚区': 'totsuka',
  '港南区': 'konan',
  '旭区': 'asahi',
  '瀬谷区': 'seya',
  '栄区': 'sakae',
  '都筑区': 'tsuzuki',
  // 川崎市
  '川崎区': 'kawasaki',
  '幸区': 'saiwai',
  '中原区': 'nakahara',
  '高津区': 'takatsu',
  '多摩区': 'tama',
  '宮前区': 'miyamae',
  '麻生区': 'asao',
  // 新潟市
  '江南区': 'konan',
  '秋葉区': 'akiha',
  '西蒲区': 'nishikan',
  // 静岡市
  '葵区': 'aoi',
  '駿河区': 'suruga',
  '清水区': 'shimizu',
  // 浜松市
  '浜北区': 'hamakita',
  '天竜区': 'tenryu',
  // 名古屋市
  '千種区': 'chikusa',
  '中村区': 'nakamura',
  '昭和区': 'showa',
  '瑞穂区': 'mizuho',
  '熱田区': 'atsuta',
  '中川区': 'nakagawa',
  '守山区': 'moriyama',
  '名東区': 'meito',
  '天白区': 'tempaku',
  // 京都市
  '上京区': 'kamigyo',
  '左京区': 'sakyo',
  '中京区': 'nakagyo',
  '東山区': 'higashiyama',
  '下京区': 'shimogyo',
  '右京区': 'ukyo',
  '伏見区': 'fushimi',
  '山科区': 'yamashina',
  '西京区': 'nishikyo',
  // 大阪市
  '都島区': 'miyakojima',
  '福島区': 'fukushima',
  '此花区': 'konohana',
  '大正区': 'taisho',
  '天王寺区': 'tennoji',
  '浪速区': 'naniwa',
  '西淀川区': 'nishiyodogawa',
  '東淀川区': 'higashiyodogawa',
  '東成区': 'higashinari',
  '生野区': 'ikuno',
  '城東区': 'joto',
  '阿倍野区': 'abeno',
  '住吉区': 'sumiyoshi',
  '東住吉区': 'higashisumiyoshi',
  '西成区': 'nishinari',
  '淀川区': 'yodogawa',
  '住之江区': 'suminoe',
  '平野区': 'hirano',
  // 堺市
  '堺区': 'sakai',
  '美原区': 'mihara',
  // 神戸市
  '東灘区': 'higashinada',
  '灘区': 'nada',
  '兵庫区': 'hyogo',
  '長田区': 'nagata',
  '須磨区': 'suma',
  '垂水区': 'tarumi',
  // 広島市
  '安佐南区': 'asaminami',
  '安佐北区': 'asakita',
  '安芸区': 'aki',
  '佐伯区': 'saeki',
  // 北九州市
  '門司区': 'moji',
  '若松区': 'wakamatsu',
  '戸畑区': 'tobata',
  '小倉北区': 'kokura_kita',
  '小倉南区': 'kokura_minami',
  '八幡東区': 'yahata_higashi',
  '八幡西区': 'yahata_nishi',
  // 福岡市
  '博多区': 'hakata',
  '城南区': 'jonan',
  '早良区': 'sawara',
};

interface WardEntry {
  code: string;
  name: string;
  wardName: string;
  prefectureId: string;
  cityId: string;
  wardId: string;
}

/**
 * シードファイルから区のデータを抽出
 */
function extractWardsFromSeedFiles(): WardEntry[] {
  const wards: WardEntry[] = [];
  const seedDir = path.join(__dirname, '../data/admin_boundaries_old');
  const files = fs.readdirSync(seedDir).filter(f => f.match(/^\d{3}_seed_admin_boundaries_postgis_\d+\.sql$/));

  for (const file of files) {
    const content = fs.readFileSync(path.join(seedDir, file), 'utf-8');
    // VALUES ('01101', '札幌市中央区', ... のパターンを抽出
    const regex = /VALUES\s*\('(\d{5})',\s*'([^']+区)'/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const code = match[1];
      const fullName = match[2];
      const prefCode = code.substring(0, 2);
      const cityCode = code.substring(0, 4);

      const prefectureId = PREFECTURE_CODE_TO_ID[prefCode];
      if (!prefectureId) continue;

      // 東京23区は特別区（市ではない）
      const isTokyo23 = prefCode === '13' && code >= '13101' && code <= '13123';

      let cityId: string;
      let wardName: string;
      let wardId: string;

      if (isTokyo23) {
        // 東京23区: 区名がそのまま
        cityId = 'jp_tokyo_tokyo'; // 東京都として扱う
        wardName = fullName;
        const slug = WARD_NAME_TO_SLUG[wardName];
        if (!slug) {
          console.warn(`スラッグが見つかりません: ${wardName}`);
          continue;
        }
        wardId = `jp_tokyo_${slug}`;
      } else {
        // 政令指定都市: 「○○市△△区」から「△△区」を抽出
        const cityIdBase = CITY_CODE_TO_ID[cityCode];
        if (!cityIdBase) continue;
        cityId = cityIdBase;

        // 「札幌市中央区」から「中央区」を抽出
        wardName = fullName.replace(/^.+市/, '');
        let slug = WARD_NAME_TO_SLUG[wardName];

        // 「中区」は複数の市にあるため、市ごとにスラッグを変える
        if (!slug && wardName === '中区') {
          slug = 'naka';
        }

        if (!slug) {
          console.warn(`スラッグが見つかりません: ${wardName} (${fullName})`);
          continue;
        }
        // city_idから市名部分を取得してward_idを生成
        // 例: jp_hokkaido_sapporo + chuo -> jp_hokkaido_sapporo_chuo
        wardId = `${cityId}_${slug}`;
      }

      wards.push({
        code,
        name: fullName,
        wardName,
        prefectureId,
        cityId,
        wardId,
      });
    }
  }

  return wards;
}

interface WardCoordinate {
  wardId: string;
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Nominatim APIから座標を取得
 */
async function fetchCoordinateFromNominatim(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MachikoreApp/1.0 (https://github.com/machikore)',
      },
    });

    if (!response.ok) {
      console.warn(`  API error for ${query}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.warn(`  Fetch error for ${query}:`, error);
    return null;
  }
}

/**
 * 座標をNominatim APIから取得（レート制限: 1秒間隔）
 */
async function fetchAllCoordinates(wards: WardEntry[]): Promise<Map<string, WardCoordinate>> {
  const coordinates = new Map<string, WardCoordinate>();
  const coordsPath = path.join(__dirname, '../data/ward-coordinates.json');

  // 既存の座標データがあれば読み込む
  if (fs.existsSync(coordsPath)) {
    const existing: WardCoordinate[] = JSON.parse(fs.readFileSync(coordsPath, 'utf-8'));
    for (const coord of existing) {
      coordinates.set(coord.wardId, coord);
    }
    console.log(`  既存の座標データ: ${coordinates.size}件`);
  }

  // 未取得の区の座標を取得
  const missing = wards.filter(w => !coordinates.has(w.wardId));
  console.log(`  未取得: ${missing.length}件`);

  for (let i = 0; i < missing.length; i++) {
    const ward = missing[i];
    console.log(`  [${i + 1}/${missing.length}] ${ward.name}...`);

    const coord = await fetchCoordinateFromNominatim(ward.name);
    if (coord) {
      coordinates.set(ward.wardId, {
        wardId: ward.wardId,
        name: ward.name,
        latitude: coord.lat,
        longitude: coord.lon,
      });
      console.log(`    -> ${coord.lat}, ${coord.lon}`);
    } else {
      console.log(`    -> 取得失敗`);
    }

    // Nominatim APIのレート制限（1秒間隔）
    if (i < missing.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  }

  // 座標データを保存
  const coordsArray = Array.from(coordinates.values());
  fs.writeFileSync(coordsPath, JSON.stringify(coordsArray, null, 2), 'utf-8');
  console.log(`\n座標データを保存しました: ${coordsPath}`);

  return coordinates;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const fetchCoords = args.includes('--fetch-coords');

  console.log('政令指定都市の区マッピング生成');
  console.log('='.repeat(50));

  const wards = extractWardsFromSeedFiles();
  console.log(`\n${wards.length}件の区を抽出しました`);

  // 1. ward-code-mapping.json を出力
  const mapping = wards.map(w => ({
    code: w.code,
    city_id: w.wardId,  // 区のIDをcity_idとして使用
    name: w.name,
    prefecture_id: w.prefectureId,
  }));

  const mappingPath = path.join(__dirname, '../data/ward-code-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nマッピングを保存しました: ${mappingPath}`);

  // 2. 座標を取得（オプション）
  let coordinates = new Map<string, WardCoordinate>();
  if (fetchCoords) {
    console.log('\n座標を取得中（Nominatim API）...');
    coordinates = await fetchAllCoordinates(wards);
  } else {
    // 既存の座標データがあれば読み込む
    const coordsPath = path.join(__dirname, '../data/ward-coordinates.json');
    if (fs.existsSync(coordsPath)) {
      const existing: WardCoordinate[] = JSON.parse(fs.readFileSync(coordsPath, 'utf-8'));
      for (const coord of existing) {
        coordinates.set(coord.wardId, coord);
      }
      console.log(`\n既存の座標データを使用: ${coordinates.size}件`);
    }
  }

  // 3. INSERT文を生成
  const sqlLines: string[] = [
    '-- 政令指定都市の区をcitiesテーブルに追加',
    '-- 生成日: ' + new Date().toISOString(),
    '',
    'INSERT INTO cities (id, prefecture_id, name, name_kana, type, latitude, longitude) VALUES',
  ];

  const values = wards.map(w => {
    const coord = coordinates.get(w.wardId);
    const lat = coord?.latitude ?? 0;
    const lon = coord?.longitude ?? 0;
    return `  ('${w.wardId}', '${w.prefectureId}', '${w.name}', '${w.name}', '区', ${lat}, ${lon})`;
  });

  sqlLines.push(values.join(',\n'));
  sqlLines.push('ON CONFLICT (id) DO NOTHING;');

  const sqlPath = path.join(__dirname, '../sql/insert-cities-wards.sql');
  fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
  fs.writeFileSync(sqlPath, sqlLines.join('\n'), 'utf-8');
  console.log(`\nSQL文を保存しました: ${sqlPath}`);

  // 4. 統計を表示
  const prefStats = new Map<string, number>();
  for (const w of wards) {
    const count = prefStats.get(w.prefectureId) || 0;
    prefStats.set(w.prefectureId, count + 1);
  }

  console.log('\n都道府県別の区の数:');
  const sortedStats = [...prefStats.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [prefId, count] of sortedStats) {
    console.log(`  ${prefId}: ${count}件`);
  }

  // 座標が未取得の場合の案内
  const missingCoords = wards.filter(w => !coordinates.has(w.wardId));
  if (missingCoords.length > 0) {
    console.log(`\n注意: ${missingCoords.length}件の区の座標が未取得です`);
    console.log('座標を取得するには: npx tsx scripts/supabase/generate-ward-mapping.ts --fetch-coords');
  }
}

main().catch(console.error);
