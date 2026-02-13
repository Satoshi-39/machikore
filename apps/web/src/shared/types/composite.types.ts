/**
 * 複合型（JOINクエリ結果）
 *
 * モバイル版から移植。Web版に必要な型のみ定義。
 */

import type { Database, Json } from "@machikore/database";

// ===============================
// ThumbnailCrop
// ===============================

/**
 * サムネイルのクロップ座標（DB保存用）
 */
export interface ThumbnailCrop {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Json → ThumbnailCrop に型安全に変換
 */
export function parseThumbnailCrop(
  value: Json | null | undefined
): ThumbnailCrop | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (
    typeof obj.originX !== "number" ||
    typeof obj.originY !== "number" ||
    typeof obj.width !== "number" ||
    typeof obj.height !== "number" ||
    typeof obj.imageWidth !== "number" ||
    typeof obj.imageHeight !== "number"
  )
    return null;
  return {
    originX: obj.originX,
    originY: obj.originY,
    width: obj.width,
    height: obj.height,
    imageWidth: obj.imageWidth,
    imageHeight: obj.imageHeight,
  };
}

// ===============================
// ProseMirror/TipTap JSON型
// ===============================

export interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export interface ProseMirrorDoc {
  type: "doc";
  content: ProseMirrorNode[];
}

/**
 * ProseMirror JSONからプレーンテキストを抽出
 */
export function extractPlainText(
  doc: ProseMirrorDoc | null | undefined
): string {
  if (!doc || !doc.content) return "";

  const extractFromNode = (node: ProseMirrorNode): string => {
    if (node.text) return node.text;
    if (!node.content) return "";
    return node.content.map(extractFromNode).join("");
  };

  return doc.content
    .map((node) => extractFromNode(node))
    .join("\n")
    .trim();
}

/**
 * JSON文字列をProseMirrorDocにパース（安全に）
 */
export function parseProseMirrorDoc(
  jsonValue: string | Json | null | undefined
): ProseMirrorDoc | null {
  if (!jsonValue) return null;
  try {
    const parsed =
      typeof jsonValue === "string" ? JSON.parse(jsonValue) : jsonValue;
    if (parsed && parsed.type === "doc" && Array.isArray(parsed.content)) {
      return parsed as ProseMirrorDoc;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * ProseMirror JSONから画像URLを抽出
 */
export function extractImageUrls(
  doc: ProseMirrorDoc | null | undefined
): string[] {
  if (!doc || !doc.content) return [];

  const urls: string[] = [];

  const extractFromNode = (node: ProseMirrorNode): void => {
    if (node.type === "image" && node.attrs?.src) {
      urls.push(node.attrs.src as string);
    }
    if (node.content) {
      node.content.forEach(extractFromNode);
    }
  };

  doc.content.forEach(extractFromNode);
  return urls;
}

// ===============================
// ユーザー情報（共通）
// ===============================

export interface UserBasicInfo {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  avatar_crop: ThumbnailCrop | null;
}

// ===============================
// タグ情報（共通）
// ===============================

export interface TagBasicInfo {
  id: string;
  name: string;
  slug: string;
}

/**
 * Json → TagBasicInfo[] に型安全に変換
 */
export function parseTagsArray(
  value: Json | null | undefined
): TagBasicInfo[] {
  if (!Array.isArray(value)) return [];
  const result: TagBasicInfo[] = [];
  for (const item of value) {
    if (
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.slug === "string"
    ) {
      result.push({ id: item.id, name: item.name, slug: item.slug });
    }
  }
  return result;
}

// ===============================
// マップ複合型
// ===============================

type MapRow = Database["public"]["Tables"]["maps"]["Row"];

/**
 * MapWithUser - マップ + ユーザー情報
 *
 * article_intro / article_outro はマッパー層でパース済みの ProseMirrorDoc に変換するため、
 * thumbnail_crop は ThumbnailCrop に変換するため、MapRow の Json 型をオーバーライドする
 */
export interface MapWithUser
  extends Omit<
    MapRow,
    "article_intro" | "article_outro" | "thumbnail_crop" | "moderation_status"
  > {
  article_intro: ProseMirrorDoc | null;
  article_outro: ProseMirrorDoc | null;
  thumbnail_crop: ThumbnailCrop | null;
  moderation_status?: MapRow["moderation_status"];
  user: UserBasicInfo | null;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  tags?: TagBasicInfo[];
}

// ===============================
// マスタースポット情報
// ===============================

export interface MasterSpotBasicInfo {
  id: string;
  name: Json;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: Json | null;
  google_short_address: Json | null;
  google_types: string[] | null;
}

// ===============================
// マップラベル情報
// ===============================

export interface MapLabelBasicInfo {
  id: string;
  name: string;
  color: string;
}

// ===============================
// スポット複合型
// ===============================

export interface SpotWithDetails {
  id: string;
  user_id: string;
  map_id: string;
  master_spot_id: string | null;
  machi_id: string | null;
  description: string;
  spot_color: string | null;
  label_id?: string | null;
  map_label?: MapLabelBasicInfo | null;
  name?: string | null;
  language?: string;
  images_count: number;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
  latitude?: number | null;
  longitude?: number | null;
  google_formatted_address?: Json | null;
  google_short_address?: Json | null;
  master_spot: MasterSpotBasicInfo | null;
  user: UserBasicInfo | null;
  article_content?: ProseMirrorDoc | null;
  image_urls?: string[];
  is_public?: boolean;
  tags?: TagBasicInfo[];
  thumbnail_image_id?: string | null;
  thumbnail_crop?: ThumbnailCrop | null;
}

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
 * マップ記事データ
 */
export interface MapArticleData {
  map: MapWithUser;
  spots: SpotWithImages[];
}
