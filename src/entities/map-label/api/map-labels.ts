/**
 * マップラベル API
 *
 * FSD: entities/map-label/api に配置
 */

import { supabase } from '@/shared/api/supabase/client';
import type { Database } from '@/shared/types/database.types';

type MapLabelRow = Database['public']['Tables']['map_labels']['Row'];
type MapLabelInsert = Database['public']['Tables']['map_labels']['Insert'];
type MapLabelUpdate = Database['public']['Tables']['map_labels']['Update'];

/**
 * マップのラベル一覧を取得
 */
export async function getMapLabels(mapId: string): Promise<MapLabelRow[]> {
  const { data, error } = await supabase
    .from('map_labels')
    .select('*')
    .eq('map_id', mapId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch map labels: ${error.message}`);
  }

  return data ?? [];
}

/**
 * ラベルを作成
 */
export async function createMapLabel(
  params: Omit<MapLabelInsert, 'id' | 'created_at' | 'updated_at'>
): Promise<MapLabelRow> {
  const { data, error } = await supabase
    .from('map_labels')
    .insert(params)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create map label: ${error.message}`);
  }

  return data;
}

/**
 * ラベルを更新
 */
export async function updateMapLabel(
  id: string,
  params: Omit<MapLabelUpdate, 'id' | 'created_at' | 'updated_at'>
): Promise<MapLabelRow> {
  const { data, error } = await supabase
    .from('map_labels')
    .update(params)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update map label: ${error.message}`);
  }

  return data;
}

/**
 * ラベルを削除
 */
export async function deleteMapLabel(id: string): Promise<void> {
  const { error } = await supabase
    .from('map_labels')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete map label: ${error.message}`);
  }
}

/**
 * ラベルを取得または作成（名前で検索し、なければ作成）
 */
export async function getOrCreateMapLabel(
  mapId: string,
  name: string,
  color?: string
): Promise<MapLabelRow> {
  // まず既存のラベルを検索
  const { data: existing } = await supabase
    .from('map_labels')
    .select('*')
    .eq('map_id', mapId)
    .eq('name', name)
    .single();

  if (existing) {
    return existing;
  }

  // なければ作成
  return createMapLabel({
    map_id: mapId,
    name,
    color: color ?? 'blue',
    sort_order: 0,
  });
}
