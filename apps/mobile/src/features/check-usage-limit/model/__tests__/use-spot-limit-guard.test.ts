/**
 * useSpotLimitGuard のテスト
 *
 * 無料/プレミアムユーザーのスポット上限チェックとアラート表示を検証
 */

jest.mock('@/shared/api/supabase', () => ({
  supabase: { from: jest.fn(), rpc: jest.fn() },
}));
jest.mock('@/entities/user', () => ({ useUserStore: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@/shared/config/logger', () => ({ log: { error: jest.fn() } }));
jest.mock('@/shared/lib/i18n', () => {
  const translations: Record<string, string> = {
    'usageLimit.spotLimitTitle': 'スポット数の上限',
    'usageLimit.spotLimitMessage': '1つのマップに登録できるスポットは%{limit}件までです。\n既存のスポットを削除するか、新しいマップに追加してください。',
    'usageLimit.spotLimitUpgradeMessage': '1つのマップに登録できるスポットは%{limit}件までです。\nプレミアムにアップグレードすると%{premiumLimit}件まで登録できます。',
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
import { useSpotLimitGuard } from '../use-spot-limit-guard';
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

function mockSupabaseFrom(spotsCount: number, isPremium: boolean) {
  (supabase.from as jest.Mock).mockImplementation((table: string) => {
    if (table === 'maps')
      return createQueryBuilder({ data: { spots_count: spotsCount }, error: null });
    if (table === 'users')
      return createQueryBuilder({ data: { is_premium: isPremium }, error: null });
    return createQueryBuilder({ data: null, error: null });
  });
}

// ===============================
// テスト
// ===============================

describe('useSpotLimitGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockUserId('test-user-id');
  });

  describe('checkSpotLimit - 無料ユーザー', () => {
    it('上限未満の場合はtrueを返しアラートなし', async () => {
      mockSupabaseFrom(3, false);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('上限到達（5件）の場合はfalseを返しアップグレード導線付きアラートを表示', async () => {
      mockSupabaseFrom(SUBSCRIPTION.FREE_SPOT_LIMIT, false);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'スポット数の上限',
        expect.stringContaining(`${SUBSCRIPTION.FREE_SPOT_LIMIT}件`),
        expect.arrayContaining([
          expect.objectContaining({ text: 'アップグレード' }),
        ])
      );
    });
  });

  describe('checkSpotLimit - プレミアムユーザー', () => {
    it('プレミアム上限未満の場合はtrueを返しアラートなし', async () => {
      mockSupabaseFrom(8, true);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム上限到達（10件）の場合はfalseを返しアップグレード導線なしのアラートを表示', async () => {
      mockSupabaseFrom(SUBSCRIPTION.PREMIUM_SPOT_LIMIT, true);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        'スポット数の上限',
        expect.stringContaining(`${SUBSCRIPTION.PREMIUM_SPOT_LIMIT}件`)
      );
      // プレミアムユーザーにはボタン配列なし（第3引数なし）
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('checkSpotLimit - エラーケース', () => {
    it('API取得エラー時はtrueを返す（DB側RLSで最終防御）', async () => {
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'maps')
          return createQueryBuilder({ data: null, error: { message: 'error' } });
        if (table === 'users')
          return createQueryBuilder({ data: { is_premium: false }, error: null });
        return createQueryBuilder({ data: null, error: null });
      });

      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
    });

    it('userIdがnullの場合はtrueを返す', async () => {
      mockUserId(null);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
    });
  });

  // -------------------------------------------------------
  // checkSpotLimit 境界値テスト
  // -------------------------------------------------------
  describe('checkSpotLimit 境界値', () => {
    it('無料: 4件(上限-1) → true', async () => {
      mockSupabaseFrom(SUBSCRIPTION.FREE_SPOT_LIMIT - 1, false);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('無料: 5件(上限ちょうど) → false', async () => {
      mockSupabaseFrom(SUBSCRIPTION.FREE_SPOT_LIMIT, false);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('プレミアム: 9件(上限-1) → true', async () => {
      mockSupabaseFrom(SUBSCRIPTION.PREMIUM_SPOT_LIMIT - 1, true);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('プレミアム: 10件(上限ちょうど) → false', async () => {
      mockSupabaseFrom(SUBSCRIPTION.PREMIUM_SPOT_LIMIT, true);
      const { result } = renderHook(() => useSpotLimitGuard());

      let checkResult!: boolean;
      await act(async () => {
        checkResult = await result.current.checkSpotLimit('map-id');
      });

      expect(checkResult).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
