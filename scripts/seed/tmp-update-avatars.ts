/**
 * 既存シードユーザーにアバターを一括設定する一時スクリプト
 *
 * 使い方: npx tsx scripts/seed/tmp-update-avatars.ts
 */

import "dotenv/config";
import { createAdminClient } from "./lib/supabase-admin";
import { personas } from "./config/personas";

async function main() {
  const supabase = createAdminClient();

  for (const persona of personas) {
    const { username, email, avatar_keyword } = persona.user;

    // ユーザー取得
    const { data: users } = await supabase
      .from("users")
      .select("id, avatar_url")
      .eq("email", email)
      .limit(1);

    if (!users || users.length === 0) {
      console.log(`⏭️  ${username}: ユーザーが存在しません（スキップ）`);
      continue;
    }

    const user = users[0];

    if (user.avatar_url) {
      console.log(`⏭️  ${username}: アバター設定済み（スキップ）`);
      continue;
    }

    // Unsplash で画像検索
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error("❌ UNSPLASH_ACCESS_KEY が未設定です");
      process.exit(1);
    }

    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(avatar_keyword)}&per_page=1&orientation=squarish`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!searchRes.ok) {
      console.warn(`⚠️  ${username}: Unsplash検索失敗 (${searchRes.status})`);
      continue;
    }

    const searchData = await searchRes.json();
    if (!searchData.results?.length) {
      console.warn(`⚠️  ${username}: 検索結果なし "${avatar_keyword}"`);
      continue;
    }

    const photo = searchData.results[0];
    const imageUrl = `${photo.urls.raw}&w=384&h=384&fit=crop&q=80&fm=jpg`;

    console.log(`📷 ${username}: "${avatar_keyword}" (by ${photo.user.name})`);

    // 画像ダウンロード
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      console.warn(`⚠️  ${username}: 画像ダウンロード失敗`);
      continue;
    }

    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

    // Supabase Storage にアップロード
    const filePath = `${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, imageBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`⚠️  ${username}: アップロード失敗 - ${uploadError.message}`);
      continue;
    }

    // 公開URL取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // users テーブル更新
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.warn(`⚠️  ${username}: DB更新失敗 - ${updateError.message}`);
      continue;
    }

    console.log(`✅ ${username}: アバター設定完了`);

    // Unsplash APIレートリミット対策（50req/hr）
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\n🎉 完了！");
}

main().catch(console.error);
