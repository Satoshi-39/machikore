# 地理データ生成ガイド

本ドキュメントでは、OSMから取得した地理データ（machi、cities、transport_hubs）およびPostGISポリゴンデータ（admin_boundaries）の生成・登録方法をまとめています。

## クイックスタート

全国データを一括で登録する場合の手順：

```bash
# 1. OSMデータ取得（約1-2時間）
npx tsx scripts/osm/fetch-all-prefectures.ts

# 2. マスターデータ登録（continents, countries, regions, prefectures）
npx tsx scripts/supabase/upload-master-data.ts

# 3. OSMデータ登録（cities, machi, transport_hubs）
npx tsx scripts/supabase/upload-osm-data.ts

# 4. ポリゴン登録（psql経由）
bash scripts/supabase/upload-admin-boundaries.sh

# 5. machi更新（city_id, id, city_name）
psql -h db.YOUR_PROJECT.supabase.co -p 5432 -U postgres -d postgres \
  -f scripts/sql/update-machi-after-polygon.sql
```

**注意**: 手順4-5はpsqlコマンドを使用します。接続情報は`.env`ファイルまたはSupabaseダッシュボードで確認してください。

---

## 概要

### データの種類

| テーブル | 説明 | データソース |
|---------|------|-------------|
| `machi` | 街・地区データ | OSM (place=quarter/locality) |
| `cities` | 市区町村データ | OSM (place=city/town/village) |
| `transport_hubs` | 交通機関データ（駅・空港等） | OSM (railway=station等) |
| `admin_boundaries` | 行政区域ポリゴン | 国土数値情報 N03 |

**citiesのplace type:**
- `city`: 市（例: 那覇市、札幌市）
- `town`: 町（例: 和木町、読谷村）
- `village`: 村（例: 読谷村、恩納村）※名前が「村」で終わるもののみ

**machiのplace type:**
- `quarter`: 地区・エリア（例: 恵比寿、下北沢、徳山）
- `locality`: 地形名・場所（例: 岬、島、崎）
- `neighbourhood`: 細かすぎて不採用
- `suburb`: データが少なすぎて不採用

### ID形式

```
{country}_{prefecture}_{city}_{name}
```

例：
- `jp_yamaguchi_yamaguchi_wakamiyacho` （ローマ字名）
- `jp_yamaguchi_shimonoseki_shimonoseki` （ローマ字変換）

**ID末尾の生成ルール（優先順位）:**
1. OSMの`name:en`タグがあればそれをスラッグ化
2. OSMの`name:ja-Latn`タグがあればそれをスラッグ化
3. OSMの`name:ja_rm`タグがあればそれをスラッグ化
4. OSMの`name:ja-Hira`タグがあればwanakanaでローマ字変換
5. 漢字名をkuroshiro + kuromojiでローマ字変換

**使用ライブラリ:**
- `kuroshiro`: 漢字→ローマ字変換の司令塔
- `kuroshiro-analyzer-kuromoji`: 形態素解析（漢字の読み取得）
- `wanakana`: ひらがな/カタカナ→ローマ字変換

**スラッグ変換時の注意:**
- 長音記号（ō, ū等）は通常のアルファベット（o, u等）に変換
- 英数字以外はアンダースコアに変換

---

## 1. OSMデータの取得

### 1.1 単一都道府県のデータ取得

```bash
npx tsx scripts/osm/fetch-machi-data.ts jp_yamaguchi
```

### 1.2 全国一括取得

```bash
npx tsx scripts/osm/fetch-all-prefectures.ts
```

※ 47都道府県で約235回のAPIコール。Overpass APIの1日上限（10,000リクエスト）の約2%なので問題なし。
※ 処理時間: 約1-2時間

#### 処理内容
1. Overpass APIで指定都道府県のデータを取得:
   - `place=city`: 市
   - `place=town`: 町
   - `place=village`: 村（名前が「村」で終わるもののみ）
   - `place=quarter`: 地区・エリア
   - `place=locality`: 地形名・場所
