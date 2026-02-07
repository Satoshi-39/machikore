/**
 * useBookmarkLimitGuard のテスト
 *
 * ブックマーク・フォルダの上限チェックとアラート表示を検証
 */

jest.mock('@/shared/api/supabase', () => ({
  supabase: { from: jest.fn(), rpc: jest.fn() },
}));
jest.mock('@/entities/user', () => ({ useUserStore: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@/shared/config/logger', () => ({ log: { error: jest.fn() } }));

import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useBookmarkLimitGuard } from '../use-bookmark-limit-guard';
import { supabase } from '@/shared/api/supabase';
import { useUserStore } from '@/entities/user';
import { useRouter } from 'expo-router';
import { SUBSCRIPTION } from '@/shared/config/constants';

// ===============================
// ヘルパー
// ===============================

const mockPush = jest.fn();

function mockUserId(userId: string | null) {
  (useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
    selector({ user: userId ? { id: userId } : null })
  );
}

function createQueryBuilder(result: { data?: any; error?: any; count?: number }) {
  const builder: any = {};
  builder.select = jest.fn(() => builder);
  builder.eq = jest.fn(() => builder);
  builder.single = jest.fn().mockResolvedValue(result);
  return builder;
}

function mockRpcAndUser(rpcCount: number, isPremium: boolean) {
  (supabase.rpc as jest.Mock).mockResolvedValue({ data: rpcCount, error: null });
  (supabase.from as jest.Mock).mockImplementation(() =>
    createQueryBuilder({ data: { is_premium: isPremium }, error: null })
  );
}

// ===============================
// テスト
// ===============================

describe('useBookmarkLimitGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockUserId('test-user-id');
  });

  // -------------------------------------------------------
  // checkBookmarkLimit - フォルダ内ブックマーク
  // -------------------------------------------------------
  describe('checkBookmarkLimit（フォルダ内）', () => {
    it('無料ユーザー: 上限未満の場合はtrueを返しアラートなし', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
      // count_bookmarks_in_folder RPCが呼ばれたことを確認
      expect(supabase.rpc).toHaveBeenCalledWith('count_bookmarks_in_folder', {
        p_user_id: 'test-user-id',
        p_folder_id: 'folder-id',
      });
    });

    it('無料ユーザー: 上限到達の場合はfalseを返しアップグレード導線付きアラートを表示', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'spots');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'ブックマークの上限',
        expect.stringContaining(`${SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER}件`),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });

    it('プレミアムユーザー: 上限到達の場合はfalseを返しアップグレード導線なしのアラートを表示', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'ブックマークの上限',
        expect.stringContaining(`${SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER}件`)
      );
    });
  });

  // -------------------------------------------------------
  // checkBookmarkLimit - 後で見る（uncategorized）
  // -------------------------------------------------------
  describe('checkBookmarkLimit（後で見る）', () => {
    it('無料ユーザー: マップ上限未満の場合はtrueを返しアラートなし', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
      // count_bookmarks_uncategorized RPCがタイプ付きで呼ばれたことを確認
      expect(supabase.rpc).toHaveBeenCalledWith('count_bookmarks_uncategorized', {
        p_user_id: 'test-user-id',
        p_bookmark_type: 'maps',
      });
    });

    it('無料ユーザー: スポット上限未満の場合はtrueを返しアラートなし', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'spots');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
      // count_bookmarks_uncategorized RPCがタイプ付きで呼ばれたことを確認
      expect(supabase.rpc).toHaveBeenCalledWith('count_bookmarks_uncategorized', {
        p_user_id: 'test-user-id',
        p_bookmark_type: 'spots',
      });
    });

    it('無料ユーザー: マップ上限到達の場合はfalseを返しアラートを表示', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'ブックマークの上限',
        expect.stringContaining('後で見る'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });
  });

  // -------------------------------------------------------
  // checkFolderLimit
  // -------------------------------------------------------
  describe('checkFolderLimit', () => {
    it('無料ユーザー: 上限未満の場合はtrueを返しアラートなし', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_FOLDER_LIMIT - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
      // count_bookmark_folders RPCがfolderTypeパラメータ付きで呼ばれる
      expect(supabase.rpc).toHaveBeenCalledWith('count_bookmark_folders', {
        p_user_id: 'test-user-id',
        p_folder_type: 'maps',
      });
    });

    it('無料ユーザー: 上限到達の場合はfalseを返しアップグレード導線付きアラートを表示', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_FOLDER_LIMIT, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('spots');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'フォルダ数の上限',
        expect.stringContaining(`${SUBSCRIPTION.FREE_FOLDER_LIMIT}個`),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });

    it('プレミアムユーザー: 上限到達の場合はfalseを返しアップグレード導線なしのアラートを表示', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'フォルダ数の上限',
        expect.stringContaining(`${SUBSCRIPTION.PREMIUM_FOLDER_LIMIT}個`)
      );
    });
  });
});
