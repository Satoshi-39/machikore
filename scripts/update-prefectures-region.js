/**
 * prefectures.jsonのregionフィールドをregion_id（外部キー）に変換するスクリプト
 */

const fs = require('fs');
const path = require('path');

// 地方名 → IDのマッピング
const REGION_MAPPING = {
  '北海道': 'hokkaido',
  '東北': 'tohoku',
  '関東': 'kanto',
  '中部': 'chubu',
  '近畿': 'kinki',
  '中国': 'chugoku',
  '四国': 'shikoku',
  '九州': 'kyushu',
  '沖縄': 'okinawa',
};

function updatePrefecturesData() {
  const prefecturesJsonPath = path.join(__dirname, '../src/shared/assets/data/prefectures.json');

  console.log('📖 prefectures.jsonを読み込み中...');
  const prefecturesData = JSON.parse(fs.readFileSync(prefecturesJsonPath, 'utf8'));

  console.log(`✅ ${prefecturesData.length}件のデータを読み込み完了`);

  let updatedCount = 0;

  const updatedData = prefecturesData.map((prefecture) => {
    const regionId = REGION_MAPPING[prefecture.region];

    if (!regionId) {
      console.warn(`⚠️  不明な地方名: ${prefecture.region} (${prefecture.name})`);
      return prefecture;
    }

    updatedCount++;

    return {
      id: prefecture.id,
      name: prefecture.name,
      name_kana: prefecture.name_kana,
      region_id: regionId,
    };
  });

  console.log(`✅ ${updatedCount}件にregion_idを設定`);

  // バックアップを作成
  const backupPath = path.join(__dirname, '../src/shared/assets/data/prefectures.json.backup');
  fs.writeFileSync(backupPath, JSON.stringify(prefecturesData, null, 2));
  console.log(`💾 バックアップを作成: ${backupPath}`);

  // 更新したデータを保存
  fs.writeFileSync(prefecturesJsonPath, JSON.stringify(updatedData, null, 2));
  console.log(`✅ prefectures.jsonを更新完了`);
}

updatePrefecturesData();
