# Machi階層構造の設計

## 概要

Machiテーブルに地理的階層構造（都道府県ID、市区町村ID）を追加し、
統計・フィルタリング機能を強化する。

## テーブル設計

### 1. prefectures（都道府県マスター）

```sql
CREATE TABLE prefectures (
  id TEXT PRIMARY KEY,              -- "tokyo", "kanagawa"
  name TEXT NOT NULL,               -- "東京都", "神奈川県"
  name_kana TEXT NOT NULL,          -- "とうきょうと", "かながわけん"
  region TEXT NOT NULL,             -- "関東", "近畿", "中部" など
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 2. cities（市区町村マスター）

```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,              -- "shibuya", "minato"
  prefecture_id TEXT NOT NULL,      -- "tokyo"
  name TEXT NOT NULL,               -- "渋谷区", "港区"
  name_kana TEXT NOT NULL,          -- "しぶやく", "みなとく"
  type TEXT NOT NULL,               -- "区", "市", "町", "村"
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
);
```

### 3. machi（街データ）の変更

```sql
ALTER TABLE machi ADD COLUMN prefecture_id TEXT;
ALTER TABLE machi ADD COLUMN city_id TEXT;

-- 外部キー制約（後方互換のため nullable）
-- FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
-- FOREIGN KEY (city_id) REFERENCES cities(id)

-- インデックス追加
CREATE INDEX idx_machi_prefecture_id ON machi(prefecture_id);
CREATE INDEX idx_machi_city_id ON machi(city_id);
```

## データ移行戦略

### 1. prefectures データの投入

```typescript
const PREFECTURES = [
  { id: 'tokyo', name: '東京都', name_kana: 'とうきょうと', region: '関東' },
  { id: 'kanagawa', name: '神奈川県', name_kana: 'かながわけん', region: '関東' },
  { id: 'saitama', name: '埼玉県', name_kana: 'さいたまけん', region: '関東' },
  { id: 'chiba', name: '千葉県', name_kana: 'ちばけん', region: '関東' },
  // ... 47都道府県
];
```

### 2. cities データの投入

東京23区の例：
```typescript
const TOKYO_CITIES = [
  { id: 'chiyoda', prefecture_id: 'tokyo', name: '千代田区', name_kana: 'ちよだく', type: '区' },
  { id: 'chuo', prefecture_id: 'tokyo', name: '中央区', name_kana: 'ちゅうおうく', type: '区' },
  { id: 'minato', prefecture_id: 'tokyo', name: '港区', name_kana: 'みなとく', type: '区' },
  { id: 'shibuya', prefecture_id: 'tokyo', name: '渋谷区', name_kana: 'しぶやく', type: '区' },
  // ... 23区
];
```

### 3. 既存 machi データの移行

```typescript
// prefecture 文字列 → prefecture_id へのマッピング
const PREFECTURE_MAPPING = {
  '東京都': 'tokyo',
  '神奈川県': 'kanagawa',
  // ...
};

// UPDATE machi SET prefecture_id = ? WHERE prefecture = ?
```

## 後方互換性

### 移行期間中
- `prefecture` カラムは残す（既存コードの互換性）
- `prefecture_id`, `city_id` を段階的に導入

### 将来的な削除
- すべてのクエリが `prefecture_id` を使用するようになったら
- `prefecture` カラムを削除

## 使用例

### 都道府県別の統計
```typescript
SELECT
  p.name,
  COUNT(DISTINCT v.machi_id) as visited_count
FROM visits v
JOIN machi m ON v.machi_id = m.id
JOIN prefectures p ON m.prefecture_id = p.id
WHERE v.user_id = ?
GROUP BY p.id;
```

### 市区町村別の統計
```typescript
SELECT
  c.name,
  COUNT(*) as visit_count
FROM visits v
JOIN machi m ON v.machi_id = m.id
JOIN cities c ON m.city_id = c.id
WHERE v.user_id = ? AND m.prefecture_id = 'tokyo'
GROUP BY c.id;
```

### 地域別の統計
```typescript
SELECT
  p.region,
  COUNT(DISTINCT m.id) as machi_count
FROM machi m
JOIN prefectures p ON m.prefecture_id = p.id
GROUP BY p.region;
```

## メリット

1. ✅ データの正規化（重複削減）
2. ✅ 統計・分析が容易
3. ✅ 多言語対応の準備
4. ✅ 将来の拡張性（地域別機能など）
5. ✅ パフォーマンス向上（インデックス活用）
