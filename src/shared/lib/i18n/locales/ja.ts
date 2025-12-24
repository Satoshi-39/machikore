/**
 * 日本語翻訳ファイル
 */

export default {
  // 共通
  common: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    confirm: '確認',
    ok: 'OK',
    yes: 'はい',
    no: 'いいえ',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    retry: '再試行',
    search: '検索',
    back: '戻る',
    next: '次へ',
    done: '完了',
    all: 'すべて',
    none: 'なし',
    more: 'もっと見る',
    less: '閉じる',
  },

  // タブ
  tabs: {
    home: 'ホーム',
    discover: '発見',
    map: 'マップ',
    profile: 'プロフィール',
  },

  // 認証
  auth: {
    login: 'ログイン',
    logout: 'ログアウト',
    signup: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    forgotPassword: 'パスワードを忘れた方',
    loginRequired: 'ログインが必要です',
    loginRequiredMessage: 'この機能を使用するにはログインしてください',
    continueWithApple: 'Appleでサインイン',
    continueWithGoogle: 'Googleでサインイン',
  },

  // マップ
  map: {
    addMap: 'マップを追加',
    createMap: 'マップを作成',
    editMap: 'マップを編集',
    deleteMap: 'マップを削除',
    mapName: 'マップ名',
    mapDescription: '説明',
    mapCategory: 'カテゴリ',
    mapTags: 'タグ',
    publicMap: '公開',
    privateMap: '非公開',
    defaultMap: 'デフォルトマップ',
    deleteMapConfirm: 'このマップを削除しますか？',
    noMaps: 'マップがありません',
    createFirstMap: '最初のマップを作成しましょう',
  },

  // スポット
  spot: {
    addSpot: 'スポットを追加',
    createSpot: 'スポットを作成',
    editSpot: 'スポットを編集',
    deleteSpot: 'スポットを削除',
    spotName: 'スポット名',
    spotMemo: 'メモ',
    visitDate: '訪問日',
    visited: '訪問済み',
    notVisited: '未訪問',
    deleteSpotConfirm: 'このスポットを削除しますか？',
    noSpots: 'スポットがありません',
  },

  // お気に入り・いいね
  favorite: {
    favorite: 'お気に入り',
    favorites: 'お気に入り',
    addFavorite: 'お気に入りに追加',
    removeFavorite: 'お気に入りから削除',
    like: 'いいね',
    likes: 'いいね',
    liked: 'いいね済み',
  },

  // コメント
  comment: {
    comment: 'コメント',
    comments: 'コメント',
    addComment: 'コメントを追加',
    writeComment: 'コメントを書く...',
    deleteComment: 'コメントを削除',
    noComments: 'コメントはまだありません',
  },

  // プロフィール
  profile: {
    profile: 'プロフィール',
    editProfile: 'プロフィールを編集',
    username: 'ユーザー名',
    bio: '自己紹介',
    followers: 'フォロワー',
    following: 'フォロー中',
    follow: 'フォロー',
    unfollow: 'フォロー解除',
    posts: '投稿',
    maps: 'マップ',
    bookmarks: 'ブックマーク',
  },

  // 設定
  settings: {
    settings: '設定',
    account: 'アカウント',
    editProfile: 'プロフィール編集',
    changeEmail: 'メールアドレス変更',
    changePassword: 'パスワード変更',
    premium: 'プレミアム',
    premiumPlan: 'プレミアムプラン',
    subscribed: '加入中',
    notifications: '通知',
    notificationSettings: '通知設定',
    privacy: 'プライバシー',
    publicScope: '公開範囲',
    blockedUsers: 'ブロックしたユーザー',
    language: '言語',
    darkMode: 'ダークモード',
    other: 'その他',
    termsOfService: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
    help: 'ヘルプ',
    about: 'アプリについて',
    version: 'バージョン',
    accountActions: 'アカウント操作',
    signOut: 'サインアウト',
    signOutConfirm: 'サインアウトしてもよろしいですか？',
    deleteAccount: 'アカウント削除',
    comingSoon: '準備中',
    comingSoonMessage: 'この機能は準備中です。',
  },

  // 検索
  search: {
    search: '検索',
    searchPlaces: '場所を検索',
    searchUsers: 'ユーザーを検索',
    searchMaps: 'マップを検索',
    recentSearches: '最近の検索',
    noResults: '検索結果がありません',
  },

  // フィルター
  filter: {
    filter: 'フィルター',
    sortBy: '並び替え',
    newest: '新着順',
    popular: '人気順',
    nearby: '近い順',
    category: 'カテゴリ',
    region: '地域',
    prefecture: '都道府県',
  },

  // カテゴリ
  category: {
    gourmet: 'グルメ',
    shopping: 'ショッピング',
    tourism: '観光',
    culture: '文化/歴史',
    entertainment: 'エンタメ/娯楽',
    activity: 'アクティビティ/体験',
    lifestyle: '地域/暮らし',
    learning: '学習/教育',
    other: 'その他',
  },

  // エラーメッセージ
  errors: {
    networkError: 'ネットワークエラーが発生しました',
    unknownError: '予期しないエラーが発生しました',
    loadFailed: 'データの読み込みに失敗しました',
    saveFailed: '保存に失敗しました',
    deleteFailed: '削除に失敗しました',
    permissionDenied: '権限がありません',
    notFound: '見つかりませんでした',
  },

  // 成功メッセージ
  success: {
    saved: '保存しました',
    deleted: '削除しました',
    copied: 'コピーしました',
    posted: '投稿しました',
  },

  // 確認ダイアログ
  confirm: {
    deleteTitle: '削除の確認',
    deleteMessage: '本当に削除しますか？この操作は取り消せません。',
    logoutTitle: 'ログアウト',
    logoutMessage: 'ログアウトしますか？',
    unsavedChanges: '未保存の変更があります',
    unsavedChangesMessage: '保存せずに閉じますか？',
  },

  // 位置情報
  location: {
    currentLocation: '現在地',
    getLocation: '位置情報を取得',
    locationPermission: '位置情報の許可',
    locationPermissionMessage: 'この機能を使用するには位置情報の許可が必要です',
    directions: '経路',
    openInMaps: 'マップで開く',
  },

  // 画像
  image: {
    addPhoto: '写真を追加',
    takePhoto: '写真を撮る',
    chooseFromLibrary: 'ライブラリから選択',
    deletePhoto: '写真を削除',
  },

  // 空状態
  empty: {
    noData: 'データがありません',
    noMaps: 'マップがありません',
    noSpots: 'スポットがありません',
    noFollowers: 'フォロワーがいません',
    noFollowing: 'フォロー中のユーザーがいません',
  },
};
