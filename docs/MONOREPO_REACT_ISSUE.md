# Monorepo React バージョン問題の記録

## 問題の概要

pnpm monorepoでmobile（React Native/Expo）とadmin/web（Next.js）を共存させる際に、Reactの重複・バージョン不一致が発生する。

## 環境

- pnpm v10.6.3（hoisted mode: `node-linker=hoisted`, `shamefully-hoist=true`）
- mobile: React Native 0.81.5, Expo SDK 54
- admin/web: Next.js 15.5.9

## 試した解決策と結果

### 1. mobileをReact 19.1.0のまま、admin/webをReact 19.1.4

**結果**: 失敗
- `node_modules/next/node_modules/react` (19.1.4) が作成される
- MetroがこのReactを拾い「Invalid hook call」エラー

### 2. metro.config.jsでblockListとextraNodeModulesを設定

```javascript
config.resolver.blockList = [
  new RegExp(`${monorepoRoot}/node_modules/next/.*`),
];
config.resolver.extraNodeModules = {
  react: path.resolve(monorepoRoot, 'node_modules/react'),
};
```

**結果**: 失敗
- 依然として「Invalid hook call」エラー

### 3. mobileをReact 19.1.4にアップグレード

**結果**: 部分的成功
- `node_modules/next/node_modules/react` が作成されなくなった（重複解消）
- しかし新たなエラー発生:

```
Incompatible React versions: The "react" and "react-native-renderer" packages must have the exact same version.
- react: 19.1.4
- react-native-renderer: 19.1.0
```

## 根本原因

React Native 0.81.5は内部で`react-native-renderer` 19.1.0を使用している。
ReactをNext.jsに合わせて19.1.4にすると、react-native-rendererとの不一致が発生。

## 制約条件

1. **admin/web**: CVE-2025-55182対策のためReact 19.1.2以上が必須
2. **mobile**: React Native 0.81.5のreact-native-rendererはReact 19.1.0を要求
3. **pnpm hoisted mode**: React Nativeの依存関係のため必須

## 考えられる解決策

### A. React Native のアップグレード

React Native 0.82以降でreact-native-rendererが19.1.4対応になれば解決。
Expoのサポート状況を確認する必要あり。

### B. admin/webをReact 19.1.0にダウングレード

CVE-2025-55182の影響を再評価する必要あり。
サーバーコンポーネントを使用していない場合は影響が限定的かもしれない。

### C. pnpm isolatedモードへの移行

各アプリが独自のnode_modulesを持つ設定に変更。
ただしReact Nativeとの互換性確認が必要。

### D. monorepo構成の見直し

mobile を別リポジトリに分離する。

## 以前動いていた時の状態

ユーザーによると、admin（Next.js）とmobile（React Native）だけの時は動作していた。
web版を追加した後、または別の変更後に問題が発生。

**確認すべき点**:
- 以前のpnpm-lock.yamlの状態
- 以前のReactバージョン構成
- 以前のmetro.config.jsの設定

## 次のアクション

1. React Native/Expoの最新リリースノートを確認し、React 19.1.4サポート状況を調査
2. CVE-2025-55182の影響範囲を再確認（admin/webでサーバーコンポーネントを使用しているか）
3. 以前動作していた時点のGitコミットを特定し、差分を確認

## 現在のステータス (2026-01-09)

### 暫定対応 ⚠️
- 全アプリをReact 19.1.0に統一
- React重複解消（`node_modules/next/node_modules/react`が作成されない）
- mobileアプリがiOSシミュレータで正常に動作

### 解決策
全アプリ（mobile, admin, web）をReact 19.1.0に統一することで、pnpm hoisted modeでのReact重複問題を解決。

**注意**: curlでMetroバンドルリクエストをテストする際に`./index`解決エラーが出るが、これはテスト方法の問題であり、実際のアプリ起動には影響しない。

### CVE-2025-55182について（重要）

**React 19.1.0はCVE-2025-55182の対象バージョン**

- CVE-2025-55182はReact 19.1.2で修正済み
- しかしReact Native 0.81.5の`react-native-renderer`は19.1.0を要求（完全一致が必須）
- そのためReact 19.1.2以上を使用することが**技術的に不可能**

### 対応方針

**Expo SDK 55（2026年1月リリース予定）へのアップグレードで解決**

- React Native 0.83 + React 19.2を含む
- React 19.2はCVE-2025-55182が修正済み
- SDK 55からはNew Architectureのみサポート

## なぜReact 19.1.0でしか動かないのか

React Native 0.81.5に含まれる`react-native-renderer`は**React 19.1.0を固定で使用**している。
Reactとrendererのバージョンが完全一致しないと以下のエラーが発生：

```
Incompatible React versions: The "react" and "react-native-renderer" packages must have the exact same version.
- react: 19.1.x
- react-native-renderer: 19.1.0
```

| Reactバージョン | 結果 |
|----------------|------|
| 19.1.0 | ✅ 動作 |
| 19.1.1〜19.1.4 | ❌ 失敗 |

## 更新履歴

- 2026-01-09: CVE対応方針を明確化、Expo SDK 55待ちの方針を決定
- 2026-01-09 10:10: React 19.1.0統一で問題解決を確認
- 2026-01-09 10:00: React 19.1.0統一完了、新たな問題発見
- 2026-01-09: 初版作成
