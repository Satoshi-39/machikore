/**
 * images.utils.ts のテスト
 *
 * 純粋関数のgeneratePostImageFilenameのみテスト
 * （他の関数はFileSystemに依存するため）
 */

import { generatePostImageFilename } from '../images.utils';

describe('images.utils', () => {
  describe('generatePostImageFilename', () => {
    it('postIdとtimestampからファイル名を生成する', () => {
      const filename = generatePostImageFilename('abc123', 1234567890);
      expect(filename).toBe('post_abc123_1234567890.jpg');
    });

    it('timestamp省略時は現在時刻を使用する', () => {
      const before = Date.now();
      const filename = generatePostImageFilename('test-post');
      const after = Date.now();

      // ファイル名のフォーマットを確認
      expect(filename).toMatch(/^post_test-post_\d+\.jpg$/);

      // タイムスタンプが妥当な範囲にあることを確認
      const match = filename.match(/post_test-post_(\d+)\.jpg/);
      expect(match).not.toBeNull();
      const ts = parseInt(match![1], 10);
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });

    it('UUIDのようなpostIdでも動作する', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const filename = generatePostImageFilename(uuid, 1000);
      expect(filename).toBe(`post_${uuid}_1000.jpg`);
    });

    it('空のpostIdでも動作する', () => {
      const filename = generatePostImageFilename('', 1000);
      expect(filename).toBe('post__1000.jpg');
    });

    it('timestamp=0でも動作する', () => {
      const filename = generatePostImageFilename('test', 0);
      // timestamp=0はfalsyなので Date.now() が使われる
      expect(filename).toMatch(/^post_test_\d+\.jpg$/);
    });

    it('拡張子は常に.jpg', () => {
      const filename = generatePostImageFilename('any-id', 123);
      expect(filename.endsWith('.jpg')).toBe(true);
    });

    it('フォーマットはpost_{postId}_{timestamp}.jpg', () => {
      const postId = 'my-post-id';
      const timestamp = 9999999999999;
      const filename = generatePostImageFilename(postId, timestamp);
      expect(filename).toBe(`post_${postId}_${timestamp}.jpg`);
    });
  });
});
