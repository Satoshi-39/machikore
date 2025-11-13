/**
 * 投稿に関する状態管理
 */

import { create } from 'zustand';

/**
 * 投稿のソート順
 */
export type PostSortOrder = 'latest' | 'oldest' | 'popular';

/**
 * 投稿のフィルターモード
 */
export type PostFilterMode = 'all' | 'my-posts';

interface PostStore {
  /** ソート順 */
  sortOrder: PostSortOrder;
  /** フィルターモード */
  filterMode: PostFilterMode;
  /** 選択中の投稿ID（詳細表示用） */
  selectedPostId: string | null;

  /** ソート順を変更 */
  setSortOrder: (order: PostSortOrder) => void;
  /** フィルターモードを変更 */
  setFilterMode: (mode: PostFilterMode) => void;
  /** 投稿を選択 */
  selectPost: (postId: string | null) => void;
  /** ストアをリセット */
  reset: () => void;
}

const initialState = {
  sortOrder: 'latest' as PostSortOrder,
  filterMode: 'all' as PostFilterMode,
  selectedPostId: null,
};

export const usePostStore = create<PostStore>((set) => ({
  ...initialState,

  setSortOrder: (order) => set({ sortOrder: order }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  selectPost: (postId) => set({ selectedPostId: postId }),
  reset: () => set(initialState),
}));
