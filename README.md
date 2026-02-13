# Machikore（街コレ）

街コレは、お気に入りのスポットをマップにまとめて共有できるアプリです。

## プロジェクト構成

pnpm workspaces によるモノレポ構成です。

| パッケージ                                          | 説明                                  |
| --------------------------------------------------- | ------------------------------------- |
| [apps/mobile](./apps/mobile/)                       | モバイルアプリ（React Native + Expo） |
| [packages/database](./packages/database/)           | データベース型定義                    |
| [packages/design-tokens](./packages/design-tokens/) | デザイントークン                      |
| [packages/storybook](./packages/storybook/)         | Storybook                             |
| [supabase](./supabase/)                             | Supabase マイグレーション             |

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

実機インストール方法

※ カスタムネイティブモジュールを使っている場合は、先にビルドが必要です。

1.development buildを実機にインストール  
npx expo run:ios --device

2. 開発サーバーを起動  
   npx expo start --tunnel
   npx expo start --tunnel --clear

### 型定義再生成

npx supabase gen types typescript --project-id <your-project-id> > packages/database/src/types.ts

### Android

エミュレータ起動(インターネットも)
/Users/keiji/Library/Android/sdk/platform-tools/adb shell settings put global captive_portal_detection_enabled 0

# RevenueCat

# customer情報の確認

curl -s "https://api.revenuecat.com/v1/subscribers/USER_ID" \
 -H "Authorization: Bearer sk_xxx"

# customerの削除

curl -s -X DELETE "https://api.revenuecat.com/v1/subscribers/USER_ID" \
 -H "Authorization: Bearer sk_xxx"

無限テスター作成

- machikore.app+test1@gmail.com
- machikore.app+test2@gmail.com
- machikore.app+premium@gmail.com

# Sandboxのサブスクリプション更新間隔

┌────────────┬───────────────┐  
 │ 本番の期間 │ Sandboxの期間 │  
 ├────────────┼───────────────┤  
 │ 1週間 │ 3分 │  
 ├────────────┼───────────────┤  
 │ 1ヶ月 │ 5分 │
├────────────┼───────────────┤
│ 2ヶ月 │ 10分 │
├────────────┼───────────────┤
│ 3ヶ月 │ 15分 │
├────────────┼───────────────┤
│ 6ヶ月 │ 30分 │
├────────────┼───────────────┤
│ 1年 │ 1時間 │
└────────────┴───────────────┘

# OTAアップデートを配信

### ビルド

npx eas-cli build --profile production --platform ios

### App Store Connectに提出

npx eas-cli submit --platform ios

### JSバンドルだけをOTA配信

eas update --channel production --message "バグ修正の説明"

npx eas-cli build → ネイティブアプリ(.ipa)を作る  
npx eas-cli submit → 作った.ipaをApp Store Connectに送る  
npx eas-cli update → JSバンドルだけをOTA配信する

- npx expo run:ios = ローカル開発専用。App Storeとは無関係
- eas build = App Store提出用のビルドを作る
- eas update = 審査なしでJSの変更を配信する（eas buildで作ったアプリに対して）

ストアURL
https://apps.apple.com/app/id[Apple ID]
https://apps.apple.com/app/id6755458725

#スクリーンショットのリサイズ
切り取り
(base) keiji@MacBook-Pro-4 Desktop % python3 -c "from PIL import Image; Image.open('./test100.png').crop((0, 0, 1320, 1320)).save('./output.png')"
少し下切り取り
python3 -c "from PIL import Image; Image.open('./test100.png').crop((0,200, 1320, 1520)).save('./output.png')"

確認
sips -g pixelWidth -g pixelHeight ./test100.png

元画像は 幅1320 × 高さ2868 です。

一番下
0,1548, 1320, 2868

おすすめ比率
2:1（1320 × 660）: すっきり、横長
3:2（1320 × 880）: カード1枚分が余裕で入る
1:1（1320 × 1320）: 情報量は多いが、ガイドページでは間延びする
9:16（1320 × 2347）
3:4（1320 × 1760）

下の68は引いたほうが綺麗かも。

RevenueCat サブスクライバー確認

# ユーザーIDを変数にセット

USER_ID="79c087e6-8646-4634-9aab-b2ef1d518c6b"

# サブスクリプション状態を確認

curl -s "https://api.revenuecat.com/v1/subscribers/${USER_ID}" \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {revenuecat_sk_key}" | python3 -m json.tool

# RevenueCat サブスクライバー削除

curl -s -X DELETE "https://api.revenuecat.com/v1/subscribers/${USER_ID}" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {revenuecat_sk_key}" | python3 -m json.tool

web確認方法
pnpm dev:web

### テストの実行方法

1. ユニットテスト（Jest）

cd apps/mobile
pnpm test

特定のファイルだけ実行したい場合:
pnpm test -- --testPathPattern="use-bookmark-limit-guard"

2. 結合テスト（Jest + MSW）

cd apps/mobile
pnpm test:integration

3. DB（RLS）テスト（pgTAP）

Supabaseのローカル環境が必要です。

# ローカルSupabaseが起動していない場合はまず起動

npx supabase start

# RLSテストを実行

npx supabase test db

特定のテストファイルだけ実行する場合:
npx supabase test db --grep "rls_users"

4. E2Eテスト（Maestro）

iOSシミュレータ（またはAndroidエミュレータ）でアプリが動作している状態が必要です。

cd apps/mobile

# 全フロー実行

pnpm test:e2e

# iOS限定

pnpm test:e2e:ios

# 個別フロー実行

maestro test .maestro/flows/01_app_launch.yaml

前提条件まとめ
┌────────────────┬─────────────────────────────────────┐
│ テスト │ 前提 │
├────────────────┼─────────────────────────────────────┤
│ ユニットテスト │ なし（すぐ実行可能） │
├────────────────┼─────────────────────────────────────┤
│ 結合テスト │ なし（MSWがAPIをモック） │
├────────────────┼─────────────────────────────────────┤
│ RLSテスト │ npx supabase start でローカルDB起動 │
├────────────────┼─────────────────────────────────────┤
│ E2Eテスト │ シミュレータ上でアプリが起動中 │
└────────────────┴─────────────────────────────────────┘

# ローカルsupabase起動

npx supabase start

EAS UPDATE
npx eas build --platform ios --profile production
npx eas submit --platform ios
npx eas update --channel production --message "修正内容"
