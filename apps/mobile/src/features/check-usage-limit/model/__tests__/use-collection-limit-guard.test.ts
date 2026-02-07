/**
 * useCollectionLimitGuard のテスト
 *
 * 無料/プレミアムユーザーのコレクション上限チェックとアラート表示を検証
 */

jest.mock('@/shared/api/supabase', () => ({
  supabase: { from: jest.fn(), rpc: jest.fn() },
}));
jest.mock('@/entities/user', () => ({ useUserStore: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@/shared/config/logger', () => ({ log: { error: jest.fn() } }));

import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useCollectionLimitGuard } from '../use-collection-limit-guard';
import { supabase } from '@/shared/api/supabase';
import { useUserStore } from '@/entities/user';
import { useRouter } from 'expo-router';
import { SUBSCRIPTION } from '@/shared/config/constants';

// ===============================
// ヘルパー
// ===============================

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

function mockUserId(userId: string | null) {
  (useUserStore as unknown as jest.Mock).mockImplementation((selector: any) =>
    selector({ user: userId ? { id: userId } : null })
  );
}

function createQueryBuilder(result: { data?: any; error?: any }) {
  const builder: any = {};
  builder.select = jest.fn(() => builder);
  builder.eq = jest.fn(() => builder);
  builder.single = jest.fn().mockResolvedValue(result);
  return builder;
}

function mockSupabaseRpcAndUser(count: number, isPremium: boolean) {
  (supabase.rpc as jest.Mock).mockResolvedValue({ data: count, error: null });
  (supabase.from as jest.Mock).mockImplementation(() =>
    createQueryBuilder({ data: { is_premium: isPremium }, error: null })
  );
}

// ===============================
// テスト
// ===============================

describe('useCollectionLimitGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockUserId('test-user-id');
  });

  describe('checkCollectionLimit - 無料ユーザー', () => {
    it('上限未満の場合はtrueを返しアラートなし', async () => {
      mockSupabaseRpcAndUser(2, false);
      const { result } = renderHook(() => useCollectionLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkCollectionLimit();
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('上限到達（3件）の場合はfalseを返しアップグレード導線付きアラートを表示', async () => {
      mockSupabaseRpcAndUser(SUBSCRIPTION.FREE_COLLECTION_LIMIT, false);
      const { result } = renderHook(() => useCollectionLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkCollectionLimit();
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'コレクション数の上限',
        expect.stringContaining(`${SUBSCRIPTION.FREE_COLLECTION_LIMIT}個`),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });
  });

  describe('checkCollectionLimit - プレミアムユーザー', () => {
    it('プレミアム上限未満の場合はtrueを返しアラートなし', async () => {
      mockSupabaseRpcAndUser(8, true);
      const { result } = renderHook(() => useCollectionLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkCollectionLimit();
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム上限到達（10件）の場合はfalseを返しアップグレード導線なしのアラートを表示', async () => {
      mockSupabaseRpcAndUser(SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT, true);
      const { result } = renderHook(() => useCollectionLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkCollectionLimit();
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'コレクション数の上限',
        expect.stringContaining(`${SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT}個`)
      );
    });
  });

  describe('checkCollectionLimit - エラーケース', () => {
    it('RPC取得エラー時はtrueを返す（DB側RLSで最終防御）', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'error' } });
      (supabase.from as jest.Mock).mockImplementation(() =>
        createQueryBuilder({ data: { is_premium: false }, error: null })
      );

      const { result } = renderHook(() => useCollectionLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkCollectionLimit();
      });

      expect(checkResult).toBe(true);
    });
  });
});
