/**
 * LargeSecureStore - 大きなデータを安全に保存するためのアダプター
 *
 * Supabaseクライアントの storage オプションに渡すためのアダプター
 * SecureStoreの2KB制限を回避しつつ、暗号化によるセキュリティを確保
 *
 * 仕組み:
 * 1. AES-256暗号化キー（32バイト）をSecureStoreに保存
 * 2. セッションデータをAES-CTRモードで暗号化
 * 3. 暗号化されたデータをAsyncStorageに保存（サイズ制限なし）
 *
 * セキュリティ改善（Zenn記事参照）:
 * - 鍵の永続化: 既存の鍵があれば再利用、なければ新規生成
 * - ランダムIV: 暗号化のたびに新しいIVを生成（CTRモードのカウンター初期値）
 * - IV保存: IVは暗号文の先頭に結合して保存（IVは秘密情報ではない）
 *
 * @see https://zenn.dev/rei2718/articles/80f5903602cbe9
 * @see https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import 'react-native-get-random-values';

// 暗号化キーを保存するためのSecureStoreキー
const ENCRYPTION_KEY_PREFIX = '_encryption_key_';
// IVのバイト長（AES-CTRモードでは16バイト）
const IV_LENGTH = 16;

/**
 * 大きなデータを暗号化して保存するストレージアダプター
 * Supabaseの storage インターフェースに準拠
 */
class LargeSecureStore {
  /**
   * 暗号化キーを取得（存在しなければ新規生成して保存）
   */
  private async _getEncryptionKey(key: string): Promise<Uint8Array> {
    const storageKey = ENCRYPTION_KEY_PREFIX + key;

    try {
      // 既存のキーを取得
      const existingKeyHex = await SecureStore.getItemAsync(storageKey);
      if (existingKeyHex) {
        return aesjs.utils.hex.toBytes(existingKeyHex);
      }

      // 新しい256ビット（32バイト）キーを生成
      const newKey = crypto.getRandomValues(new Uint8Array(32));
      await SecureStore.setItemAsync(
        storageKey,
        aesjs.utils.hex.fromBytes(newKey),
        { keychainAccessible: SecureStore.WHEN_UNLOCKED }
      );

      return newKey;
    } catch (error) {
      console.error('[LargeSecureStore] Failed to get/create encryption key:', error);
      throw error;
    }
  }

  /**
   * データを暗号化
   * @returns IV（16バイト）+ 暗号文 を16進数文字列で結合したもの
   */
  private async _encrypt(key: string, value: string): Promise<string> {
    try {
      const encryptionKey = await this._getEncryptionKey(key);

      // ランダムなIV（初期カウンター値）を生成
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

      // AES-CTRモードで暗号化（IVをカウンター初期値として使用）
      const counter = new aesjs.Counter(iv);
      const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, counter);
      const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

      // IV + 暗号文 を結合して返す
      const ivHex = aesjs.utils.hex.fromBytes(iv);
      const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

      return ivHex + encryptedHex;
    } catch (error) {
      console.error('[LargeSecureStore] Encryption failed:', error);
      throw error;
    }
  }

  /**
   * データを復号
   * @param value IV（16バイト = 32文字の16進数）+ 暗号文
   */
  private async _decrypt(key: string, value: string): Promise<string | null> {
    try {
      const encryptionKey = await this._getEncryptionKey(key);

      // IVと暗号文を分離（IVは16バイト = 32文字の16進数）
      const ivHex = value.slice(0, IV_LENGTH * 2);
      const encryptedHex = value.slice(IV_LENGTH * 2);

      const iv = aesjs.utils.hex.toBytes(ivHex);
      const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

      // AES-CTRモードで復号
      const counter = new aesjs.Counter(iv);
      const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, counter);
      const decryptedBytes = cipher.decrypt(encryptedBytes);

      return aesjs.utils.utf8.fromBytes(decryptedBytes);
    } catch (error) {
      console.error('[LargeSecureStore] Decryption failed:', error);
      // 復号に失敗した場合はnullを返す（データ破損などの場合）
      return null;
    }
  }

  /**
   * 値を取得（Supabase storage インターフェース）
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) {
        return null;
      }
      return await this._decrypt(key, encrypted);
    } catch (error) {
      console.error('[LargeSecureStore] getItem error:', error);
      return null;
    }
  }

  /**
   * 値を保存（Supabase storage インターフェース）
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this._encrypt(key, value);
      await AsyncStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('[LargeSecureStore] setItem error:', error);
      throw error;
    }
  }

  /**
   * 値を削除（Supabase storage インターフェース）
   */
  async removeItem(key: string): Promise<void> {
    try {
      // AsyncStorageから暗号化データを削除
      await AsyncStorage.removeItem(key);
      // SecureStoreから暗号化キーを削除
      await SecureStore.deleteItemAsync(ENCRYPTION_KEY_PREFIX + key);
    } catch (error) {
      console.error('[LargeSecureStore] removeItem error:', error);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const LargeSecureStorageAdapter = new LargeSecureStore();
