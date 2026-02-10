/**
 * 埋め込みコンテンツの型定義
 */

/** サポートするプロバイダー（リッチ埋め込み） */
export type EmbedProvider = 'youtube' | 'x' | 'instagram';

/** 埋め込みノードのプロバイダー種別（リッチ埋め込み + リンクカード + アプリ内カード） */
export type EmbedNodeProvider = EmbedProvider | 'link_card' | 'map_card' | 'spot_card';

/** プロバイダーの設定 */
export interface EmbedProviderConfig {
  /** プロバイダー名 */
  name: string;
  /** URLからIDを抽出する正規表現パターン */
  urlPatterns: RegExp[];
  /** サムネイルURLを生成する関数（IDから） */
  getThumbnailUrl: (id: string) => string | null;
  /** 埋め込みURLを生成する関数（IDから） */
  getEmbedUrl: (id: string) => string;
}

/** 埋め込みノードの属性 */
export interface EmbedAttrs {
  /** プロバイダー種別 */
  provider: EmbedNodeProvider;
  /** 元のURL */
  url: string;
  /** 埋め込みID（動画ID等） */
  embedId: string;
  /** サムネイルURL（リンクカードの場合はogImage） */
  thumbnailUrl: string | null;
  /** OGPタイトル（link_cardのみ） */
  ogTitle?: string | null;
  /** OGP説明文（link_cardのみ） */
  ogDescription?: string | null;
}

/** URLの解析結果 */
export interface ParsedEmbed {
  provider: EmbedProvider;
  embedId: string;
  thumbnailUrl: string | null;
}
