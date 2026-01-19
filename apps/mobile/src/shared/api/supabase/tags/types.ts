/**
 * タグの型定義
 */

export interface Tag {
  id: string;
  name: string;
  name_translations: { [key: string]: string } | null;
  slug: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface MapTag {
  id: string;
  map_id: string;
  tag_id: string;
  created_at: string;
}

export interface SpotTag {
  id: string;
  user_spot_id: string;
  tag_id: string;
  created_at: string;
}