2. `ISJ:city_name` タグがあれば市区町村名として使用
3. なければ `city_id=null`、`id` に `unknown` を含む形式で保存
4. JSONファイルを `scripts/data/machi/{prefecture_id}_machi_data.json` に出力

#### city_idの判定ロジック

1. **OSMタグから判定**（優先）
   - `ISJ:city_name` タグに市区町村名が含まれる場合、それを使用
   - 例: `ISJ:city_name=下関市` → `city_id=jp_yamaguchi_shimonoseki`

2. **ポリゴンから判定**（フォールバック）
   - `admin_boundaries` テーブルのポリゴンを使用
   - `ST_Contains()` で座標がどの市区町村に含まれるか判定

### 1.3 交通データの取得

```bash
npx tsx scripts/osm/fetch-transport-data.ts jp_yamaguchi
```

出力: `scripts/data/transport/{prefecture_id}_transport_data.json`

---

## 2. データのアップロード

### 2.1 machi・cities・transport_hubsのアップロード

```bash
npx tsx scripts/supabase/upload-osm-data.ts --prefecture=jp_yamaguchi
```

オプション:
- `--machi` : machiデータのみ
- `--transport` : 交通データのみ
- `--dry-run` : 実行せず件数のみ表示

### 2.2 citiesテーブルへの町村追加

OSMから取得したcitiesデータには「市」のみ含まれ、「町」「村」が不足する場合があります。
その場合は手動でINSERTが必要です。

```sql
INSERT INTO cities (id, prefecture_id, name, name_kana, type, latitude, longitude) VALUES
  ('jp_yamaguchi_waki', 'jp_yamaguchi', '和木町', 'わきちょう', '町', 34.2000, 132.2167),
  ('jp_yamaguchi_abu', 'jp_yamaguchi', '阿武町', 'あぶちょう', '町', 34.5000, 131.4667)
ON CONFLICT (id) DO NOTHING;
```

**注意**: `type` カラムには日本語の `'市'`, `'町'`, `'村'`, `'区'` を使用（CHECK制約あり）

---

## 3. admin_boundaries（ポリゴンデータ）

### 3.1 データソース

- **日本**: 国土数値情報 N03（行政区域データ）
- 既存シードファイル: `scripts/data/admin_boundaries_old/0XX_seed_admin_boundaries_postgis_XX.sql`

### 3.2 都道府県別SQLファイルの生成

1. 市区町村コードマッピングを生成：

```bash
npx tsx scripts/supabase/generate-city-code-mapping.ts
```

2. 新スキーマ形式のSQLファイルを生成：

```bash
# 全都道府県
npx tsx scripts/supabase/generate-admin-boundaries-sql.ts

# 特定都道府県のみ
npx tsx scripts/supabase/generate-admin-boundaries-sql.ts --prefecture=jp_yamaguchi
```

出力: `scripts/data/admin_boundaries/{prefecture_id}/{prefecture_id}_admin_boundaries.sql`

### 3.3 SQLファイルの実行

Supabaseダッシュボードでは長大なSQLを実行できないため、psqlを使用：

```bash
# 単一都道府県
PGPASSWORD='YOUR_PASSWORD' psql \
  -h db.YOUR_PROJECT.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f scripts/data/admin_boundaries/jp_yamaguchi/jp_yamaguchi_admin_boundaries.sql

# 全都道府県を一括登録
for f in scripts/data/admin_boundaries/jp_*/jp_*_admin_boundaries.sql; do
  echo "Processing: $f"
  PGPASSWORD='YOUR_PASSWORD' psql \
    -h db.YOUR_PROJECT.supabase.co \
    -p 5432 \
    -U postgres \
    -d postgres \
    -f "$f"
done
```

**注意**: SQLファイルには`ST_Simplify(geom, 0.0001)`が含まれており、登録時に約10m精度でポリゴンが簡略化されます。

