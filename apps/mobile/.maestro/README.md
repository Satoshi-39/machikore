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
| 05_home_feed_recommend.yaml | おすすめフィード表示テスト |
| 06_home_feed_following.yaml | フォロー中フィード表示テスト（要ログイン） |
| 07_home_feed_map_card_navigation.yaml | マップカード遷移テスト |
| 08_home_feed_spot_card_navigation.yaml | スポットカード遷移テスト |
| 09_home_feed_infinite_scroll.yaml | 無限スクロールテスト |

## 共通フロー

| ファイル | 内容 |
|---------|------|
| _common/pass_onboarding.yaml | 初回起動オンボーディング通過 |
| _common/login_with_email.yaml | メールOTPログイン（Inbucket使用） |
| _common/pass_onboarding_after_login.yaml | ログイン後のオンボーディング通過 |

## 参考

- [Maestro 公式ドキュメント](https://maestro.mobile.dev/)
