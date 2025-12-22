/**
 * machi.jsonに prefecture_id と city_id を追加するスクリプト
 */

const fs = require('fs');
const path = require('path');

// 駅名 → 区のマッピング（主要駅のみ）
const STATION_TO_CITY = {
  // 千代田区
  '東京': 'chiyoda',
  '秋葉原': 'chiyoda',
  '神田': 'chiyoda',
  '御茶ノ水': 'chiyoda',
  '飯田橋': 'chiyoda',
  '有楽町': 'chiyoda',
  '水道橋': 'chiyoda',

  // 中央区
  '銀座': 'chuo',
  '日本橋': 'chuo',
  '人形町': 'chuo',
  '月島': 'chuo',

  // 港区
  '新橋': 'minato',
  '品川': 'shinagawa',
  '田町': 'minato',
  '浜松町': 'minato',
  '六本木': 'minato',
  '赤坂': 'minato',
  '青山': 'minato',

  // 新宿区
  '新宿': 'shinjuku',
  '四ツ谷': 'shinjuku',
  '高田馬場': 'shinjuku',

  // 渋谷区
  '渋谷': 'shibuya',
  '原宿': 'shibuya',
  '代々木': 'shibuya',
  '恵比寿': 'shibuya',

  // 豊島区
  '池袋': 'toshima',
  '大塚': 'toshima',
  '巣鴨': 'toshima',

  // 台東区
  '上野': 'taito',
  '浅草': 'taito',
  '御徒町': 'taito',

  // 墨田区
  '錦糸町': 'sumida',
  '押上': 'sumida',

  // 江東区
  '門前仲町': 'koto',
  '豊洲': 'koto',

  // 品川区
  '五反田': 'shinagawa',
  '大崎': 'shinagawa',
  '目黒': 'meguro',

  // 目黒区
  '中目黒': 'meguro',
  '自由が丘': 'meguro',

  // 大田区
  '蒲田': 'ota',
  '大森': 'ota',

  // 世田谷区
  '下北沢': 'setagaya',
  '三軒茶屋': 'setagaya',
  '二子玉川': 'setagaya',

  // 中野区
  '中野': 'nakano',

  // 杉並区
  '荻窪': 'suginami',
  '高円寺': 'suginami',

  // 北区
  '赤羽': 'kita',
  '王子': 'kita',

  // 板橋区
  '板橋': 'itabashi',

  // 練馬区
  '練馬': 'nerima',

  // 足立区
  '北千住': 'adachi',

  // 葛飾区
  '亀有': 'katsushika',
  '金町': 'katsushika',

  // 江戸川区
  '小岩': 'edogawa',
};

// 都道府県のマッピング
const PREFECTURE_MAPPING = {
  '東京都': 'tokyo',
  '神奈川県': 'kanagawa',
  '埼玉県': 'saitama',
  '千葉県': 'chiba',
};

function updateMachiData() {
  const machiJsonPath = path.join(__dirname, '../src/shared/assets/data/machi.json');

  console.log('📖 machi.jsonを読み込み中...');
  const machiData = JSON.parse(fs.readFileSync(machiJsonPath, 'utf8'));

  console.log(`✅ ${machiData.length}件のデータを読み込み完了`);

  let updatedCount = 0;
  let cityMappedCount = 0;

  const updatedData = machiData.map((machi) => {
    const prefectureId = PREFECTURE_MAPPING[machi.prefecture] || null;
    const cityId = STATION_TO_CITY[machi.name] || null;

    if (prefectureId) {
      updatedCount++;
    }
    if (cityId) {
      cityMappedCount++;
    }

    return {
      ...machi,
      prefecture_id: prefectureId,
      city_id: cityId,
    };
  });

  console.log(`✅ ${updatedCount}件にprefecture_idを追加`);
  console.log(`✅ ${cityMappedCount}件にcity_idを追加（${machiData.length - cityMappedCount}件はnull）`);

  // バックアップを作成
  const backupPath = path.join(__dirname, '../src/shared/assets/data/machi.json.backup');
  fs.writeFileSync(backupPath, JSON.stringify(machiData, null, 2));
  console.log(`💾 バックアップを作成: ${backupPath}`);

  // 更新したデータを保存
  fs.writeFileSync(machiJsonPath, JSON.stringify(updatedData, null, 2));
  console.log(`✅ machi.jsonを更新完了`);
}

updateMachiData();