### 3.4 テーブルスキーマ

```sql
CREATE TABLE admin_boundaries (
  id SERIAL PRIMARY KEY,
  geom GEOMETRY(MultiPolygon, 4326),
  admin_level INTEGER,           -- 8 = 市区町村レベル
  country_id TEXT REFERENCES countries(id),
  prefecture_id TEXT REFERENCES prefectures(id),
  city_id TEXT UNIQUE REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. tile_idの設定

### 4.1 tile_idとは

tile_idはアプリでマップ表示時にデータを効率的に取得するためのキャッシュキーです。
座標を0.25度（約25km）のグリッドに分割し、タイル単位でデータを取得・キャッシュします。

**形式:** `{tileX}_{tileY}`

**計算式:**
```
tileX = floor((longitude + 180) / 0.25)
tileY = floor((latitude + 90) / 0.25)
```

**例:**
- 東京駅（35.6812, 139.7671）→ `1279_502`
- 渋谷（35.6580, 139.7016）→ `1278_502`

### 4.2 tile_idの更新SQL

データ投入後、以下のSQLでtile_idを設定します：

```sql
-- machi テーブルのtile_idを更新
UPDATE machi
SET tile_id = CONCAT(
  FLOOR((longitude + 180) / 0.25)::text,
  '_',
  FLOOR((latitude + 90) / 0.25)::text
)
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND tile_id IS NULL;

-- cities テーブルのtile_idを更新
UPDATE cities
SET tile_id = CONCAT(
  FLOOR((longitude + 180) / 0.25)::text,
  '_',
  FLOOR((latitude + 90) / 0.25)::text
)
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND tile_id IS NULL;

-- transport_hubs テーブルのtile_idを更新
UPDATE transport_hubs
SET tile_id = CONCAT(
  FLOOR((longitude + 180) / 0.25)::text,
  '_',
  FLOOR((latitude + 90) / 0.25)::text
)
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND tile_id IS NULL;
```

### 4.3 確認クエリ

```sql
-- 更新結果を確認
SELECT tile_id, COUNT(*) as count
FROM machi
WHERE tile_id IS NOT NULL
GROUP BY tile_id
ORDER BY count DESC
LIMIT 10;

-- 東京周辺のタイル確認
SELECT id, name, tile_id, latitude, longitude
FROM machi
WHERE tile_id IN ('1278_502', '1279_502')
LIMIT 10;
```

### 4.4 アプリ側の実装

アプリでは `src/shared/lib/utils/tile.utils.ts` で同じ計算を行います：

```typescript
const MAP_TILE_SIZE = 0.25; // 度

function getTileId(latitude: number, longitude: number): string {
  const tileX = Math.floor((longitude + 180) / MAP_TILE_SIZE);
  const tileY = Math.floor((latitude + 90) / MAP_TILE_SIZE);
  return `${tileX}_${tileY}`;
}
```

**重要:** Supabase側とアプリ側で同じ計算式を使用する必要があります。

---

## 5. city_id更新（ポリゴン使用）

admin_boundariesにポリゴンを登録後、machi・transport_hubsのcity_idを更新します。

### 5.1 machiのcity_id更新

```sql
-- ポリゴン内のmachiにcity_idを設定
UPDATE machi m
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE m.prefecture_id = 'jp_yamaguchi'
  AND m.city_id IS NULL
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(m.longitude, m.latitude), 4326));
```

### 5.2 transport_hubsのcity_id更新

transport_hubsも同様にポリゴンを使用してcity_idを設定します：

```sql
-- ポリゴン内のtransport_hubsにcity_idを設定
UPDATE transport_hubs th
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE th.prefecture_id = 'jp_yamaguchi'
  AND th.city_id IS NULL
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(th.longitude, th.latitude), 4326));
```

**全都道府県を一括更新する場合：**

```sql
-- machi（全国）
UPDATE machi m
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE m.city_id IS NULL
  AND ab.prefecture_id = m.prefecture_id
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(m.longitude, m.latitude), 4326));

