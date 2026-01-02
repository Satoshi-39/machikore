/**
 * article.utils.ts のテスト
 */

import { isEmptyArticle } from '../article.utils';
import type { ProseMirrorDoc } from '@/shared/types';

describe('article.utils', () => {
  describe('isEmptyArticle', () => {
    it('nullの場合はtrueを返す', () => {
      expect(isEmptyArticle(null)).toBe(true);
    });

    it('contentが空配列の場合はtrueを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [],
      };
      expect(isEmptyArticle(doc)).toBe(true);
    });

    it('contentがundefinedの場合はtrueを返す', () => {
      const doc = {
        type: 'doc',
      } as ProseMirrorDoc;
      expect(isEmptyArticle(doc)).toBe(true);
    });

    it('空のparagraphのみの場合はtrueを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(true);
    });

    it('空のcontent配列を持つparagraphのみの場合はtrueを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(true);
    });

    it('テキストを含むparagraphがある場合はfalseを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello, World!',
              },
            ],
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(false);
    });

    it('複数のparagraphがある場合はfalseを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
          },
          {
            type: 'paragraph',
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(false);
    });

    it('headingがある場合はfalseを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [
              {
                type: 'text',
                text: 'Title',
              },
            ],
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(false);
    });

    it('画像がある場合はfalseを返す', () => {
      const doc: ProseMirrorDoc = {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: {
              src: 'https://example.com/image.jpg',
            },
          },
        ],
      };
      expect(isEmptyArticle(doc)).toBe(false);
    });
  });
});
