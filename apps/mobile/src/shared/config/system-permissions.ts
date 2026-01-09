/**
 * 許可関連の設定
 *
 * プッシュ通知、位置情報などの許可リクエストのタイミングと
 * 事前説明UIの設定を一元管理
 */

/**
 * 許可のトリガータイミング
 */
export type PermissionTrigger =
  | 'after_first_post' // 初投稿後
  | 'on_map_view' // 地図表示時
  | 'on_image_pick'; // 画像選択時

/**
 * プッシュ通知の許可設定
 */
export const PUSH_NOTIFICATION_CONFIG = {
  /** 事前説明UIを表示するか */
  showPrePrompt: true,
  /** トリガータイミング */
  trigger: 'after_first_post' as PermissionTrigger,
  /** 「あとで」選択後、何回目の投稿で再表示するか */
  retryAfterPostCount: 5,
  /** 事前説明UIのi18nキー */
  prePromptKeys: {
    title: 'permissions.pushNotification.title',
    message: 'permissions.pushNotification.message',
    acceptButton: 'permissions.pushNotification.accept',
    laterButton: 'permissions.pushNotification.later',
  },
} as const;

/**
 * 位置情報の許可設定
 */
export const LOCATION_CONFIG = {
  /** 事前説明UIを表示するか */
  showPrePrompt: false,
  /** トリガータイミング */
  trigger: 'on_map_view' as PermissionTrigger,
} as const;

/**
 * カメラ/フォトライブラリの許可設定
 */
export const CAMERA_CONFIG = {
  /** 事前説明UIを表示するか */
  showPrePrompt: false,
  /** トリガータイミング */
  trigger: 'on_image_pick' as PermissionTrigger,
} as const;

/**
 * 全許可設定をまとめたオブジェクト
 */
export const PERMISSION_CONFIG = {
  pushNotification: PUSH_NOTIFICATION_CONFIG,
  location: LOCATION_CONFIG,
  camera: CAMERA_CONFIG,
} as const;
