# Google Places API キー制限の設定手順

## 概要

Google Places API キー（`EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`）にアプリケーション制限をかけ、
不正利用を防止する。

### 対象API

- Places API (New) — スポット検索、場所の詳細取得
- Geocoding API — 逆ジオコーディング（座標→住所）

### 仕組み

アプリからのHTTPリクエストにプラットフォーム識別ヘッダーを付与し、
Google Cloud Console側でアプリケーション制限を設定することで、
正規のアプリ以外からのリクエストを拒否する。

- iOS: `X-Ios-Bundle-Identifier: com.tyatsushi.machikore`
- Android: `X-Android-Package: com.tyatsushi.machikore`

## 前提条件

- アプリ側のコード変更（HTTPヘッダー追加）が反映済みであること
  - 対象ファイル: `apps/mobile/src/features/search-places/api/google-api-headers.ts`
  - OTA更新（`eas update`）またはネイティブビルドで配信済みであること

## 手順

### Step 1: OTA更新でヘッダー変更を配信

```bash
cd apps/mobile
eas update --branch production --message "Google API セキュリティヘッダー追加"
```

アプリを起動して検索・逆ジオコーディングが正常に動作することを確認する。

### Step 2: Google Cloud Console でiOS用の制限を設定

1. [Google Cloud Console](https://console.cloud.google.com/) → APIとサービス → 認証情報
2. 「Maps Platform API Key」をクリック
3. **アプリケーションの制限**:
   - 「iOSアプリ」を選択
   - バンドルID: `com.tyatsushi.machikore` を追加
4. **APIの制限** (変更不要):
   - 「キーを制限」のまま
   - Geocoding API, Places API (New) が選択されていること
5. 「保存」をクリック（反映まで最大5分）

### Step 3: 動作確認

アプリでスポット検索と逆ジオコーディングが正常に動作することを確認する。

## Android対応時の追加手順

1つのAPIキーにはiOS/Androidどちらか一方のアプリ制限しかかけられないため、
Androidリリース時にはキーを分ける必要がある。

### キー分割の手順

1. Google Cloud Consoleで新しいAPIキーを作成（例: `Places API Key - Android`）
2. 新キーに「Androidアプリ」制限を設定
   - パッケージ名: `com.tyatsushi.machikore`
   - SHA-1フィンガープリント: `eas credentials` で取得
3. 新キーにAPIの制限を設定（Geocoding API, Places API (New)）
4. アプリコード側で `google-api-headers.ts` を更新し、Platformに応じてキーを切り替える
5. 既存キーの名前を「Places API Key - iOS」に変更

## 補足

### 現在の他のセキュリティ対策

- **APIの制限**: Geocoding API と Places API (New) のみに制限済み
- **Quota（割り当て）制限**: Google Cloud Consoleで設定済み
- **予算アラート**: Google Cloud Consoleで設定済み

### ヘッダーの安全性について

HTTPヘッダーは偽装可能なため、完璧な保護ではない。
ただし「制限なし」と比べて大幅にリスクを軽減できる。
Quota制限・予算アラートと併用することで、個人開発規模では十分な保護となる。

### 参考

- [Google Maps Platform security guidance](https://developers.google.com/maps/api-security-best-practices)
- [API キーの制限を追加する](https://cloud.google.com/docs/authentication/api-keys)
