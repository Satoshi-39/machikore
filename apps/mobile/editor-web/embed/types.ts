/**
 * 埋め込みプロバイダーの共通型定義
 */

/** サポートするプロバイダー */
export type EmbedProvider = 'youtube' | 'x' | 'instagram' | 'niconico';

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
