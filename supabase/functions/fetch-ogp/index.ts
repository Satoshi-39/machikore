/**
 * OGPフェッチ Edge Function
 *
 * 任意のURLからOGP情報（og:title, og:description, og:image）を取得する
 * OG画像は外部URLからダウンロードし、Supabase Storageに再アップロードして自社CDNから配信する
 * 記事エディタの汎用リンクカード埋め込み機能で使用
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

interface FetchOgpRequest {
  url: string;
}

interface FetchOgpResponse {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

const FETCH_TIMEOUT_MS = 5000;
const MAX_BODY_BYTES = 100 * 1024; // 100KB
const IMAGE_FETCH_TIMEOUT_MS = 8000;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const OG_THUMBNAILS_BUCKET = "og-thumbnails";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

/** プライベートIPアドレスかどうかをチェック（SSRF対策） */
function isPrivateHost(hostname: string): boolean {
  // localhost
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    return true;
  }
  // 10.0.0.0/8
  if (/^10\./.test(hostname)) return true;
  // 172.16.0.0/12
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return true;
  // 192.168.0.0/16
  if (/^192\.168\./.test(hostname)) return true;
  // 169.254.0.0/16 (link-local)
  if (/^169\.254\./.test(hostname)) return true;
  // 0.0.0.0
  if (hostname === "0.0.0.0") return true;

  return false;
}

