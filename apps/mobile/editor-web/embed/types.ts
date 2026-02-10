/**
 * 埋め込みプロバイダーの共通型定義
 */

/** サポートするプロバイダー（リッチ埋め込み） */
export type EmbedProvider = 'youtube' | 'x' | 'instagram';

/** 埋め込みノードのプロバイダー種別（リッチ埋め込み + リンクカード + アプリ内カード） */
export type EmbedNodeProvider = EmbedProvider | 'link_card' | 'map_card' | 'spot_card';

/** プロバイダー設定インターフェース */
export interface EmbedProviderConfig {
  /** プロバイダー名（表示用） */
  name: string;
  /** URL判定用の正規表現パターン */
  urlPatterns: RegExp[];
  /** サムネイルURLを取得（取得不可の場合はnull） */
  getThumbnailUrl: (id: string) => string | null;
  /** プレビュー要素を生成 */
  createPreview: (embedId: string, url: string) => HTMLElement;
}

/** URL解析結果 */
export interface ParsedEmbed {
  provider: EmbedProvider;
  embedId: string;
}
