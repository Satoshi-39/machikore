/**
 * useImageLimitGuard のテスト
 *
 * 無料/プレミアムユーザーの画像上限とアップグレード導線を検証
 */

jest.mock('@/shared/api/supabase', () => ({
  supabase: { from: jest.fn() },
}));
jest.mock('@/entities/user', () => ({ useUserStore: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: jest.fn() }));
jest.mock('@/shared/config/logger', () => ({ log: { error: jest.fn() } }));

import { renderHook, waitFor } from '@testing-library/react-native';
import { useImageLimitGuard } from '../use-image-limit-guard';
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

function mockSupabaseUser(isPremium: boolean) {
  (supabase.from as jest.Mock).mockImplementation(() =>
    createQueryBuilder({ data: { is_premium: isPremium }, error: null })
  );
}

// ===============================
// テスト
// ===============================

describe('useImageLimitGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserId('test-user-id');
  });

  it('無料ユーザーはFREE_IMAGE_LIMIT(4)を返し、アップグレード導線あり', async () => {
    mockSupabaseUser(false);
    const { result } = renderHook(() => useImageLimitGuard());

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalled();
    });

    expect(result.current.imageLimit).toBe(SUBSCRIPTION.FREE_IMAGE_LIMIT);
    expect(result.current.isPremium).toBe(false);
    expect(result.current.handleUpgradePress).toBeDefined();
  });

  it('プレミアムユーザーはPREMIUM_IMAGE_LIMIT(10)を返し、アップグレード導線なし', async () => {
    mockSupabaseUser(true);
    const { result } = renderHook(() => useImageLimitGuard());

    await waitFor(() => {
      expect(result.current.imageLimit).toBe(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT);
    });

    expect(result.current.isPremium).toBe(true);
    expect(result.current.handleUpgradePress).toBeUndefined();
  });

  it('userIdがnullの場合はSupabaseを呼ばずFREE_IMAGE_LIMITを返す', () => {
    mockUserId(null);
    const { result } = renderHook(() => useImageLimitGuard());

    expect(supabase.from).not.toHaveBeenCalled();
    expect(result.current.imageLimit).toBe(SUBSCRIPTION.FREE_IMAGE_LIMIT);
  });

  // -------------------------------------------------------
  // 画像上限の境界値テスト
  // -------------------------------------------------------
  describe('画像上限 境界値', () => {
    it('無料: imageLimit == 4(FREE_IMAGE_LIMIT) → 3枚(上限-1)はOK', async () => {
      mockSupabaseUser(false);
      const { result } = renderHook(() => useImageLimitGuard());

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // imageLimit=4 なので 3枚は追加可能
      expect(result.current.imageLimit).toBe(SUBSCRIPTION.FREE_IMAGE_LIMIT);
      expect(3 < result.current.imageLimit).toBe(true);
    });

    it('無料: imageLimit == 4(FREE_IMAGE_LIMIT) → 4枚(上限ちょうど)はNG', async () => {
      mockSupabaseUser(false);
      const { result } = renderHook(() => useImageLimitGuard());

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // imageLimit=4 なので 4枚は追加不可（呼び出し元で currentCount >= imageLimit で判定）
      expect(result.current.imageLimit).toBe(SUBSCRIPTION.FREE_IMAGE_LIMIT);
      expect(4 >= result.current.imageLimit).toBe(true);
    });

    it('プレミアム: imageLimit == 10(PREMIUM_IMAGE_LIMIT) → 9枚(上限-1)はOK', async () => {
      mockSupabaseUser(true);
      const { result } = renderHook(() => useImageLimitGuard());

      await waitFor(() => {
        expect(result.current.imageLimit).toBe(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT);
      });

      expect(9 < result.current.imageLimit).toBe(true);
    });

    it('プレミアム: imageLimit == 10(PREMIUM_IMAGE_LIMIT) → 10枚(上限ちょうど)はNG', async () => {
      mockSupabaseUser(true);
      const { result } = renderHook(() => useImageLimitGuard());

      await waitFor(() => {
        expect(result.current.imageLimit).toBe(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT);
      });

      expect(10 >= result.current.imageLimit).toBe(true);
    });
  });
});
