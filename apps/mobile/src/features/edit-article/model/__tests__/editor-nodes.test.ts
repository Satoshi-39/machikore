/**
 * editor-nodes.ts のテスト
 *
 * ProseMirrorドキュメントのサムネイル・description操作
 * バグがあると記事の保存時にデータが欠損する可能性がある
 */

import {
  removeThumbnailFromDoc,
  insertThumbnailToDoc,
  insertEmptyThumbnailToDoc,
  getThumbnailFromDoc,
  removeDescriptionFromDoc,
  getDescriptionFromDoc,
  insertDescriptionToDoc,
  extractTextFromDoc,
} from '../editor-nodes';

import type { ProseMirrorDoc, ProseMirrorNode } from '@/shared/types';

// ---- テスト用ヘルパー ----

function makeDoc(...content: ProseMirrorNode[]): ProseMirrorDoc {
  return { type: 'doc', content };
}

const paragraph = (text: string): ProseMirrorNode => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
});

const thumbnailNode = (src: string | null): ProseMirrorNode => ({
  type: 'thumbnail',
  attrs: { src },
});

const descriptionNode = (text?: string): ProseMirrorNode =>
  text
    ? { type: 'description', content: [{ type: 'text', text }] }
    : { type: 'description' };

// ---- テスト ----

describe('Thumbnail操作', () => {
  describe('getThumbnailFromDoc', () => {
    it('サムネイルがあればURLを返す', () => {
      const doc = makeDoc(thumbnailNode('https://img.example.com/thumb.jpg'), paragraph('本文'));
      expect(getThumbnailFromDoc(doc)).toBe('https://img.example.com/thumb.jpg');
    });

    it('サムネイルがなければnull', () => {
      const doc = makeDoc(paragraph('本文のみ'));
      expect(getThumbnailFromDoc(doc)).toBeNull();
    });

    it('空のサムネイル(src=null)はnullを返す', () => {
      const doc = makeDoc(thumbnailNode(null), paragraph('本文'));
      expect(getThumbnailFromDoc(doc)).toBeNull();
    });

    it('contentが空のドキュメントはnull', () => {
      const doc = { type: 'doc' } as ProseMirrorDoc;
      expect(getThumbnailFromDoc(doc)).toBeNull();
    });
  });

  describe('insertThumbnailToDoc', () => {
    it('空のドキュメントに挿入', () => {
      const doc = makeDoc();
      const result = insertThumbnailToDoc(doc, 'https://img.example.com/new.jpg');
      expect(result.content).toHaveLength(1);
      expect(result.content![0]!.type).toBe('thumbnail');
      expect(result.content![0]!.attrs?.src).toBe('https://img.example.com/new.jpg');
    });

    it('既存のサムネイルを置換する', () => {
      const doc = makeDoc(thumbnailNode('https://old.jpg'), paragraph('本文'));
      const result = insertThumbnailToDoc(doc, 'https://new.jpg');
      expect(result.content).toHaveLength(2);
      expect(result.content![0]!.attrs?.src).toBe('https://new.jpg');
      expect(result.content![1]!.type).toBe('paragraph');
    });

    it('本文が保持される', () => {
      const doc = makeDoc(paragraph('段落1'), paragraph('段落2'));
      const result = insertThumbnailToDoc(doc, 'https://img.jpg');
      expect(result.content).toHaveLength(3);
      expect(result.content[1]).toEqual(paragraph('段落1'));
      expect(result.content[2]).toEqual(paragraph('段落2'));
    });
  });

  describe('removeThumbnailFromDoc', () => {
    it('サムネイルを除去し本文を保持', () => {
      const doc = makeDoc(thumbnailNode('https://img.jpg'), paragraph('本文'));
      const result = removeThumbnailFromDoc(doc);
      expect(result.content).toHaveLength(1);
      expect(result.content![0]!.type).toBe('paragraph');
    });

    it('サムネイルがなければそのまま', () => {
      const doc = makeDoc(paragraph('本文'));
      const result = removeThumbnailFromDoc(doc);
      expect(result.content).toEqual([paragraph('本文')]);
    });
  });
});

describe('Description操作', () => {
  describe('getDescriptionFromDoc', () => {
    it('descriptionのテキストを取得', () => {
      const doc = makeDoc(descriptionNode('美味しいお店'), paragraph('記事本文'));
      expect(getDescriptionFromDoc(doc)).toBe('美味しいお店');
    });

    it('空のdescriptionは空文字を返す', () => {
      const doc = makeDoc(descriptionNode(), paragraph('記事本文'));
      expect(getDescriptionFromDoc(doc)).toBe('');
    });

    it('descriptionがなければ空文字', () => {
      const doc = makeDoc(paragraph('本文のみ'));
      expect(getDescriptionFromDoc(doc)).toBe('');
    });

    it('contentが空のドキュメントは空文字', () => {
      const doc = { type: 'doc' } as ProseMirrorDoc;
      expect(getDescriptionFromDoc(doc)).toBe('');
    });
  });

  describe('insertDescriptionToDoc', () => {
    it('サムネイルの直後に挿入される', () => {
      const doc = makeDoc(thumbnailNode('https://img.jpg'), paragraph('記事'));
      const result = insertDescriptionToDoc(doc, '紹介文');
      expect(result.content).toHaveLength(3);
      expect(result.content![0]!.type).toBe('thumbnail');
      expect(result.content![1]!.type).toBe('description');
      expect(result.content![2]!.type).toBe('paragraph');
    });

    it('サムネイルがなければ先頭に挿入', () => {
      const doc = makeDoc(paragraph('記事'));
      const result = insertDescriptionToDoc(doc, '紹介文');
      expect(result.content).toHaveLength(2);
      expect(result.content![0]!.type).toBe('description');
      expect(result.content![1]!.type).toBe('paragraph');
    });

    it('既存のdescriptionを置換する', () => {
      const doc = makeDoc(thumbnailNode('https://img.jpg'), descriptionNode('旧'), paragraph('記事'));
      const result = insertDescriptionToDoc(doc, '新');
      // description は1つだけ
      const descCount = result.content.filter((n) => n.type === 'description').length;
      expect(descCount).toBe(1);
      expect(getDescriptionFromDoc(result)).toBe('新');
    });
  });

  describe('removeDescriptionFromDoc', () => {
    it('descriptionを除去し他のノードを保持', () => {
      const doc = makeDoc(thumbnailNode('https://img.jpg'), descriptionNode('紹介'), paragraph('本文'));
      const result = removeDescriptionFromDoc(doc);
      expect(result.content).toHaveLength(2);
      expect(result.content.every((n) => n.type !== 'description')).toBe(true);
    });
  });
});

describe('extractTextFromDoc', () => {
  it('複数段落のテキストを改行区切りで結合', () => {
    const doc = makeDoc(paragraph('段落1'), paragraph('段落2'));
    expect(extractTextFromDoc(doc)).toBe('段落1\n段落2');
  });

  it('ネストしたノードからテキストを再帰的に抽出', () => {
    const doc = makeDoc({
      type: 'blockquote',
      content: [paragraph('引用テキスト')],
    });
    expect(extractTextFromDoc(doc)).toBe('引用テキスト');
  });

  it('空のドキュメントは空文字', () => {
    const doc = { type: 'doc' } as ProseMirrorDoc;
    expect(extractTextFromDoc(doc)).toBe('');
  });
});
