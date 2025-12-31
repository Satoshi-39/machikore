/**
 * SecureStore アダプター for Supabase
 *
 * Supabaseクライアントの storage オプションに渡すためのアダプター
 * AsyncStorage の代わりに SecureStore を使用して認証情報を暗号化保存
 *
 * 注意: SecureStoreには約2KBのサイズ制限があるが、
 * Supabaseのセッション情報は通常この制限内に収まる
 */

import * as SecureStore from 'expo-secure-store';
import { log } from '@/shared/config/logger';

/**
 * Supabaseが要求するストレージインターフェース
 * AsyncStorage互換のインターフェースを実装
 */
export const SecureStorageAdapter = {
  /**
   * 値を取得
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      log.error('[SecureStorageAdapter] getItem error:', error);
      return null;
    }
  },

  /**
   * 値を保存
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      log.error('[SecureStorageAdapter] setItem error:', error);
      // SecureStoreのサイズ制限（約2KB）を超えた場合のエラーハンドリング
      if (error instanceof Error && error.message.includes('size')) {
        log.error('[SecureStorageAdapter] Value too large for SecureStore');
      }
      throw error;
    }
  },

  /**
   * 値を削除
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      log.error('[SecureStorageAdapter] removeItem error:', error);
    }
  },
};
