# Machikore Mobile App

街コレ（Machikore）のモバイルアプリケーション。React Native + Expo で構築。

## セットアップ

```bash
# プロジェクトルートで依存関係をインストール
pnpm install
```

## 開発

```bash
# 開発サーバー起動
npm start

# iOS シミュレーターで実行
npm run ios

# Android エミュレーターで実行
npm run android
```

## テスト

```bash
# ユニットテスト
npm test

# ユニットテスト（ウォッチモード）
npm run test:watch

# ユニットテスト（カバレッジ付き）
npm run test:coverage

# 統合テスト（MSW を使用した API モックテスト）
npm run test:integration

# 統合テスト（ウォッチモード）
npm run test:integration:watch

# E2E テスト（Maestro）
npm run test:e2e
```

### テストの構成

| 種類 | 設定ファイル | 対象 |
|---|---|---|
| ユニットテスト | `jest.config.js` | `src/**/*.test.ts(x)`（`__integration__/` を除く） |
| 統合テスト | `jest.integration.config.js` | `src/__integration__/**/*.test.ts(x)` |
| E2E テスト | Maestro | `.maestro/flows/` |

## コード品質

```bash
# Lint
npm run lint

# 型チェック
npm run typecheck

# フォーマット
npm run format

# フォーマットチェック（CI用）
npm run format:check
```
