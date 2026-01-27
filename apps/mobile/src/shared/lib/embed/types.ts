/**
 * 埋め込みコンテンツの型定義
 */

/** サポートするプロバイダー */
export type EmbedProvider = 'youtube' | 'x' | 'instagram' | 'niconico';

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
  provider: EmbedProvider;
  /** 元のURL */
  url: string;
  /** 埋め込みID（動画ID等） */
  embedId: string;
  /** サムネイルURL */
  thumbnailUrl: string | null;
}

/** URLの解析結果 */
export interface ParsedEmbed {
  provider: EmbedProvider;
  embedId: string;
  thumbnailUrl: string | null;
}
