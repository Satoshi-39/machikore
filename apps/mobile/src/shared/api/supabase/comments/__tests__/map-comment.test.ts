/**
 * mapComment マッパー関数のテスト
 *
 * Supabase生データ → CommentWithUser 変換のエッジケースを検証
 */

import { mapComment } from '../types';

const baseComment = {
  id: 'comment-1',
  user_id: 'user-1',
  map_id: null,
  user_spot_id: 'spot-1',
  content: 'テストコメント',
  created_at: '2024-06-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  parent_id: null,
  root_id: null,
  depth: 0,
  likes_count: 0,
  replies_count: 0,
  comment_likes: [],
};

const mockUser = {
  id: 'user-1',
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: null,
  avatar_crop: null,
};

describe('mapComment', () => {
  it('基本的なコメントを正しく変換する', () => {
    const result = mapComment({ ...baseComment, users: mockUser });

    expect(result).toEqual({
      id: 'comment-1',
      user_id: 'user-1',
      map_id: null,
      user_spot_id: 'spot-1',
      content: 'テストコメント',
      created_at: '2024-06-01T00:00:00Z',
      updated_at: '2024-06-01T00:00:00Z',
      parent_id: null,
      root_id: null,
      depth: 0,
      likes_count: 0,
      replies_count: 0,
      user: mockUser,
      reply_to_user: null,
      is_liked: false,
      is_liked_by_author: false,
      author: null,
    });
  });

  // -------------------------------------------------------
  // ユーザー情報のフォールバック: users → user
  // -------------------------------------------------------
  describe('ユーザー情報の解決', () => {
    it('comment.users を優先的に使用する（Supabase JOINの命名）', () => {
      const result = mapComment({
        ...baseComment,
        users: mockUser,
        user: { id: 'other', username: 'other', display_name: 'Other', avatar_url: null, avatar_crop: null },
      });
      expect(result.user).toBe(mockUser);
    });

    it('comment.users がない場合は comment.user にフォールバックする', () => {
      const result = mapComment({ ...baseComment, user: mockUser });
      expect(result.user).toEqual(mockUser);
    });

    it('users も user もない場合は null になる', () => {
      const result = mapComment({ ...baseComment });
      expect(result.user).toBeNull();
    });
  });

  // -------------------------------------------------------
  // いいね判定
  // -------------------------------------------------------
  describe('いいね判定', () => {
    const commentWithLikes = {
      ...baseComment,
      comment_likes: [
        { user_id: 'user-1' },
        { user_id: 'author-1' },
      ],
      likes_count: 2,
    };

    it('currentUserIdが一致する場合 is_liked = true', () => {
      const result = mapComment(commentWithLikes, { currentUserId: 'user-1' });
      expect(result.is_liked).toBe(true);
    });

    it('currentUserIdが一致しない場合 is_liked = false', () => {
      const result = mapComment(commentWithLikes, { currentUserId: 'user-other' });
      expect(result.is_liked).toBe(false);
    });

    it('currentUserIdがnullの場合 is_liked = false', () => {
      const result = mapComment(commentWithLikes, { currentUserId: null });
      expect(result.is_liked).toBe(false);
    });

    it('authorIdが一致する場合 is_liked_by_author = true', () => {
      const result = mapComment(commentWithLikes, { authorId: 'author-1' });
      expect(result.is_liked_by_author).toBe(true);
    });

    it('authorIdがnullの場合 is_liked_by_author = false', () => {
      const result = mapComment(commentWithLikes, { authorId: null });
      expect(result.is_liked_by_author).toBe(false);
    });

    it('comment_likes が undefined の場合でもエラーにならない', () => {
      const { comment_likes, ...commentNoLikes } = baseComment;
      const result = mapComment(commentNoLikes, { currentUserId: 'user-1' });
      expect(result.is_liked).toBe(false);
      expect(result.is_liked_by_author).toBe(false);
    });
  });

  // -------------------------------------------------------
  // falsy値のデフォルト処理
  // -------------------------------------------------------
  describe('falsyフィールドのデフォルト値', () => {
    it('depth が undefined の場合は 0 になる', () => {
      const { depth, ...c } = baseComment;
      expect(mapComment(c).depth).toBe(0);
    });

    it('likes_count が undefined の場合は 0 になる', () => {
      const { likes_count, ...c } = baseComment;
      expect(mapComment(c).likes_count).toBe(0);
    });

    it('replies_count が undefined の場合は 0 になる', () => {
      const { replies_count, ...c } = baseComment;
      expect(mapComment(c).replies_count).toBe(0);
    });

    it('parent_id が undefined の場合は null になる', () => {
      const { parent_id, ...c } = baseComment;
      expect(mapComment(c).parent_id).toBeNull();
    });
  });

  // -------------------------------------------------------
  // author の受け渡し
  // -------------------------------------------------------
  describe('author オプション', () => {
    it('author が指定された場合はそのまま設定される', () => {
      const author = { id: 'author-1', username: 'author', display_name: 'Author', avatar_url: 'url', avatar_crop: null };
      const result = mapComment(baseComment, { author });
      expect(result.author).toBe(author);
    });

    it('author が未指定の場合は null になる', () => {
      const result = mapComment(baseComment);
      expect(result.author).toBeNull();
    });
  });

  // -------------------------------------------------------
  // reply_to_user
  // -------------------------------------------------------
  describe('reply_to_user', () => {
    it('reply_to_user がある場合はそのまま設定される', () => {
      const replyToUser = { id: 'reply-user', username: 'reply', display_name: 'Reply', avatar_url: null, avatar_crop: null };
      const result = mapComment({ ...baseComment, reply_to_user: replyToUser });
      expect(result.reply_to_user).toEqual(replyToUser);
    });

    it('reply_to_user がない場合は null になる', () => {
      const result = mapComment(baseComment);
      expect(result.reply_to_user).toBeNull();
    });
  });
});
