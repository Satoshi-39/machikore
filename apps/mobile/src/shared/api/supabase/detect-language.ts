/**
 * 言語検出 API
 *
 * Edge Functionを呼び出してテキストの言語を検出する
 */

import { supabase } from './client';

interface DetectLanguageResponse {
  language: string | null;
  confidence: number;
  iso639_3: string;
  alternatives?: { language: string; confidence: number }[];
}

/**
 * テキストの言語を検出
 * @param text 検出対象のテキスト
 * @param minLength 最低文字数（デフォルト: 10）
 * @returns 言語コード（ISO 639-1）またはnull
 */
export async function detectLanguage(
  text: string,
  minLength: number = 10
): Promise<string | null> {
  if (!text || text.trim().length === 0) {
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke<DetectLanguageResponse>(
      'detect-language',
      {
        body: { text, minLength },
      }
    );

    if (error) {
      console.warn('[detectLanguage] Edge Function error:', error);
      return null;
    }

    return data?.language ?? null;
  } catch (err) {
    console.warn('[detectLanguage] Exception:', err);
    return null;
  }
}

/**
 * スポットまたはマップのテキストから言語を検出
 * description, article_contentを結合して検出
 */
export async function detectContentLanguage(content: {
  name?: string | null;
  description?: string | null;
  articleContent?: unknown | null;
}): Promise<string | null> {
  // テキストを結合
  const texts: string[] = [];

  if (content.name) {
    texts.push(content.name);
  }
  if (content.description) {
    texts.push(content.description);
  }

  // articleContentはProseMirrorDoc形式なのでプレーンテキストを抽出
  if (content.articleContent) {
    const plainText = extractPlainTextFromProseMirror(content.articleContent);
    if (plainText) {
      texts.push(plainText);
    }
  }

  const combinedText = texts.join(' ').trim();

  if (combinedText.length < 5) {
    return null;
  }

  return detectLanguage(combinedText);
}

/**
 * ProseMirrorDocからプレーンテキストを抽出
 */
function extractPlainTextFromProseMirror(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return '';

  const docObj = doc as { type?: string; content?: unknown[] };

  if (docObj.type !== 'doc' || !Array.isArray(docObj.content)) {
    return '';
  }

  const extractFromNode = (node: unknown): string => {
    if (!node || typeof node !== 'object') return '';

    const nodeObj = node as { text?: string; content?: unknown[] };

    if (nodeObj.text) return nodeObj.text;
    if (!Array.isArray(nodeObj.content)) return '';

    return nodeObj.content.map(extractFromNode).join('');
  };

  return docObj.content
    .map((node) => extractFromNode(node))
    .join('\n')
    .trim();
}