-- transport_hubs（全国）
UPDATE transport_hubs th
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE th.city_id IS NULL
  AND ab.prefecture_id = th.prefecture_id
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(th.longitude, th.latitude), 4326));
```

### 5.3 確認クエリ

```sql
-- machiのcity_id更新結果を確認
SELECT
  prefecture_id,
  COUNT(*) as total,
  COUNT(city_id) as with_city_id,
  COUNT(*) - COUNT(city_id) as without_city_id
FROM machi
GROUP BY prefecture_id
ORDER BY prefecture_id;

-- transport_hubsのcity_id更新結果を確認
SELECT
  prefecture_id,
  COUNT(*) as total,
  COUNT(city_id) as with_city_id,
  COUNT(*) - COUNT(city_id) as without_city_id
FROM transport_hubs
GROUP BY prefecture_id
ORDER BY prefecture_id;
```

**注意**: transport_hubsの`city_id`はオプション（NULL許容）です。離島の空港やフェリーターミナルなど、ポリゴン外に位置するものはNULLのままで問題ありません。

---

## 6. machiのid更新

city_id設定後、idを正しい形式に更新：

```sql
-- unknownを含むidを正しい形式に更新
UPDATE machi
SET id = city_id || '_' || substring(id from 'jp_yamaguchi_unknown_(.+)')
WHERE prefecture_id = 'jp_yamaguchi'
  AND id LIKE '%_unknown_%'
  AND city_id IS NOT NULL;
```

### 重複の処理

同じ名前のmachiが複数存在する場合（異なる座標）、idが衝突します：

```sql
-- 衝突するidがある場合は確認
WITH new_ids AS (
  SELECT
    id as old_id,
    city_id || '_' || substring(id from 'jp_yamaguchi_unknown_(.+)') as new_id
  FROM machi
  WHERE prefecture_id = 'jp_yamaguchi'
    AND id LIKE '%_unknown_%'
    AND city_id IS NOT NULL
)
SELECT n.old_id, n.new_id
FROM new_ids n
JOIN machi m ON m.id = n.new_id;

