# Machikore（街コレ）

街コレは、お気に入りのスポットをマップにまとめて共有できるアプリです。

## プロジェクト構成

pnpm workspaces によるモノレポ構成です。

| パッケージ | 説明 |
|---|---|
| [apps/mobile](./apps/mobile/) | モバイルアプリ（React Native + Expo） |
| [packages/database](./packages/database/) | データベース型定義 |
| [packages/design-tokens](./packages/design-tokens/) | デザイントークン |
| [packages/storybook](./packages/storybook/) | Storybook |
| [supabase](./supabase/) | Supabase マイグレーション |

## セットアップ

```bash
pnpm install
```

各パッケージの詳細は、それぞれの README を参照してください。

## Supabase マイグレーション

Direct Connection の場合:

```bash
psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres" -f ./supabase/migrations/<migration_file>.sql
```

Session Pooler の場合:

```bash
PGPASSWORD=[PASSWORD] psql -h aws-1-ap-southeast-1.pooler.supabase.com -p 5432 -U postgres.[PROJECT_REF] -d postgres -f ./supabase/migrations/<migration_file>.sql
```

スキーマダンプ:

```bash
pg_dump 'postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres' --schema-only --schema=public --no-owner --no-privileges > supabase/migrations/000_initial_schema.sql
```

tbls でドキュメント再生成:

```bash
tbls doc "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require" ./docs/database --rm-dist
```
