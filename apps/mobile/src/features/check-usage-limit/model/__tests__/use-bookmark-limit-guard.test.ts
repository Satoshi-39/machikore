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
jest.mock('@/shared/lib/i18n', () => {
  const translations: Record<string, string> = {
    'usageLimit.bookmarkLimitTitle': 'ブックマークの上限',
    'usageLimit.bookmarkUncategorizedMessage': '「後で見る」に保存できるのは%{limit}件までです。\n既存のブックマークを整理してください。',
    'usageLimit.bookmarkUncategorizedUpgradeMessage': '「後で見る」に保存できるのは%{limit}件までです。\nプレミアムにアップグレードすると%{premiumLimit}件まで保存できます。',
    'usageLimit.bookmarkPerFolderMessage': '1つのフォルダに保存できるのは%{limit}件までです。\n既存のブックマークを整理するか、別のフォルダに追加してください。',
    'usageLimit.bookmarkPerFolderUpgradeMessage': '1つのフォルダに保存できるのは%{limit}件までです。\nプレミアムにアップグレードすると%{premiumLimit}件まで保存できます。',
    'usageLimit.folderLimitTitle': 'フォルダ数の上限',
    'usageLimit.folderLimitMessage': 'フォルダは%{limit}個まで作成できます。\n既存のフォルダを削除してください。',
    'usageLimit.folderLimitUpgradeMessage': 'フォルダは%{limit}個まで作成できます。\nプレミアムにアップグレードすると%{premiumLimit}個まで作成できます。',
    'usageLimit.cannotDeleteFolder': 'フォルダを削除できません',
    'usageLimit.cannotDeleteFolderMessage': '「後で見る」が上限（%{limit}件）を超えてしまいます。\n既存のブックマークを整理してください。',
    'usageLimit.cannotDeleteFolderUpgradeMessage': '「後で見る」が上限（%{limit}件）を超えてしまいます。\nプレミアムにアップグレードすると%{premiumLimit}件まで保存できます。',
    'usageLimit.close': '閉じる',
    'usageLimit.upgrade': 'アップグレード',
  };
  return {
    useI18n: () => ({
      t: (key: string, opts?: Record<string, unknown>) => {
        let text = translations[key] || key;
        if (opts) Object.entries(opts).forEach(([k, v]) => { text = text.replace(`%{${k}}`, String(v)); });
        return text;
      },
    }),
  };
});

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

  // -------------------------------------------------------
  // checkFolderDeleteAllowed
  // -------------------------------------------------------
  describe('checkFolderDeleteAllowed', () => {
    /**
     * checkFolderDeleteAllowed 用モック
     * 4つの並行クエリをモック:
     *   1. rpc('count_bookmarks_uncategorized') → uncategorizedCount
     *   2. from('bookmarks').select('id', {count:'exact',head:true}).eq().eq() → folderCount
     *   3. rpc('count_bookmark_duplicates_on_folder_delete') → duplicateCount
     *   4. from('users').select('is_premium').eq().single() → isPremium
     */
    function mockFolderDeleteQueries(
      uncategorizedCount: number,
      folderCount: number,
      duplicateCount: number,
      isPremium: boolean,
    ) {
      // rpc は呼び出し順に異なる値を返す
      (supabase.rpc as jest.Mock)
        .mockResolvedValueOnce({ data: uncategorizedCount, error: null })  // count_bookmarks_uncategorized
        .mockResolvedValueOnce({ data: duplicateCount, error: null });     // count_bookmark_duplicates_on_folder_delete

      // from は bookmarks → count, users → is_premium
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'bookmarks') {
          const builder: any = {};
          builder.select = jest.fn(() => builder);
          builder.eq = jest.fn(() => builder);
          // from('bookmarks')はPromise.allの結果としてcountを返す
          builder.then = (resolve: any) => resolve({ count: folderCount, error: null });
          return builder;
        }
        if (table === 'users') {
          return createQueryBuilder({ data: { is_premium: isPremium }, error: null });
        }
        return createQueryBuilder({ data: null, error: null });
      });
    }

    // 正常系: 後で見る50件 + フォルダ内30件(重複10件) → total=70 ≤ 100 → true
    it('無料: 後で見る50件 + フォルダ内30件(重複10件) → total=70 ≤ 100 → 削除可能', async () => {
      mockFolderDeleteQueries(50, 30, 10, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    // 正常系: プレミアム
    it('プレミアム: 後で見る200件 + フォルダ内80件(重複20件) → total=260 ≤ 300 → 削除可能', async () => {
      mockFolderDeleteQueries(200, 80, 20, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    // 境界値: total == 100(ちょうど上限) → true（> で比較しているため）
    it('無料: total == 100(ちょうど上限) → 削除可能', async () => {
      // uncategorized=80, folder=30, duplicate=10 → net=20 → total=100
      mockFolderDeleteQueries(80, 30, 10, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    // 境界値: total == 101(上限+1) → false
    it('無料: total == 101(上限+1) → 削除不可', async () => {
      // uncategorized=81, folder=30, duplicate=10 → net=20 → total=101
      mockFolderDeleteQueries(81, 30, 10, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    // 境界値: プレミアム total == 300(ちょうど上限) → true
    it('プレミアム: total == 300(ちょうど上限) → 削除可能', async () => {
      // uncategorized=280, folder=30, duplicate=10 → net=20 → total=300
      mockFolderDeleteQueries(280, 30, 10, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    // 境界値: プレミアム total == 301(上限+1) → false
    it('プレミアム: total == 301(上限+1) → 削除不可', async () => {
      // uncategorized=281, folder=30, duplicate=10 → net=20 → total=301
      mockFolderDeleteQueries(281, 30, 10, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    // 重複除外ロジック: 全件重複(netIncrease=0)
    it('全件重複(netIncrease=0): 後で見るの件数のみで判定', async () => {
      // uncategorized=90, folder=20, duplicate=20 → net=0 → total=90
      mockFolderDeleteQueries(90, 20, 20, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    // 重複除外ロジック: 重複なし
    it('重複なし: netIncrease = folderCount そのまま', async () => {
      // uncategorized=95, folder=10, duplicate=0 → net=10 → total=105 > 100
      mockFolderDeleteQueries(95, 10, 0, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    // アップグレード分岐: 無料ユーザーでtotal ≤ premiumLimit
    it('無料: total ≤ premiumLimit → アップグレード導線付きアラート', async () => {
      // uncategorized=90, folder=20, duplicate=0 → net=20 → total=110 > 100, ≤ 300
      mockFolderDeleteQueries(90, 20, 0, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'フォルダを削除できません',
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });

    // アップグレード分岐: 無料ユーザーでtotal > premiumLimit
    it('無料: total > premiumLimit → アップグレード導線なしアラート', async () => {
      // uncategorized=290, folder=20, duplicate=0 → net=20 → total=310 > 300
      mockFolderDeleteQueries(290, 20, 0, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'フォルダを削除できません',
        expect.any(String)
      );
      // 第3引数（ボタン配列）がないことを確認
      expect(Alert.alert).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });

    // アップグレード分岐: プレミアムユーザーでtotal > limit
    it('プレミアム: total > limit → アップグレード導線なしアラート', async () => {
      // uncategorized=290, folder=20, duplicate=0 → net=20 → total=310 > 300
      mockFolderDeleteQueries(290, 20, 0, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'フォルダを削除できません',
        expect.any(String)
      );
    });

    // エラーケース: userIdがnullの場合はtrueを返す
    it('userIdがnullの場合はtrueを返す', async () => {
      mockUserId(null);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderDeleteAllowed('folder-1');
      });

      expect(checkResult).toBe(true);
    });
  });

  // -------------------------------------------------------
  // checkBookmarkLimit 境界値テスト
  // -------------------------------------------------------
  describe('checkBookmarkLimit 境界値', () => {
    it('無料: フォルダ内14件(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('無料: フォルダ内15件(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('プレミアム: フォルダ内29件(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER - 1, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム: フォルダ内30件(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit('folder-id', 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('無料: 後で見る99件(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('無料: 後で見る100件(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('プレミアム: 後で見る299件(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED - 1, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム: 後で見る300件(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkBookmarkLimit(null, 'maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // checkFolderLimit 境界値テスト
  // -------------------------------------------------------
  describe('checkFolderLimit 境界値', () => {
    it('無料: 9個(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_FOLDER_LIMIT - 1, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('無料: 10個(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.FREE_FOLDER_LIMIT, false);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('プレミアム: 29個(上限-1) → true', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT - 1, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム: 30個(上限ちょうど) → false', async () => {
      mockRpcAndUser(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT, true);
      const { result } = renderHook(() => useBookmarkLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkFolderLimit('maps');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