-- 衝突するものは _2 サフィックスを追加
UPDATE machi
SET id = city_id || '_' || substring(id from 'jp_yamaguchi_unknown_(.+)') || '_2'
WHERE id = 'jp_yamaguchi_unknown_XXX';
```

---

## 7. 未解決のケース

### 7.1 ポリゴン外のmachi（島・岬など）

以下のケースはcity_idがnullのまま残ります：

- 離島（ポリゴンに含まれない）
- 岬・半島の先端
- 海上の地名

```sql
-- 確認
SELECT id, name, latitude, longitude
FROM machi
WHERE prefecture_id = 'jp_yamaguchi' AND city_id IS NULL;
```

**対応方針**:
- 現時点ではそのままにしておく
- 将来的に手動で調査し、最寄りの市区町村に割り当てるか判断

### 7.2 citiesテーブルに存在しない市区町村

`admin_boundaries` への挿入時に外部キー制約でエラーになる場合、先にcitiesテーブルに追加が必要：

```sql
-- エラー例
ERROR: insert or update on table "admin_boundaries" violates foreign key constraint
DETAIL: Key (city_id)=(jp_yamaguchi_waki) is not present in table "cities".
```

---

## 8. 全国展開の手順

山口県での検証をもとに、他の都道府県も以下の手順で処理：

1. **citiesテーブルの確認・追加**
   - 町・村が不足していれば追加

2. **admin_boundariesポリゴンの登録**
   - 既存シードファイルから抽出
   - 市区町村コード → city_id のマッピング作成
   - 個別SQLファイル生成・実行

3. **machiデータの取得・アップロード**
   ```bash
   npx tsx scripts/osm/fetch-machi-data.ts jp_{prefecture}
   npx tsx scripts/supabase/upload-osm-data.ts --machi --prefecture=jp_{prefecture}
   ```

4. **city_idの更新（ポリゴン使用）**

5. **idの更新**

6. **未解決ケースの記録**

---

## 9. 政令指定都市の区（Ward）対応

### 9.1 背景

日本の20政令指定都市（札幌市、仙台市、横浜市、京都市、大阪市など）は、内部に行政区（区）を持っています。国土数値情報のポリゴンデータは区単位で提供されているため、市単位のポリゴンは存在しません。

**例: 京都市**
- 国土数値情報には「京都市」のポリゴンは存在しない
- 代わりに「北区」「上京区」「中京区」...「伏見区」の11区のポリゴンがある

このため、政令指定都市ではスポットの`city_id`を判定できない問題がありました。

### 9.2 解決方針

区を独立した市区町村として`cities`テーブルに登録し、`admin_boundaries`にも区単位のポリゴンを登録します。

**メリット:**
- より細かい粒度での検索・絞り込みが可能
- 「京都市北区のスポット」のような検索ができる
- 国土数値情報のデータ構造と一致

**city_idの形式:**
```
jp_{prefecture}_{city}_{ward}
```

例：
- `jp_kyoto_kyoto_kita` （京都市北区）
- `jp_osaka_osaka_chuo` （大阪市中央区）
- `jp_tokyo_setagaya` （東京都世田谷区）※東京23区は特別区のため形式が異なる

### 9.3 区マッピングの生成

```bash
# 区のマッピングを生成
npx tsx scripts/supabase/generate-ward-mapping.ts
```

このスクリプトは以下を生成します：

1. **`scripts/data/ward-code-mapping.json`**: 区コード→city_idのマッピング
2. **`scripts/sql/insert-cities-wards.sql`**: citiesテーブルへのINSERT文

**出力例（ward-code-mapping.json）:**
```json
[
  {
    "code": "26101",
    "city_id": "jp_kyoto_kyoto_kita",
    "name": "京都市北区",
    "prefecture_id": "jp_kyoto"
  },
  {
    "code": "26102",
    "city_id": "jp_kyoto_kyoto_kamigyo",
    "name": "京都市上京区",
    "prefecture_id": "jp_kyoto"
  }
]
```

### 9.4 区の座標取得

区の中心座標はOSM Nominatim APIから取得できます：

```bash
# 座標を取得してキャッシュ（API制限のため1.1秒間隔）
npx tsx scripts/supabase/generate-ward-mapping.ts --fetch-coords
```

このオプションを使用すると：
- Nominatim APIで各区の座標を取得
- 結果を`scripts/data/ward-coordinates.json`にキャッシュ
- `insert-cities-wards.sql`に正確な座標を含める

**注意**: Nominatim APIは1秒に1リクエストの制限があるため、全196区の座標取得には約4分かかります。

### 9.5 登録手順

**Step 1: 区マッピングを生成**
```bash
npx tsx scripts/supabase/generate-ward-mapping.ts --fetch-coords
```

**Step 2: citiesテーブルに区を追加**
```bash
PGPASSWORD='YOUR_PASSWORD' psql \
  -h db.YOUR_PROJECT.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f scripts/sql/insert-cities-wards.sql
```

**Step 3: city-code-mappingにward-code-mappingをマージ**
```bash
# generate-ward-mapping.tsが自動でマージ
npx tsx scripts/supabase/generate-city-code-mapping.ts
npx tsx scripts/supabase/generate-ward-mapping.ts
```

**Step 4: admin_boundariesのSQLを再生成**
```bash
# 区を含むマッピングでポリゴンSQLを生成
npx tsx scripts/supabase/generate-admin-boundaries-sql.ts
```

**Step 5: ポリゴンを登録**
```bash
# 区のポリゴンを含むSQLを実行
for f in scripts/data/admin_boundaries/jp_*/jp_*_admin_boundaries.sql; do
  echo "Processing: $f"
  PGPASSWORD='YOUR_PASSWORD' psql \
    -h db.YOUR_PROJECT.supabase.co \
    -p 5432 \
    -U postgres \
    -d postgres \
    -f "$f"
