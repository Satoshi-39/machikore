/**
 * useAppSettingsStore のテスト
 *
 * 利用規約・プライバシーポリシーのバージョン同意管理を検証
 * バグがあると同意バイパスやユーザーロックアウトの原因になる
 */

import { useAppSettingsStore } from '../use-app-settings-store';

beforeEach(() => {
  useAppSettingsStore.setState({
    agreedTermsVersion: null,
    agreedPrivacyVersion: null,
  });
});

describe('useAppSettingsStore', () => {
  describe('agreeToTerms', () => {
    it('利用規約とプライバシーポリシーのバージョンが保存される', () => {
      const { agreeToTerms } = useAppSettingsStore.getState();

      agreeToTerms('1.0', '1.0');

      const state = useAppSettingsStore.getState();
      expect(state.agreedTermsVersion).toBe('1.0');
      expect(state.agreedPrivacyVersion).toBe('1.0');
    });

    it('新しいバージョンに同意すると上書きされる', () => {
      const store = useAppSettingsStore.getState();

      store.agreeToTerms('1.0', '1.0');
      store.agreeToTerms('2.0', '1.5');

      const state = useAppSettingsStore.getState();
      expect(state.agreedTermsVersion).toBe('2.0');
      expect(state.agreedPrivacyVersion).toBe('1.5');
    });
  });

  describe('hasAgreedToVersion', () => {
    it('同意済みバージョンと完全一致する場合は true', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');

      expect(store.hasAgreedToVersion('1.0', '1.0')).toBe(true);
    });

    it('利用規約バージョンが異なる場合は false', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');

      expect(store.hasAgreedToVersion('2.0', '1.0')).toBe(false);
    });

    it('プライバシーバージョンが異なる場合は false', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');

      expect(store.hasAgreedToVersion('1.0', '2.0')).toBe(false);
    });

    it('両方異なる場合は false', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');

      expect(store.hasAgreedToVersion('2.0', '2.0')).toBe(false);
    });

    it('未同意状態（null）では false', () => {
      const store = useAppSettingsStore.getState();
      expect(store.hasAgreedToVersion('1.0', '1.0')).toBe(false);
    });
  });

  describe('resetSettings', () => {
    it('同意状態が初期化される', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');

      store.resetSettings();

      const state = useAppSettingsStore.getState();
      expect(state.agreedTermsVersion).toBeNull();
      expect(state.agreedPrivacyVersion).toBeNull();
    });

    it('リセット後は hasAgreedToVersion が false を返す', () => {
      const store = useAppSettingsStore.getState();
      store.agreeToTerms('1.0', '1.0');
      store.resetSettings();

      expect(useAppSettingsStore.getState().hasAgreedToVersion('1.0', '1.0')).toBe(false);
    });
  });
});
