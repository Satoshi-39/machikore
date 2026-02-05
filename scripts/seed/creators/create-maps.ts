/**
 * マップ作成
 *
 * maps テーブルに INSERT + tags / map_tags を作成
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MapDef } from "../config/personas";

interface CreateMapResult {
  mapId: string;
  created: boolean;
}

/**
 * マップを作成（既存の場合はスキップ）
 */
export async function createMap(
  supabase: SupabaseClient,
  userId: string,
  mapDef: MapDef,
  dryRun: boolean
): Promise<CreateMapResult> {
  // user_id + name で重複チェック
  const { data: existing } = await supabase
    .from("maps")
    .select("id")
    .eq("user_id", userId)
    .eq("name", mapDef.name)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log(`    ⏭️  マップ「${mapDef.name}」は既に存在（スキップ）`);
    return { mapId: existing[0].id, created: false };
  }

  if (dryRun) {
    console.log(
      `    🔍 [DRY RUN] マップ作成: ${mapDef.name} (カテゴリ: ${mapDef.category_id})`
    );
    return { mapId: "dry-run-map-id", created: false };
  }

  // マップ作成
  const { data: mapData, error: mapError } = await supabase
    .from("maps")
    .insert({
      user_id: userId,
      name: mapDef.name,
      description: mapDef.description,
      category_id: mapDef.category_id,
      is_public: true,
      language: "ja",
    })
    .select("id")
    .single();

  if (mapError) {
    throw new Error(`マップ作成失敗「${mapDef.name}」: ${mapError.message}`);
  }

  const mapId = mapData.id;

  // タグの作成・紐付け
  await createAndLinkTags(supabase, mapId, mapDef.tags);

  console.log(`    ✅ マップ作成: ${mapDef.name} (${mapId})`);
  return { mapId, created: true };
}

/**
 * タグを getOrCreate パターンで作成し、map_tags に紐付け
 */
async function createAndLinkTags(
  supabase: SupabaseClient,
  mapId: string,
  tagNames: string[]
): Promise<void> {
  for (const tagName of tagNames) {
    const slug = tagName; // 日本語タグはそのままslugとして使用

    // 既存タグ検索
    let { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .limit(1)
      .single();

    let tagId: string;

    if (existingTag) {
      tagId = existingTag.id;
    } else {
      // タグ作成
      const { data: newTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: tagName, slug })
        .select("id")
        .single();

      if (tagError) {
        // 競合の場合はリトライ
        const { data: retryTag } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .limit(1)
          .single();

        if (!retryTag) {
          console.warn(`      ⚠️ タグ作成失敗: ${tagName} (${tagError.message})`);
          continue;
        }
        tagId = retryTag.id;
      } else {
        tagId = newTag.id;
      }
    }

    // map_tags に紐付け（重複チェック）
    const { data: existingLink } = await supabase
      .from("map_tags")
      .select("id")
      .eq("map_id", mapId)
      .eq("tag_id", tagId)
      .limit(1);

    if (!existingLink || existingLink.length === 0) {
      const { error: linkError } = await supabase
        .from("map_tags")
        .insert({ map_id: mapId, tag_id: tagId });

      if (linkError) {
        console.warn(
          `      ⚠️ map_tags 紐付け失敗: ${tagName} (${linkError.message})`
        );
      }
    }
  }
}