/** HTMLからOGP情報を正規表現で抽出 */
function extractOgpFromHtml(html: string): FetchOgpResponse {
  const getMetaContent = (property: string): string | null => {
    // <meta property="og:xxx" content="..."> or <meta content="..." property="og:xxx">
    const patterns = [
      new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`,
        "i"
      ),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) return decodeHtmlEntities(match[1]);
    }
    return null;
  };

  const ogTitle = getMetaContent("og:title");
  const ogDescription = getMetaContent("og:description");
  const ogImage = getMetaContent("og:image");

  // og:titleがない場合は<title>タグにフォールバック
  let title = ogTitle;
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch?.[1]) {
      title = decodeHtmlEntities(titleMatch[1].trim());
    }
  }

  return {
    ogTitle: title,
    ogDescription: ogDescription,
    ogImage: ogImage,
  };
}

/** HTMLエンティティをデコード */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/** URLのSHA-256ハッシュからStorageパスを生成 */
async function generateStoragePath(
  imageUrl: string,
  contentType: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(imageUrl);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const ext = MIME_TO_EXT[contentType] || "jpg";
  // ディレクトリ分散: hash先頭2文字をディレクトリに
  return `${hash.slice(0, 2)}/${hash}.${ext}`;
}

/**
 * OG画像をダウンロードしてSupabase Storageにアップロード
 * 失敗時はnullを返す（グレースフルデグラデーション）
 */
async function downloadAndUploadOgImage(
  ogImageUrl: string
): Promise<string | null> {
  try {
    // URL検証
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(ogImageUrl);
    } catch {
      console.warn("[fetch-ogp] Invalid OG image URL:", ogImageUrl);
      return null;
    }

    // HTTP/HTTPSのみ許可
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      console.warn("[fetch-ogp] Non-HTTP OG image URL:", ogImageUrl);
      return null;
    }

    // SSRF対策
    if (isPrivateHost(parsedUrl.hostname)) {
      console.warn("[fetch-ogp] Private host OG image URL:", ogImageUrl);
      return null;
    }

    // タイムアウト付きで画像ダウンロード
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);

    let imageResponse: Response;
    try {
      imageResponse = await fetch(ogImageUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Machikore-OGP-Fetcher/1.0",
          Accept: "image/*",
        },
        redirect: "follow",
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("[fetch-ogp] OG image fetch failed:", error);
      return null;
    }
    clearTimeout(timeoutId);

    if (!imageResponse.ok) {
      console.warn(
        "[fetch-ogp] OG image HTTP error:",
        imageResponse.status
      );
      return null;
    }

    // Content-Type検証
    const contentType =
      imageResponse.headers.get("Content-Type")?.split(";")[0].trim() || "";
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      console.warn("[fetch-ogp] Invalid OG image content type:", contentType);
      return null;
    }

    // Content-Length事前チェック
    const contentLength = imageResponse.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_BYTES) {
      console.warn("[fetch-ogp] OG image too large:", contentLength);
      return null;
    }

    // 画像データ読み込み（サイズ上限付き）
    const reader = imageResponse.body?.getReader();
    if (!reader) return null;

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_IMAGE_BYTES) {
        reader.cancel();
        console.warn("[fetch-ogp] OG image exceeded size limit during download");
        return null;
      }
      chunks.push(value);
    }

    // チャンクを結合
    const imageData = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      imageData.set(chunk, offset);
      offset += chunk.byteLength;
    }

    // Supabase Storageにアップロード
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const storagePath = await generateStoragePath(ogImageUrl, contentType);

    const { error: uploadError } = await supabase.storage
      .from(OG_THUMBNAILS_BUCKET)
      .upload(storagePath, imageData, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[fetch-ogp] Storage upload error:", uploadError);
      return null;
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(OG_THUMBNAILS_BUCKET).getPublicUrl(storagePath);

    console.log("[fetch-ogp] OG image uploaded:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("[fetch-ogp] OG image processing error:", error);
    return null;
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: FetchOgpRequest = await req.json();
    console.log("[fetch-ogp] Received:", { url: body.url });

    if (!body.url || typeof body.url !== "string") {
      return new Response(
        JSON.stringify({ error: "url is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // URLバリデーション
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(body.url);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // HTTP/HTTPSのみ許可
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return new Response(
        JSON.stringify({ error: "Only HTTP/HTTPS URLs are allowed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // SSRF対策: プライベートIPを拒否
    if (isPrivateHost(parsedUrl.hostname)) {
      return new Response(
        JSON.stringify({ error: "Private/internal URLs are not allowed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // タイムアウト付きfetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(body.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Machikore-OGP-Fetcher/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const message =
        fetchError instanceof DOMException && fetchError.name === "AbortError"
          ? "Request timed out"
          : "Failed to fetch URL";
      console.error("[fetch-ogp] Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: message }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("[fetch-ogp] HTTP error:", response.status);
      return new Response(
        JSON.stringify({ error: `Target returned HTTP ${response.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Body上限チェック（Content-Lengthがある場合）
    const htmlContentLength = response.headers.get("Content-Length");
    if (htmlContentLength && parseInt(htmlContentLength) > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: "Response body too large" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Bodyを上限まで読み込み
    const reader = response.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: "No response body" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        reader.cancel();
        break;
      }
      chunks.push(value);
    }

    // Concatenate chunks
    const actualBytes = Math.min(totalBytes, MAX_BODY_BYTES);
    const combined = new Uint8Array(actualBytes);
    let offset = 0;
    for (const chunk of chunks) {
      const bytesToCopy = Math.min(chunk.byteLength, combined.byteLength - offset);
      combined.set(chunk.subarray(0, bytesToCopy), offset);
      offset += bytesToCopy;
      if (offset >= combined.byteLength) break;
    }
    const htmlText = new TextDecoder("utf-8", { fatal: false }).decode(combined);

    const result = extractOgpFromHtml(htmlText);

    // OG画像をSupabase Storageに再アップロード
    if (result.ogImage) {
      const storageUrl = await downloadAndUploadOgImage(result.ogImage);
      result.ogImage = storageUrl; // 失敗時はnull
    }

    console.log("[fetch-ogp] Result:", {
      ogTitle: result.ogTitle?.substring(0, 50),
      ogDescription: result.ogDescription?.substring(0, 50),
      hasOgImage: !!result.ogImage,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[fetch-ogp] Exception:", error);
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