done
```

**Step 6: machiのcity_idを更新**
```sql
-- 区のポリゴンでmachi.city_idを更新
UPDATE machi m
SET city_id = ab.city_id
FROM admin_boundaries ab
WHERE m.city_id IS NULL
  AND ab.prefecture_id = m.prefecture_id
  AND ST_Contains(ab.geom, ST_SetSRID(ST_Point(m.longitude, m.latitude), 4326));
```

### 9.6 政令指定都市一覧

| 都道府県 | 政令指定都市 | 区数 | コード範囲 |
|---------|------------|------|-----------|
| 北海道 | 札幌市 | 10区 | 01101-01110 |
| 宮城県 | 仙台市 | 5区 | 04101-04105 |
| 埼玉県 | さいたま市 | 10区 | 11101-11110 |
| 千葉県 | 千葉市 | 6区 | 12101-12106 |
| 神奈川県 | 横浜市 | 18区 | 14101-14118 |
| 神奈川県 | 川崎市 | 7区 | 14131-14137 |
| 神奈川県 | 相模原市 | 3区 | 14151-14153 |
| 新潟県 | 新潟市 | 8区 | 15101-15108 |
| 静岡県 | 静岡市 | 3区 | 22101-22103 |
| 静岡県 | 浜松市 | 7区 | 22131-22137 |
| 愛知県 | 名古屋市 | 16区 | 23101-23116 |
| 京都府 | 京都市 | 11区 | 26101-26111 |
| 大阪府 | 大阪市 | 24区 | 27101-27128 |
| 大阪府 | 堺市 | 7区 | 27141-27147 |
| 兵庫県 | 神戸市 | 9区 | 28101-28111 |
| 岡山県 | 岡山市 | 4区 | 33101-33104 |
| 広島県 | 広島市 | 8区 | 34101-34108 |
| 福岡県 | 北九州市 | 7区 | 40101-40107 |
| 福岡県 | 福岡市 | 7区 | 40131-40137 |
| 熊本県 | 熊本市 | 5区 | 43101-43105 |

**合計**: 20市 175区

**注意**: 東京23区は特別区であり、通常の市区町村と同様に扱われるため、このワード対応には含まれません（既にcity-code-mappingに登録済み）。

### 9.7 確認クエリ

```sql
-- 区がcitiesテーブルに登録されているか確認
SELECT COUNT(*) FROM cities WHERE type = '区';

-- 京都市の区を確認
SELECT id, name, latitude, longitude
FROM cities
WHERE prefecture_id = 'jp_kyoto' AND id LIKE 'jp_kyoto_kyoto_%';

-- 区のポリゴンがadmin_boundariesに登録されているか確認
SELECT ab.city_id, c.name
FROM admin_boundaries ab
JOIN cities c ON c.id = ab.city_id
WHERE c.type = '区'
ORDER BY ab.city_id;

-- 京都市内のmachiがcity_idを持っているか確認
SELECT m.id, m.name, m.city_id, c.name as city_name
FROM machi m
LEFT JOIN cities c ON c.id = m.city_id
WHERE m.prefecture_id = 'jp_kyoto'
  AND m.city_id LIKE 'jp_kyoto_kyoto_%'
