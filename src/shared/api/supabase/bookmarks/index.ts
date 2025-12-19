/**
 * Supabase Bookmarks API
 * ブックマーク・フォルダ機能
 */

// 型定義
export {
  type BookmarkFolderType,
  type BookmarkFolder,
  type Bookmark,
  type BookmarkWithDetails,
} from './types';

// フォルダ操作
export {
  getBookmarkFolders,
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
} from './folder-operations';

// スポットブックマーク
export {
  bookmarkSpot,
  unbookmarkSpot,
  checkSpotBookmarked,
  getSpotBookmarkInfo,
  unbookmarkSpotFromFolder,
  toggleSpotBookmark,
} from './bookmark-spots';

// マップブックマーク
export {
  bookmarkMap,
  unbookmarkMap,
  checkMapBookmarked,
  getMapBookmarkInfo,
  unbookmarkMapFromFolder,
  toggleMapBookmark,
} from './bookmark-maps';

// ブックマーク取得・操作
export {
  removeBookmark,
  moveBookmarkToFolder,
  getUserBookmarks,
} from './get-bookmarks';
