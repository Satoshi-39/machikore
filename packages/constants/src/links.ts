/**
 * 共有URL・外部リンク設定
 * 全アプリ共通（mobile / web）
 */

/**
 * 共有用のWebサイトドメイン
 * OGP対応のUniversal Links用
 */
export const SHARE_DOMAIN = 'https://machikore.io';

/**
 * 共有URLを生成
 * URL構造: /{username}/maps/{mapId}/spots/{spotId}
 */
export const SHARE_URLS = {
  /** マップの共有URL */
  map: (username: string, mapId: string) =>
    `${SHARE_DOMAIN}/${username}/maps/${mapId}`,
  /** スポットの共有URL */
  spot: (username: string, mapId: string, spotId: string) =>
    `${SHARE_DOMAIN}/${username}/maps/${mapId}/spots/${spotId}`,
} as const;

export const EXTERNAL_LINKS = {
  /** ヘルプ（Notion） */
  HELP: 'https://cobalt-aurora-096.notion.site/2d6b92c6afac80fc8004fa756426ed7f?pvs=74',
  /** 利用規約 */
  TERMS: 'https://machikore.io/terms',
  /** プライバシーポリシー */
  PRIVACY: 'https://machikore.io/privacy',
  /** サポート・お問い合わせ */
  SUPPORT: 'https://machikore.io/support',
  /** 特定商取引法に基づく表記 */
  TOKUSHOHO: 'https://machikore.io/tokushoho',
  /** 使い方ガイド */
  GUIDE: 'https://machikore.io/guide',
} as const;
