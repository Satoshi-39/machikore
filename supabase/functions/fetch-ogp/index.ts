/**
 * OGPフェッチ Edge Function
 *
 * 任意のURLからOGP情報（og:title, og:description, og:image）を取得する
 * 記事エディタの汎用リンクカード埋め込み機能で使用
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

interface FetchOgpRequest {
  url: string;
}

interface FetchOgpResponse {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

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

const FETCH_TIMEOUT_MS = 5000;
const MAX_BODY_BYTES = 100 * 1024; // 100KB

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
    const contentLength = response.headers.get("Content-Length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_BYTES) {
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
