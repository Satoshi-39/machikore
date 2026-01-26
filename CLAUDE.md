# Machikore (街コレ) プロジェクト

## アーキテクチャ

このプロジェクトは **Feature-Sliced Design (FSD)** アーキテクチャを採用しています。

### FSD 階層構造

```
src/
├── app/           # アプリケーション初期化、プロバイダー、グローバル設定
├── pages/         # ルーティング可能な画面全体（複数のWidgetを組み合わせる）
├── widgets/       # 複数のFeatureやEntityを組み合わせた複合コンポーネント
├── features/      # ユーザーのアクション・インタラクション（フィルター、検索など）
├── entities/      # ビジネスエンティティ（User, Post, Machi など）
├── shared/        # 共有ライブラリ、UI コンポーネント、ユーティリティ
```

### FSD の原則

1. **単方向依存**: 下位層は上位層に依存してはいけない
   - `shared` ← `entities` ← `features` ← `widgets` ← `pages` ← `app`

2. **Pages**: ルーティング可能な画面。Widgetの組み合わせのみ
3. **Widgets**: 複合的なUI。再利用可能なコンポーネント単位
4. **Features**: ユーザーアクション・機能（検索、フィルター、認証など）
5. **Entities**: ビジネスロジックとデータ（API、hooks、型定義）
6. **Shared**: プロジェクト全体で使う共通コード

### 開発時の注意

- 新しいコンポーネントを作成する際は、必ずFSDの階層構造に従う
- Pages層にはビジネスロジックを書かず、Widgetの組み合わせのみ
- Widget層には複数のFeatureやEntityを組み合わせる
- Feature層には具体的なユーザーアクションを実装
- Entity層にはビジネスエンティティとそのデータ取得ロジック

## スタイリング

- **NativeWind（Tailwind CSS for React Native）** を使用
- スタイリングは `className` で Tailwind クラスを使用し、`StyleSheet.create()` は使わない
- 動的な値（width, height など）のみ `style` プロパティを使用

## デザイントークン

- **色は必ずデザイントークン経由** - ハードコード（`#1A8CFF` 等）禁止
- **Semantic優先**: `colors.light` / `colors.dark` / `colors.action` を使用
- **Primitiveは直接使用しない**: Semantic経由で参照する
- **インポート**: `import { colors } from '@/shared/config'`
- **ダークモード**:
  - Tailwindクラス → CSS変数で自動切り替え、`isDarkMode` 分岐**不要**
  - style属性（アイコン等） → `isDarkMode` 分岐が**必要**
- **Tailwind設定**: 完全置換方式、未定義クラスは使用不可

## データストレージ方針

本番運用に備え、以下の方針でデータを管理します：

### Supabase = メインのデータストア（信頼できる唯一の情報源）
- ユーザー、マップ、スポット等のすべてのデータはSupabaseに保存
- データの作成・更新はSupabaseに直接書き込む
- 認証時に `public.users` テーブルにupsert（外部キー制約を満たすため）

### TanStack Query = APIキャッシュ（メモリ + 永続化）
- Supabaseからのデータ取得は全てTanStack Query経由
- `staleTime`/`gcTime`でキャッシュ戦略を制御
- 楽観的更新（Optimistic Updates）でUX向上
- 将来的にMMKVで永続化し、オフライン時も直近データを表示

### SQLite = マスタデータのローカルキャッシュ
- 変化しないデータ（都道府県、市区町村、カテゴリマスタなど）をローカルに保存
- オフラインでも確実に利用可能
- 認証時のユーザー情報キャッシュ

### データフロー
1. **認証時**: Supabase Auth → `public.users` にupsert → SQLiteにキャッシュ
2. **動的データ取得**: Supabaseから取得 → TanStack Queryでキャッシュ
3. **マスタデータ取得**: Supabaseから取得 → SQLiteにキャッシュ
4. **データ作成/更新**: Supabaseに保存 → TanStack Queryのキャッシュを更新（楽観的更新）

## Supabase マイグレーション

**重要: `npx supabase db push` コマンドは絶対に使用しないでください。**

マイグレーションファイルとSupabaseのDBの構造が異なる可能性があり、このコマンドを実行するとSupabaseが上書きされてしまいます。Supabaseへのマイグレーション適用はユーザーが手動で行います。

## Git コミットメッセージ

**コミットメッセージは日本語で記述してください。**

## 開発時のコミュニケーション

- **判断に迷った場合は必ずユーザーに確認する**
- 複数の実装方法がある場合、勝手に決めずに選択肢を提示して確認を取る
- 既存コードに大きな変更を加える場合は、事前に方針を確認する

## Web検索時の注意

- 技術情報を検索する際は、まず現在の年（2025年）で検索する
- 2025年の情報が見つからない場合は、2024年で再検索する

## テストの方針

- **テストの目的はバグを発見して実装を修正すること**
- テストが失敗した場合、実装にバグがないか検討し、必要なら実装を修正する
- 実装に合わせてテストを書き換えるのは本末転倒（テストをパスさせるための実装変更は不可）
- テストは「期待される正しい振る舞い」を記述し、実装がそれに従うべき

## 型定義の方針

- **Supabaseの自動生成型を基本として使用する**
  - `Database['public']['Tables']['xxx']['Row']` を基本の型として使用
  - `Database['public']['Tables']['xxx']['Insert']` を挿入時の型として使用
- **カスタム型は必要な場合のみ定義**
  - 複数テーブルのJOIN結果など、組み合わせが必要な場合
  - Supabaseの型をそのまま使うと使いづらい場合の拡張
- **型キャストは使用しない**
  - 型の不一致がある場合は、適切な型定義を作成するか、Supabaseの型を再生成する
  - RPC関数を追加・変更した場合は `npx supabase gen types` で型を再生成する
- 型定義ファイル: `packages/database/src/types.ts`

## API層の型とマッパー関数の配置

FSD公式の推奨に従い、以下の方針で配置する：

- **複合型（JOINクエリ結果）**: `shared/types/composite.types.ts` に定義
  - 例: `MapWithUser`, `SpotWithDetails`, `CommentWithUser`
- **マッパー関数**: DTOの近くに配置（`shared/api/supabase/xxx/types.ts`）
  - 複数ファイルで使用 → `types.ts` に配置
  - 1ファイルでのみ使用 → 同じファイル内に配置
- **API関数の戻り値**: マッピング済みの複合型を返す
  - 例: `getPublicMaps()` → `MapWithUser[]`
