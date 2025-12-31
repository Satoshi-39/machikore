# 駅データ (stations.json)

## 概要

このディレクトリには、東京の鉄道駅情報を含むJSONファイルが格納されています。

## データ形式

```typescript
interface Station {
  id: string;          // 駅の一意識別子（例：sta_yamanote_tokyo）
  name: string;        // 駅名（例：東京）
  latitude: number;    // 緯度
  longitude: number;   // 経度
  line_name: string;   // 路線名（例：山手線）
  prefecture: string;  // 都道府県（例：東京都）
}
```

## 現在の状態

現在、`stations.json`にはサンプルとして20駅のデータが含まれています：

- 山手線: 8駅
- 中央線: 3駅
- 東西線: 2駅
- 銀座線: 3駅
- 日比谷線: 2駅
- 半蔵門線: 1駅
- 副都心線: 1駅

## データの拡張方法

### 1. オープンデータAPIの利用

公共交通オープンデータセンター（https://www.odpt.org/）などのAPIを活用して、東京の全駅データを取得できます。

### 2. 手動追加

新しい駅を追加する場合は、以下の形式で`stations.json`に追加してください：

```json
{
  "id": "sta_路線名_駅名",
  "name": "駅名",
  "latitude": 緯度,
  "longitude": 経度,
  "line_name": "路線名",
  "prefecture": "東京都"
}
```

### 3. ID命名規則

駅IDは以下の形式で統一してください：

- プレフィックス: `sta_`
- 路線名（英語小文字・略称）: `yamanote`, `chuo`, `ginza`など
- 駅名（英語小文字）: `tokyo`, `shinjuku`など
- 形式: `sta_{路線名}_{駅名}`

例：
- 山手線の東京駅: `sta_yamanote_tokyo`
- 中央線の吉祥寺駅: `sta_chuo_kichijoji`

### 4. 座標の取得方法

緯度経度は以下の方法で取得できます：

1. Google Maps で駅を検索
2. 右クリック → 「この場所について」
3. 表示される座標をコピー

## 注意事項

- 同じ駅名で複数の路線がある場合は、IDと駅名を区別してください
  - 例: `sta_yamanote_ueno`と`sta_ginza_ueno`
  - 駅名に路線名を含める: `上野（銀座線）`
- データの更新時は、アプリの初回起動時にSQLiteデータベースに反映されます
- 本番環境では、より完全な駅データに置き換えることを推奨します

## TODO

- [ ] 全山手線駅を追加（29駅）
- [ ] 全中央線駅を追加
- [ ] 全東京メトロ駅を追加
- [ ] 全都営地下鉄駅を追加
- [ ] JR各線の主要駅を追加
- [ ] 私鉄各線の主要駅を追加（必要に応じて）