LIMIT 10;
```

---

## 付録A: admin_boundariesポリゴン生成時のマッピング

国土数値情報のシードデータを新スキーマに変換する際、市区町村コード（5桁）から`city_id`へのマッピングが必要です。

**山口県の例:**

```python
# admin_boundaries生成スクリプト用のマッピング
# 国土数値情報の市区町村コード → city_id
city_mapping = {
    '35201': 'jp_yamaguchi_shimonoseki',  # 下関市
    '35202': 'jp_yamaguchi_ube',          # 宇部市
    '35203': 'jp_yamaguchi_yamaguchi',    # 山口市
    '35204': 'jp_yamaguchi_hagi',         # 萩市
    '35206': 'jp_yamaguchi_hofu',         # 防府市
    '35207': 'jp_yamaguchi_kudamatsu',    # 下松市
    '35208': 'jp_yamaguchi_iwakuni',      # 岩国市
    '35210': 'jp_yamaguchi_hikari',       # 光市
    '35211': 'jp_yamaguchi_nagato',       # 長門市
    '35212': 'jp_yamaguchi_yanai',        # 柳井市
    '35213': 'jp_yamaguchi_mine',         # 美祢市
    '35215': 'jp_yamaguchi_shunan',       # 周南市
    '35216': 'jp_yamaguchi_sanyo_onoda',  # 山陽小野田市
    '35305': 'jp_yamaguchi_suo_oshima',   # 周防大島町
    '35321': 'jp_yamaguchi_waki',         # 和木町
    '35341': 'jp_yamaguchi_kaminoseki',   # 上関町
    '35343': 'jp_yamaguchi_tabuse',       # 田布施町
    '35344': 'jp_yamaguchi_hirao',        # 平生町
    '35502': 'jp_yamaguchi_abu',          # 阿武町
}
```

**注意**: このマッピングはadmin_boundariesのSQLファイル生成時のみ使用します。アプリケーション内では市区町村コードは使用せず、`city_id`（例: `jp_yamaguchi_shimonoseki`）を使用します。

参照: [総務省 全国地方公共団体コード](https://www.soumu.go.jp/denshijiti/code.html)

---

## 付録B: ポリゴンデータのサイズと最適化

### 現状のデータサイズ

| 範囲 | SQL形式 | DB格納後（推定） |
|------|---------|----------------|
| 山口県（19市区町村） | ~1MB | ~500KB |
| 日本全国（~1,700市区町村） | ~41MB | ~20-30MB |

### 全世界展開時の推定

| 地域 | 推定行政区数 | 推定サイズ（SQL） | 推定サイズ（DB） |
|------|------------|-----------------|----------------|
| 東アジア | ~10,000 | ~250MB | ~150MB |
| 全世界（市区町村レベル） | ~50,000-100,000 | ~1.5-3GB | ~1-2GB |

**Supabase Pro (8GB) の場合:** 全世界の市区町村レベルポリゴンはDBの約15-25%を占める

### ポリゴン簡略化による最適化

`ST_Simplify()` 関数を使用してポリゴンの座標点数を削減できます：

```sql
-- 簡略化してから格納（tolerance = 0.001 ≒ 約100m）
INSERT INTO admin_boundaries (geom, admin_level, country_id, prefecture_id, city_id)
VALUES (
  ST_Simplify(ST_GeomFromText('MULTIPOLYGON(...)'), 0.001),
  8,
  'jp',
  'jp_yamaguchi',
  'jp_yamaguchi_shimonoseki'
);
```

**tolerance値の目安:**
| tolerance | 精度 | 削減率（目安） |
|-----------|------|--------------|
| 0.0001 | ~10m | 20-30% |
| 0.001 | ~100m | 50-70% |
| 0.01 | ~1km | 80-90% |

**推奨:**
- 日本: tolerance = 0.0001〜0.001（高精度が必要）
- 海外: tolerance = 0.001〜0.01（概要レベルで十分な場合）

### 段階的導入の推奨

1. **Phase 1**: 日本全国（市区町村レベル、admin_level=8）
2. **Phase 2**: 東アジア主要国（県/州レベル、admin_level=4-6）
3. **Phase 3**: その他の国（必要に応じて）

海外は都道府県/州レベル（admin_level=4-6）から始め、需要に応じて市区町村レベルを追加するのが効率的です。
