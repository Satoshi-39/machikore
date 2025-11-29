/**
 * 画像アップロード Edge Function
 *
 * クライアントから画像を受け取り、Storageに保存
 * 画像変換はSupabase Image Transformation機能を利用
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 認証トークン取得
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "認証が必要です" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Supabaseクライアント作成（Service Role Keyで全権限）
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ユーザー認証確認
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "認証に失敗しました" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // マルチパートフォームデータをパース
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const path = formData.get("path") as string | null;

    if (!file || !bucket || !path) {
      return new Response(
        JSON.stringify({ error: "file, bucket, pathが必要です" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      `[upload-image] 受信: bucket=${bucket}, path=${path}, size=${file.size}, type=${file.type}`
    );

    // 画像をArrayBufferとして読み込み
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Content-Typeを決定（クライアントから送られたものを使用）
    const contentType = file.type || "image/jpeg";

    // Storageにアップロード（Service Role Keyなので権限問題なし）
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, uint8Array, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload-image] アップロードエラー:", uploadError);
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    console.log(`[upload-image] 成功: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        path: path,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[upload-image] 例外:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
