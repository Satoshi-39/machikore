/**
 * ProseMirror型変換関数の単体テスト
 *
 * 純粋関数のため外部モック不要
 */

import {
  extractPlainText,
  parseProseMirrorDoc,
  extractImageUrls,
  type ProseMirrorDoc,
} from '../composite.types';

// ===============================
// extractPlainText
// ===============================

describe('extractPlainText', () => {
  it('null → 空文字', () => {
    expect(extractPlainText(null)).toBe('');
  });

  it('undefined → 空文字', () => {
    expect(extractPlainText(undefined)).toBe('');
  });

  it('contentがないdoc → 空文字', () => {
    const doc = { type: 'doc' } as unknown as ProseMirrorDoc;
    expect(extractPlainText(doc)).toBe('');
  });

  it('単一paragraph → テキスト抽出', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    };
    expect(extractPlainText(doc)).toBe('Hello World');
  });

  it('複数paragraph → 改行区切りで結合', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '1行目' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '2行目' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '3行目' }],
        },
      ],
    };
    expect(extractPlainText(doc)).toBe('1行目\n2行目\n3行目');
  });

  it('ネストしたノード(blockquote内) → 再帰的に抽出', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '引用テキスト' }],
            },
          ],
        },
      ],
    };
    expect(extractPlainText(doc)).toBe('引用テキスト');
  });

  it('テキストなしノード(imageなど) → 空文字', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/img.png' },
        },
      ],
    };
    expect(extractPlainText(doc)).toBe('');
  });

  it('複数のテキストノード(boldとplainの混在) → 結合', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ' },
            {
              type: 'text',
              text: 'World',
              marks: [{ type: 'bold' }],
            },
          ],
        },
      ],
    };
    expect(extractPlainText(doc)).toBe('Hello World');
  });
});

// ===============================
// parseProseMirrorDoc
// ===============================

describe('parseProseMirrorDoc', () => {
  it('null → null', () => {
    expect(parseProseMirrorDoc(null)).toBeNull();
  });

  it('undefined → null', () => {
    expect(parseProseMirrorDoc(undefined)).toBeNull();
  });

  it('空文字 → null', () => {
    expect(parseProseMirrorDoc('')).toBeNull();
  });

  it('有効なProseMirror JSON → docオブジェクト', () => {
    const json = JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    });
    const result = parseProseMirrorDoc(json);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('doc');
    expect(result!.content).toHaveLength(1);
  });

  it('type: "doc" でないJSON → null', () => {
    const json = JSON.stringify({
      type: 'paragraph',
      content: [{ type: 'text', text: 'hello' }],
    });
    expect(parseProseMirrorDoc(json)).toBeNull();
  });

  it('contentが配列でないJSON → null', () => {
    const json = JSON.stringify({
      type: 'doc',
      content: 'not-an-array',
    });
    expect(parseProseMirrorDoc(json)).toBeNull();
  });

  it('不正JSON(構文エラー) → null', () => {
    expect(parseProseMirrorDoc('{invalid json')).toBeNull();
  });
});

// ===============================
// extractImageUrls
// ===============================

describe('extractImageUrls', () => {
  it('null → 空配列', () => {
    expect(extractImageUrls(null)).toEqual([]);
  });

  it('undefined → 空配列', () => {
    expect(extractImageUrls(undefined)).toEqual([]);
  });

  it('画像ノードなし → 空配列', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'テキストのみ' }],
        },
      ],
    };
    expect(extractImageUrls(doc)).toEqual([]);
  });

  it('トップレベルimage → URL抽出', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/img1.png' },
        },
      ],
    };
    expect(extractImageUrls(doc)).toEqual(['https://example.com/img1.png']);
  });

  it('ネストされたimage → 再帰的に抽出', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: { src: 'https://example.com/nested.png' },
            },
          ],
        },
      ],
    };
    expect(extractImageUrls(doc)).toEqual(['https://example.com/nested.png']);
  });

  it('複数画像 → 全URL抽出(順序保持)', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/first.png' },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'テキスト' }],
        },
        {
          type: 'image',
          attrs: { src: 'https://example.com/second.png' },
        },
      ],
    };
    expect(extractImageUrls(doc)).toEqual([
      'https://example.com/first.png',
      'https://example.com/second.png',
    ]);
  });

  it('srcなしimageノード → 無視', () => {
    const doc: ProseMirrorDoc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { alt: 'no src' },
        },
        {
          type: 'image',
          attrs: { src: 'https://example.com/valid.png' },
        },
      ],
    };
    expect(extractImageUrls(doc)).toEqual(['https://example.com/valid.png']);
  });
});
