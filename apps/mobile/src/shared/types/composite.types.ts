/**
 * 複合型（JOINクエリ結果）
 *
 * 複数のテーブルを結合した結果の型定義
 * FSD: shared/types に配置（複数entityにまたがるため）
 */

import type { Database, Json } from './database.types';

// ===============================
// ProseMirror/TipTap JSON型
// ===============================

/**
 * ProseMirror JSONのノード型
 * TipTapエディタで使用するJSON形式
 */
export interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

/**
 * ProseMirror JSONドキュメント型
 */
export interface ProseMirrorDoc {
  type: 'doc';
  content: ProseMirrorNode[];
}

/**
 * ProseMirror JSONからプレーンテキストを抽出
 */
export function extractPlainText(doc: ProseMirrorDoc | null | undefined): string {
  if (!doc || !doc.content) return '';

  const extractFromNode = (node: ProseMirrorNode): string => {
    if (node.text) return node.text;
    if (!node.content) return '';
    return node.content.map(extractFromNode).join('');
  };

  return doc.content
    .map((node) => extractFromNode(node))
    .join('\n')
    .trim();
}

/**
 * JSON文字列をProseMirrorDocにパース（安全に）
 * RPC結果などの文字列形式のJSONをオブジェクトに変換する際に使用
 */
export function parseProseMirrorDoc(jsonString: string | null | undefined): ProseMirrorDoc | null {
  if (!jsonString) return null;
  try {
    const parsed = JSON.parse(jsonString);
    // 基本的な構造チェック
    if (parsed && parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// ===============================
// ユーザー情報（共通）
// ===============================

/**
 * JOINで取得するユーザー基本情報
 */
export interface UserBasicInfo {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

// ===============================
// タグ情報（共通）
// ===============================

/**
 * JOINで取得するタグ基本情報
 */
export interface TagBasicInfo {
  id: string;
  name: string;
  slug: string;
}

// ===============================
// マップ複合型
// ===============================

// MergeDeepで拡張されたDatabase型からマップのRow型を取得
type MapRow = Database['public']['Tables']['maps']['Row'];

/**
 * MapWithUser - マップ + ユーザー情報
 *
 * maps JOIN users の結果
 * MapRowを継承し、userとUI用のフラグを追加
 */
export interface MapWithUser extends MapRow {
  user: UserBasicInfo | null;
  /** 現在のユーザーがこのマップにいいねしているか */
  is_liked?: boolean;
  /** 現在のユーザーがこのマップをブックマークしているか */
  is_bookmarked?: boolean;
  /** マップに関連付けられたタグ */
  tags?: TagBasicInfo[];
}

// ===============================
// マスタースポット情報（共通）
// ===============================

/**
 * JOINで取得するマスタースポット基本情報
 * name・住所フィールドはJSONB型（多言語対応）
 */
export interface MasterSpotBasicInfo {
  id: string;
  name: Json; // スポット名（JSONB: {"ja": "...", "en": "..."}）
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: Json | null; // 完全住所（JSONB: {"ja": "...", "en": "..."}）
  google_short_address: Json | null; // 短縮住所（JSONB: {"ja": "...", "en": "..."}）
  google_types: string[] | null;
}

// ===============================
// スポット複合型
// ===============================

/**
 * SpotWithDetails - スポット + マスタースポット + ユーザー情報 + いいね状態
 *
 * spots JOIN master_spots JOIN users の結果
 * is_liked は現在のユーザーがいいねしているかを示す
 */
/**
 * JOINで取得するマップ基本情報
 */
export interface MapBasicInfo {
  id: string;
  name: string;
}

/**
 * JOINで取得するマップラベル情報
 */
export interface MapLabelBasicInfo {
  id: string;
  name: string;
  color: string;
}

export interface SpotWithDetails {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string | null;
  machi_id: string | null;
  description: string;
  /** スポットの色（pink, red, orange, yellow, green, blue, purple, gray, white） */
  spot_color: string | null;
  /** ラベルID（ラベルが設定されている場合、その色が優先される） */
  label_id?: string | null;
  /** JOINで取得したラベル情報（id, name, color） */
  map_label?: MapLabelBasicInfo | null;
  /** ピン刺し・現在地登録の場合のスポット名（master_spotがない場合に使用、JSONB型） */
  name?: Json | null;
  images_count: number;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  /** ピン刺し・現在地登録の場合の座標（master_spotがない場合に使用） */
  latitude?: number | null;
  longitude?: number | null;
  /** ピン刺し・現在地登録の場合の住所（master_spotがない場合に使用、JSONB型） */
  google_formatted_address?: Json | null; // 完全住所（JSONB: {"ja": "...", "en": "..."}）
  google_short_address?: Json | null; // 短縮住所（JSONB: {"ja": "...", "en": "..."}）
  master_spot: MasterSpotBasicInfo | null;
  user: UserBasicInfo | null;
  /** 所属するマップの情報 */
  map?: MapBasicInfo | null;
  /** 現在のユーザーがこのスポットにいいねしているか */
  is_liked?: boolean;
  /** 現在のユーザーがこのスポットをブックマークしているか */
  is_bookmarked?: boolean;
  /** マップ記事用の紹介文（ProseMirror JSON形式） */
  article_content?: ProseMirrorDoc | null;
  /** スポット画像のURL配列（フィード表示用、JOINで取得） */
  image_urls?: string[];
  /** スポットが公開されているか（デフォルト: true） */
  is_public?: boolean;
  /** スポットに紐づくタグ */
  tags?: TagBasicInfo[];
}

// ===============================
// マップ記事用複合型
// ===============================

/**
 * スポット + 画像（記事表示用）
 */
export interface SpotWithImages extends SpotWithDetails {
  images: {
    id: string;
    cloud_path: string | null;
    order_index: number;
  }[];
}

/**
 * マップ記事データ（マップ + スポット一覧 + 画像）
 */
export interface MapArticleData {
  map: MapWithUser;
  spots: SpotWithImages[];
}

