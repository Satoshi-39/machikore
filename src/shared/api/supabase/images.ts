/**
 * Supabase Images API
 * スポット画像の保存・取得
 */

import { supabase } from './client';
import type { Database } from '@/shared/types/supabase.generated';

type ImageInsert = Database['public']['Tables']['images']['Insert'];
type ImageRow = Database['public']['Tables']['images']['Row'];

/**
 * スポット画像をimagesテーブルに保存
 */
export async function insertSpotImage(image: ImageInsert): Promise<ImageRow> {
  const { data, error } = await supabase
    .from('images')
    .insert(image)
    .select()
    .single();

  if (error) {
    console.error('[insertSpotImage] Error:', error);
    throw error;
  }

  return data;
}

/**
 * 複数のスポット画像をimagesテーブルに保存
 */
export async function insertSpotImages(images: ImageInsert[]): Promise<ImageRow[]> {
  const { data, error } = await supabase
    .from('images')
    .insert(images)
    .select();

  if (error) {
    console.error('[insertSpotImages] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * スポットIDで画像一覧を取得
 */
export async function getSpotImages(spotId: string): Promise<ImageRow[]> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('spot_id', spotId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('[getSpotImages] Error:', error);
    throw error;
  }

  return data || [];
}

/**
 * 画像を削除
 */
export async function deleteSpotImage(imageId: string): Promise<void> {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('[deleteSpotImage] Error:', error);
    throw error;
  }
}
