/**
 * 記事コンテンツ生成
 *
 * ProseMirror JSON 形式の記事コンテンツを生成し、user_spots / maps に設定
 */

import type { SupabaseClient } from "@supabase/supabase-js";

interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

interface ProseMirrorDoc {
  type: "doc";
  content: ProseMirrorNode[];
}

/**
 * テキストからProseMirror JSON ドキュメントを生成
 * 段落間に空のparagraphを挿入して余白を確保
 */
function createProseMirrorDoc(text: string): ProseMirrorDoc {
  // \n\n で段落分割
  const paragraphs = text
    .split("\n\n")
    .map((block) => block.trim())
    .filter((block) => block !== "");

  const content: ProseMirrorNode[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    // テキスト段落
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: paragraphs[i] }],
    });

    // 段落間に空行を挿入（最後の段落の後には入れない）
    if (i < paragraphs.length - 1) {
      content.push({ type: "paragraph" });
    }
  }

  return { type: "doc", content };
}

/**
 * user_spots の article_content を設定
 */
export async function setSpotArticle(
  supabase: SupabaseClient,
  userSpotId: string,
  description: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(
      `        🔍 [DRY RUN] 記事設定: ${description.substring(0, 30)}...`
    );
    return;
  }

  const doc = createProseMirrorDoc(description);

  const { error } = await supabase
    .from("user_spots")
    .update({ article_content: doc as unknown as Record<string, unknown> })
    .eq("id", userSpotId);

  if (error) {
    console.warn(`        ⚠️ 記事設定失敗 (${userSpotId}): ${error.message}`);
  }
}

/**
 * maps の article_intro を設定
 */
export async function setMapArticleIntro(
  supabase: SupabaseClient,
  mapId: string,
  description: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(
      `      🔍 [DRY RUN] マップ紹介文設定: ${description.substring(0, 30)}...`
    );
    return;
  }

  const doc = createProseMirrorDoc(description);

  const { error } = await supabase
    .from("maps")
    .update({ article_intro: doc as unknown as Record<string, unknown> })
    .eq("id", mapId);

  if (error) {
    console.warn(`      ⚠️ マップ紹介文設定失敗 (${mapId}): ${error.message}`);
  }
}
