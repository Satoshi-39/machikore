# シードアカウント管理

リリース初期のコンテンツ充実のためのデモアカウント管理。

## ファイル

- `seed-accounts.csv` - アカウントのペルソナ定義

## Google Sheetsへのインポート

1. [Google Sheets](https://sheets.google.com) を開く
2. 新規スプレッドシートを作成
3. ファイル → インポート → アップロード
4. `seed-accounts.csv` を選択
5. 「スプレッドシートを置換する」を選択

## カラム説明

| カラム | 説明 | 用途 |
|--------|------|------|
| id | 連番 | 管理用 |
| auth_type | 認証タイプ | google / apple |
| email | メールアドレス | アカウント作成用 |
| password | パスワード | 作成後に記入 |
| last_name | 姓 | Google/Apple登録用 |
| first_name | 名 | Google/Apple登録用 |
| birth_date | 生年月日 | Google/Apple登録用 |
| username | ユーザー名 | アプリ内表示 |
| display_name | 表示名 | アプリ内表示 |
| gender | 性別 | デモグラフィック |
| age_group | 年代 | デモグラフィック |
| country | 国 | デモグラフィック |
| prefecture | 都道府県 | デモグラフィック |
| bio | 自己紹介 | プロフィール |
| interests | 趣味・興味 | コンテンツ方向性 |
| content_plan | 投稿予定コンテンツ | マップ作成計画 |
| status | ステータス | 未作成/作成済み/投稿済み |

## 注意事項

- **パスワードは記入後、このファイルをGitにコミットしないこと**
- Google Sheetsで管理し、CSVはテンプレートとして使用
- 電話番号認証が必要な場合、1番号で約4-5アカウントまで

## アカウント作成手順

1. Google/Appleアカウント作成サイトへアクセス
2. CSVの情報を元に登録
3. パスワードをスプレッドシートに記録
4. アプリでログイン
5. デモグラフィック情報を入力
6. プロフィールを設定
7. マップ・スポットを投稿
8. statusを「投稿済み」に更新
