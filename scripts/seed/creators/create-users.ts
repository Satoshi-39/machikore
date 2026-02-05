/**
 * ユーザー作成
 *
 * Supabase Auth でユーザー作成 → public.users に upsert
 * Unsplash API でアバター画像を取得 → Supabase Storage にアップロード
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserDef } from "../config/personas";
import { randomBytes } from "crypto";

interface CreateUserResult {
  userId: string;
  created: boolean;
}

/**
 * ペルソナのユーザー定義からSupabase Auth + public.users を作成
 * 既存ユーザーはスキップ
 */
export async function createUser(
  supabase: SupabaseClient,
  userDef: UserDef,
  dryRun: boolean
): Promise<CreateUserResult> {
  // メールで既存チェック
  const { data: existingUsers } = await supabase
    .from("users")
    .select("id")
    .eq("email", userDef.email)
    .limit(1);

  if (existingUsers && existingUsers.length > 0) {
    console.log(`  ⏭️  ユーザー ${userDef.username} は既に存在（スキップ）`);
    return { userId: existingUsers[0].id, created: false };
  }

  if (dryRun) {
    console.log(`  🔍 [DRY RUN] ユーザー作成: ${userDef.username} (${userDef.email})`);
    return { userId: "dry-run-id", created: false };
  }

  // ランダムパスワード生成（シードユーザーなのでログイン不要）
  const password = randomBytes(32).toString("hex");

  // Supabase Auth でユーザー作成
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: userDef.email,
      password,
      email_confirm: true,
    });

  if (authError) {
    // 既にAuthに存在する場合
    if (authError.message.includes("already been registered")) {
      // Auth側にはいるがpublic.usersにはない場合、Auth側のIDを取得
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingAuth = listData?.users.find(
        (u) => u.email === userDef.email
      );
      if (existingAuth) {
        console.log(
          `  ⏭️  Auth ユーザー ${userDef.username} は既に存在、public.users を upsert`
        );
        await upsertPublicUser(supabase, existingAuth.id, userDef);
        return { userId: existingAuth.id, created: false };
      }
    }
    throw new Error(
      `Auth ユーザー作成失敗 (${userDef.email}): ${authError.message}`
    );
  }

  const userId = authData.user.id;

  // アバター画像をアップロード
  const avatarUrl = await uploadAvatarFromUnsplash(
    supabase,
    userId,
    userDef.avatar_keyword
  );

  // public.users に upsert（アバターURL含む）
  await upsertPublicUser(supabase, userId, userDef, avatarUrl);

  console.log(`  ✅ ユーザー作成: ${userDef.username} (${userId})`);
  return { userId, created: true };
}

/**
 * Unsplash API で画像を検索し、Supabase Storage にアップロード
 * アバターサイズ: 384px（アプリの設定に合わせる）
 */
async function uploadAvatarFromUnsplash(
  supabase: SupabaseClient,
  userId: string,
  keyword: string
): Promise<string | null> {
  const accessKey =
    process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn(
      "  ⚠️ UNSPLASH_ACCESS_KEY が未設定のためアバタースキップ"
    );
    return null;
  }

  try {
    // Unsplash Search API で画像を検索
    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=squarish`;
    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!searchResponse.ok) {
      console.warn(
        `  ⚠️ Unsplash検索失敗 (${searchResponse.status}): ${keyword}`
      );
      return null;
    }

    const searchData = await searchResponse.json();
    if (!searchData.results || searchData.results.length === 0) {
      console.warn(`  ⚠️ Unsplash検索結果なし: "${keyword}"`);
      return null;
    }

    const photo = searchData.results[0];
    // raw URLに384pxサイズ・JPEG品質80%・クロップを指定してダウンロード
    const imageUrl = `${photo.urls.raw}&w=384&h=384&fit=crop&q=80&fm=jpg`;

    console.log(
      `  📷 アバター取得中: "${keyword}" (by ${photo.user.name})`
    );

    // 画像をダウンロード
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.warn(`  ⚠️ 画像ダウンロード失敗: ${imageResponse.status}`);
      return null;
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Supabase Storage にアップロード（アプリと同じパスパターン）
    const filePath = `${userId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, imageBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`  ⚠️ アバターアップロード失敗: ${uploadError.message}`);
      return null;
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    console.log(`  🖼️ アバター設定完了: ${filePath}`);
    return publicUrl;
  } catch (error) {
    console.warn(
      `  ⚠️ アバター処理エラー: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

async function upsertPublicUser(
  supabase: SupabaseClient,
  userId: string,
  userDef: UserDef,
  avatarUrl?: string | null
): Promise<void> {
  const userData: Record<string, unknown> = {
    id: userId,
    email: userDef.email,
    username: userDef.username,
    display_name: userDef.display_name,
    bio: userDef.bio,
    gender: userDef.gender,
    age_group: userDef.age_group,
    country: userDef.country,
    prefecture: userDef.prefecture,
    status: "active",
  };

  if (avatarUrl) {
    userData.avatar_url = avatarUrl;
  }

  const { error } = await supabase.from("users").upsert(userData, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(`public.users upsert 失敗: ${error.message}`);
  }
}
