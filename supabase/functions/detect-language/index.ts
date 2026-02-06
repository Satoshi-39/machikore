/**
 * 言語検出 Edge Function
 *
 * テキストの言語を自動検出してISO 639-1コードを返す
 * ライブラリ: franc (JavaScript native)
 *
 * 将来的にFastText等の高精度ライブラリに置き換え可能な設計
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { franc, francAll } from "npm:franc@6.2.0";
import { getCorsHeaders } from "../_shared/cors.ts";

// francが返すISO 639-3コードをISO 639-1に変換するマッピング
const iso639_3to1: Record<string, string> = {
  jpn: "ja",
  eng: "en",
  cmn: "zh", // Mandarin Chinese
  zho: "zh", // Chinese (generic)
  kor: "ko",
  fra: "fr",
  deu: "de",
  spa: "es",
  por: "pt",
  ita: "it",
  rus: "ru",
  ara: "ar",
  hin: "hi",
  tha: "th",
  vie: "vi",
  ind: "id",
  msa: "ms", // Malay
  nld: "nl",
  pol: "pl",
  tur: "tr",
  ukr: "uk",
  swe: "sv",
  dan: "da",
  nor: "no",
  fin: "fi",
  ces: "cs",
  ell: "el",
  hun: "hu",
  ron: "ro",
  heb: "he",
  fas: "fa", // Persian
  ben: "bn", // Bengali
  tam: "ta", // Tamil
  tel: "te", // Telugu
  mar: "mr", // Marathi
  guj: "gu", // Gujarati
  kan: "kn", // Kannada
  mal: "ml", // Malayalam
  pan: "pa", // Punjabi
  und: null, // Undetermined
};

interface DetectRequest {
  text: string;
  minLength?: number; // 最低文字数（デフォルト: 10）
}

interface DetectResponse {
  language: string | null;
  confidence: number;
  iso639_3: string;
  alternatives?: { language: string; confidence: number }[];
}

/**
 * ISO 639-3コードをISO 639-1に変換
 */
function convertToIso639_1(iso639_3: string): string | null {
  return iso639_3to1[iso639_3] ?? null;
}

/**
 * テキストを正規化（絵文字、URL、メンションを除去）
 */
function normalizeText(text: string): string {
  return text
    // URLを除去
    .replace(/https?:\/\/[^\s]+/g, "")
    // メンション(@username)を除去
    .replace(/@[\w]+/g, "")
    // ハッシュタグを除去（#は残すが言語検出に影響しにくい）
    .replace(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, "")
    // 絵文字を除去
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    // 連続する空白を1つに
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 日本語文字が含まれているかチェック（ひらがな・カタカナ・漢字）
 */
function containsJapanese(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

/**
 * 中国語のみの文字が含まれているかチェック（漢字のみでひらがな・カタカナなし）
 */
function isChineseOnly(text: string): boolean {
  const hasHanzi = /[\u4E00-\u9FAF]/.test(text);
  const hasJapaneseKana = /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
  return hasHanzi && !hasJapaneseKana;
}

/**
 * 韓国語文字が含まれているかチェック
 */
function containsKorean(text: string): boolean {
  return /[\uAC00-\uD7AF\u1100-\u11FF]/.test(text);
}

/**
 * 言語検出のメイン処理
 */
function detectLanguage(text: string, minLength: number = 10): DetectResponse {
  const normalized = normalizeText(text);

  // テキストが短すぎる場合
  if (normalized.length < minLength) {
    // 短いテキストでも文字種で判定を試みる
    if (containsJapanese(normalized)) {
      return {
        language: "ja",
        confidence: 0.7,
        iso639_3: "jpn",
      };
    }
    if (containsKorean(normalized)) {
      return {
        language: "ko",
        confidence: 0.7,
        iso639_3: "kor",
      };
    }
    if (isChineseOnly(normalized)) {
      return {
        language: "zh",
        confidence: 0.6,
        iso639_3: "cmn",
      };
    }

    return {
      language: null,
      confidence: 0,
      iso639_3: "und",
    };
  }

  // francで言語検出
  const detected = franc(normalized);
  const allResults = francAll(normalized, { minLength: 3 });

  // 上位3件の候補を取得
  const topResults = allResults.slice(0, 3).map(([lang, score]) => ({
    iso639_3: lang,
    language: convertToIso639_1(lang),
    confidence: score,
  }));

  // 日本語と中国語の誤検出を補正
  // francは漢字を中国語と判定しがちなので、ひらがな・カタカナがあれば日本語とする
  let finalLanguage = detected;
  if (
    (detected === "cmn" || detected === "zho") &&
    containsJapanese(normalized)
  ) {
    finalLanguage = "jpn";
  }

  const iso639_1 = convertToIso639_1(finalLanguage);
  const confidence = topResults[0]?.confidence ?? 0;

  return {
    language: iso639_1,
    confidence,
    iso639_3: finalLanguage,
    alternatives: topResults
      .filter((r) => r.iso639_3 !== finalLanguage && r.language)
      .map((r) => ({
        language: r.language!,
        confidence: r.confidence,
      })),
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: DetectRequest = await req.json();
    console.log("[detect-language] Received:", {
      textLength: body.text?.length,
      minLength: body.minLength,
    });

    if (!body.text || typeof body.text !== "string") {
      return new Response(
        JSON.stringify({ error: "text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = detectLanguage(body.text, body.minLength);
    console.log("[detect-language] Result:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[detect-language] Exception:", error);
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
