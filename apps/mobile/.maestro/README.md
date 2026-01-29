# Maestro E2E テスト

## 前提条件

- Maestro CLI がインストールされていること
- iOS シミュレータまたは Android エミュレータが起動していること
- アプリがビルド済みでインストールされていること

## インストール

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

## テスト実行

```bash
# 全テスト実行
pnpm test:e2e

# iOS のみ
pnpm test:e2e:ios

# Android のみ
pnpm test:e2e:android

# 単一フロー実行
maestro test .maestro/flows/01_app_launch.yaml
```

## 開発時

```bash
# Maestro Studio でインタラクティブにテスト作成
pnpm maestro:studio
```

## テストフロー一覧

| ファイル | 内容 |
|---------|------|
| 01_app_launch.yaml | アプリ起動テスト |
| 02_tab_navigation.yaml | タブナビゲーションテスト |
| 03_discover_search.yaml | 発見画面の検索テスト |
| 04_create_requires_auth.yaml | 作成ボタンの認証テスト |

## 参考

- [Maestro 公式ドキュメント](https://maestro.mobile.dev/)
